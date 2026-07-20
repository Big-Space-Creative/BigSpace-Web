import * as THREE from 'three'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const lerp = (current, target, amount) => current + (target - current) * amount
const randomBetween = (min, max) => min + Math.random() * (max - min)

const VERTEX_SHADER = `
  attribute float aOpacity;
  attribute float aSeed;
  attribute float aFade;
  attribute float aDepth;

  uniform float uTime;

  varying vec2 vUv;
  varying float vOpacity;
  varying float vSeed;
  varying float vFade;

  void main() {
    vUv = uv;
    vOpacity = aOpacity;
    vSeed = aSeed;
    vFade = aFade;

    vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
    float breakup = smoothstep(0.08, 1.3, aFade);
    float turbulence = sin(position.x * 12.0 + position.y * 8.0 + uTime * 0.85 + aSeed * 11.0);
    float softLift = (0.35 + uv.y * 0.65) * (8.0 + aDepth * 24.0);

    worldPosition.x += breakup * (12.0 + aDepth * 24.0) * (0.35 + uv.x * 0.65);
    worldPosition.x += turbulence * breakup * (4.0 + aDepth * 7.0);
    worldPosition.y += breakup * softLift;
    worldPosition.y += turbulence * breakup * (3.0 + aDepth * 5.0);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const FRAGMENT_SHADER = `
  uniform sampler2D uTexture;
  uniform float uTime;

  varying vec2 vUv;
  varying float vOpacity;
  varying float vSeed;
  varying float vFade;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);

    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), local.x),
      local.y
    );
  }

  void main() {
    vec4 cloud = texture2D(uTexture, vUv);
    float fineNoise = noise(vUv * 13.0 + vec2(vSeed * 17.0, uTime * 0.035));
    float broadNoise = noise(vUv * 4.5 + vec2(vSeed * 7.0, -uTime * 0.018));
    float density = cloud.a + fineNoise * 0.07 + broadNoise * 0.12;
    float organicVisibility = smoothstep(vFade - 0.08, vFade + 0.18, density);
    float alpha = cloud.a * organicVisibility * vOpacity;

    if (alpha < 0.002) discard;

    vec3 coolWhite = vec3(0.84, 0.89, 0.94);
    vec3 color = mix(cloud.rgb, coolWhite, 0.2 + broadNoise * 0.08);
    gl_FragColor = vec4(color, alpha);
  }
`

const LAYER_PRESETS = [
  { depth: 0.22, count: 16, size: [0.28, 0.48], opacity: [0.12, 0.2], speed: [3, 5] },
  { depth: 0.42, count: 14, size: [0.34, 0.58], opacity: [0.14, 0.23], speed: [4, 7] },
  { depth: 0.64, count: 11, size: [0.4, 0.66], opacity: [0.16, 0.26], speed: [5, 9] },
  { depth: 0.82, count: 8, size: [0.48, 0.76], opacity: [0.18, 0.29], speed: [7, 11] },
  { depth: 1, count: 5, size: [0.58, 0.9], opacity: [0.2, 0.32], speed: [8, 13] },
]

export class CloudFieldWebGL {
  constructor(canvas, textureUrl = '/cloud-bank.png') {
    this.canvas = canvas
    this.textureUrl = textureUrl
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera()
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setClearColor(0x000000, 0)

    this.width = 1
    this.height = 1
    this.layers = []
    this.texture = null
    this.textureAlpha = null
    this.textureAlphaWidth = 0
    this.textureAlphaHeight = 0
    this.material = null
    this.animationFrameId = null
    this.lastFrameTime = 0
    this.active = true
    this.reducedMotion = false
    this.destroyed = false
    this.dummy = new THREE.Object3D()
    this.pointer = new THREE.Vector2(0, 0)
    this.pointerTarget = new THREE.Vector2(0, 0)
    this.interaction = {
      pointerX: 0,
      pointerY: 0,
      scrollProgress: 0,
      pointerActive: false,
    }

    this.uniforms = {
      uTexture: { value: null },
      uTime: { value: 0 },
    }

    this.loadTexture()
  }

  loadTexture() {
    new THREE.TextureLoader().load(
      this.textureUrl,
      (texture) => {
        if (this.destroyed) {
          texture.dispose()
          return
        }

        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.generateMipmaps = true
        this.texture = texture
        this.uniforms.uTexture.value = texture
        this.captureTextureAlpha(texture.image)
        this.buildField()
        this.start()
      },
      undefined,
      () => {
        this.canvas.dataset.cloudError = 'texture'
      },
    )
  }

  captureTextureAlpha(image) {
    const alphaCanvas = document.createElement('canvas')
    const alphaContext = alphaCanvas.getContext('2d', { willReadFrequently: true })
    alphaCanvas.width = 256
    alphaCanvas.height = 128
    alphaContext.drawImage(image, 0, 0, alphaCanvas.width, alphaCanvas.height)

    this.textureAlpha = alphaContext.getImageData(
      0,
      0,
      alphaCanvas.width,
      alphaCanvas.height,
    ).data
    this.textureAlphaWidth = alphaCanvas.width
    this.textureAlphaHeight = alphaCanvas.height
  }

  sampleTextureAlpha(u, v) {
    if (!this.textureAlpha || u < 0 || u > 1 || v < 0 || v > 1) return 0

    const x = Math.min(this.textureAlphaWidth - 1, Math.floor(u * this.textureAlphaWidth))
    const y = Math.min(
      this.textureAlphaHeight - 1,
      Math.floor((1 - v) * this.textureAlphaHeight),
    )

    return this.textureAlpha[(y * this.textureAlphaWidth + x) * 4 + 3] / 255
  }

  buildField() {
    this.disposeLayers()

    this.material ??= new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })

    const mobileFactor = this.width < 768 ? 0.58 : 1

    LAYER_PRESETS.forEach((preset, layerIndex) => {
      const count = Math.max(3, Math.round(preset.count * mobileFactor))
      const geometry = new THREE.PlaneGeometry(1, 1, 14, 8)
      const opacity = new Float32Array(count)
      const seed = new Float32Array(count)
      const fade = new Float32Array(count)
      const depth = new Float32Array(count)
      const clouds = []

      geometry.setAttribute('aOpacity', new THREE.InstancedBufferAttribute(opacity, 1))
      geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 1))
      geometry.setAttribute('aFade', new THREE.InstancedBufferAttribute(fade, 1))
      geometry.setAttribute('aDepth', new THREE.InstancedBufferAttribute(depth, 1))

      const mesh = new THREE.InstancedMesh(geometry, this.material, count)
      mesh.frustumCulled = false
      mesh.renderOrder = layerIndex

      for (let index = 0; index < count; index += 1) {
        const cloud = { depth: preset.depth }
        this.resetCloud(cloud, preset, true)
        clouds.push(cloud)
        opacity[index] = cloud.opacity
        seed[index] = cloud.seed
        fade[index] = 0
        depth[index] = preset.depth
      }

      this.layers.push({ preset, clouds, mesh, geometry, opacity, fade })
      this.scene.add(mesh)
    })
  }

  resetCloud(cloud, preset, initial = false) {
    const minimumDimension = Math.min(this.width, this.height * 1.65)
    const width = minimumDimension * randomBetween(preset.size[0], preset.size[1])
    const yBias = (Math.random() + Math.random()) * 0.5

    cloud.width = width
    cloud.height = width * randomBetween(0.46, 0.54)
    cloud.x = initial
      ? randomBetween(-this.width * 0.7, this.width * 0.7)
      : -this.width * 0.5 - width * randomBetween(0.55, 1.15)
    cloud.baseY = this.height * (0.55 - yBias * 1.1)
    cloud.speed = randomBetween(preset.speed[0], preset.speed[1])
    cloud.opacity = randomBetween(preset.opacity[0], preset.opacity[1])
    cloud.seed = Math.random()
    cloud.phase = randomBetween(0, Math.PI * 2)
    cloud.rotation = randomBetween(-0.035, 0.035)
    cloud.fade = 0
    cloud.fadeTarget = 0
  }

  setInteraction(nextInteraction) {
    Object.assign(this.interaction, nextInteraction)
    this.pointerTarget.set(
      this.interaction.pointerX * this.width * 0.5,
      -this.interaction.pointerY * this.height * 0.5,
    )

    if (this.reducedMotion) this.render()
    else this.start()
  }

  setActive(active) {
    this.active = active
    if (active) this.start()
    else this.stop()
  }

  setReducedMotion(reducedMotion) {
    this.reducedMotion = reducedMotion
    if (reducedMotion) {
      this.stop()
      this.render()
    } else {
      this.start()
    }
  }

  resize(width, height) {
    const previousMobile = this.width < 768
    this.width = Math.max(1, width)
    this.height = Math.max(1, height)
    const nextMobile = this.width < 768

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    this.renderer.setSize(this.width, this.height, false)
    this.camera.left = -this.width / 2
    this.camera.right = this.width / 2
    this.camera.top = this.height / 2
    this.camera.bottom = -this.height / 2
    this.camera.near = -10
    this.camera.far = 10
    this.camera.position.z = 2
    this.camera.updateProjectionMatrix()
    if (this.texture && (this.layers.length === 0 || previousMobile !== nextMobile)) {
      this.buildField()
    }

    this.render()
  }

  updateCloud(layer, cloud, index, delta, time) {
    const { preset } = layer
    const scroll = this.interaction.scrollProgress

    if (!this.reducedMotion) {
      cloud.x += cloud.speed * delta
      cloud.phase += delta * (0.08 + preset.depth * 0.13)
    }

    const pointerParallaxX = this.pointer.x * preset.depth * 0.08
    const pointerParallaxY = this.pointer.y * preset.depth * 0.045
    const scrollY = scroll * this.height * (0.08 + preset.depth * 0.2)
    const wave = Math.sin(cloud.phase + time * 0.00005) * (3 + preset.depth * 7)
    const x = cloud.x + pointerParallaxX
    const y = cloud.baseY - scrollY + pointerParallaxY + wave
    const scale = 1 + scroll * preset.depth * 0.28
    const width = cloud.width * scale
    const height = cloud.height * scale

    if (!this.reducedMotion && this.interaction.pointerActive) {
      const pointerDeltaX = this.pointer.x - x
      const pointerDeltaY = this.pointer.y - y
      const cosine = Math.cos(cloud.rotation)
      const sine = Math.sin(cloud.rotation)
      const localX = pointerDeltaX * cosine + pointerDeltaY * sine
      const localY = -pointerDeltaX * sine + pointerDeltaY * cosine
      const textureU = localX / Math.max(width, 1) + 0.5
      const textureV = localY / Math.max(height, 1) + 0.5

      if (this.sampleTextureAlpha(textureU, textureV) > 0.075) {
        cloud.fadeTarget = 1.42
      }
    }

    cloud.fade = lerp(cloud.fade, cloud.fadeTarget, 1 - Math.exp(-delta * 0.72))

    if (cloud.fade > 1.36 || x > this.width * 0.5 + width) {
      this.resetCloud(cloud, preset)
      this.updateCloud(layer, cloud, index, 0, time)
      return
    }

    const exitOpacity = clamp(1 - scroll * (0.42 + preset.depth * 0.72), 0, 1)
    layer.opacity[index] = cloud.opacity * exitOpacity
    layer.fade[index] = cloud.fade

    this.dummy.position.set(x, y, -preset.depth)
    this.dummy.rotation.set(0, 0, cloud.rotation)
    this.dummy.scale.set(width, height, 1)
    this.dummy.updateMatrix()
    layer.mesh.setMatrixAt(index, this.dummy.matrix)
  }

  renderFrame = (time) => {
    this.animationFrameId = null
    if (!this.active || this.destroyed || !this.texture) return

    const delta = Math.min((time - this.lastFrameTime) / 1000 || 0, 0.05)
    this.lastFrameTime = time
    this.uniforms.uTime.value = time / 1000
    this.pointer.lerp(this.pointerTarget, 1 - Math.exp(-delta * 7.5))

    this.layers.forEach((layer) => {
      layer.clouds.forEach((cloud, index) => {
        this.updateCloud(layer, cloud, index, delta, time)
      })
      layer.mesh.instanceMatrix.needsUpdate = true
      layer.geometry.getAttribute('aOpacity').needsUpdate = true
      layer.geometry.getAttribute('aFade').needsUpdate = true
    })

    this.render()

    if (!this.reducedMotion) {
      this.animationFrameId = requestAnimationFrame(this.renderFrame)
    }
  }

  render() {
    if (!this.destroyed) this.renderer.render(this.scene, this.camera)
  }

  start() {
    if (
      this.animationFrameId ||
      this.reducedMotion ||
      !this.active ||
      !this.texture ||
      this.destroyed
    ) {
      return
    }

    this.lastFrameTime = performance.now()
    this.animationFrameId = requestAnimationFrame(this.renderFrame)
  }

  stop() {
    if (!this.animationFrameId) return
    cancelAnimationFrame(this.animationFrameId)
    this.animationFrameId = null
  }

  disposeLayers() {
    this.layers.forEach(({ mesh, geometry }) => {
      this.scene.remove(mesh)
      geometry.dispose()
    })
    this.layers = []
  }

  destroy() {
    this.destroyed = true
    this.stop()
    this.disposeLayers()
    this.material?.dispose()
    this.texture?.dispose()
    this.renderer.dispose()
  }
}
