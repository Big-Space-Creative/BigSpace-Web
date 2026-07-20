import { computed, onMounted, onUnmounted, ref } from 'vue'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const lerp = (current, target, amount) => current + (target - current) * amount

export const useHeroMotion = (sectionRef) => {
  const pointerX = ref(0)
  const pointerY = ref(0)
  const scrollProgress = ref(0)
  const pointerActive = ref(false)
  const motionActive = ref(false)

  const target = {
    pointerX: 0,
    pointerY: 0,
    scrollProgress: 0,
  }

  let animationFrameId = null
  let reduceMotionQuery = null
  let prefersReducedMotion = false

  const animate = () => {
    animationFrameId = null

    pointerX.value = lerp(pointerX.value, target.pointerX, 0.075)
    pointerY.value = lerp(pointerY.value, target.pointerY, 0.075)
    scrollProgress.value = lerp(scrollProgress.value, target.scrollProgress, 0.09)

    const stillMoving =
      Math.abs(pointerX.value - target.pointerX) > 0.001 ||
      Math.abs(pointerY.value - target.pointerY) > 0.001 ||
      Math.abs(scrollProgress.value - target.scrollProgress) > 0.001

    motionActive.value = stillMoving || pointerActive.value

    if (stillMoving) animationFrameId = requestAnimationFrame(animate)
  }

  const requestMotionFrame = () => {
    if (!animationFrameId) animationFrameId = requestAnimationFrame(animate)
  }

  const handlePointerMove = (event) => {
    if (prefersReducedMotion || !sectionRef.value) return

    const rect = sectionRef.value.getBoundingClientRect()
    target.pointerX = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1)
    target.pointerY = clamp(
      ((event.clientY - Math.max(rect.top, 0)) / window.innerHeight) * 2 - 1,
      -1,
      1,
    )
    pointerActive.value = true
    requestMotionFrame()
  }

  const handlePointerLeave = () => {
    target.pointerX = 0
    target.pointerY = 0
    pointerActive.value = false
    requestMotionFrame()
  }

  const handleScroll = () => {
    if (!sectionRef.value) return

    const rect = sectionRef.value.getBoundingClientRect()
    const scrollableDistance = Math.max(rect.height - window.innerHeight, 1)
    target.scrollProgress = prefersReducedMotion ? 0 : clamp(-rect.top / scrollableDistance, 0, 1)
    requestMotionFrame()
  }

  const handleMotionPreference = (event) => {
    prefersReducedMotion = event.matches
    if (prefersReducedMotion) {
      target.pointerX = 0
      target.pointerY = 0
      target.scrollProgress = 0
      pointerActive.value = false
    }
    requestMotionFrame()
  }

  const imageStyle = computed(() => {
    const x = pointerX.value * 10
    const y = pointerY.value * 7 - scrollProgress.value * 20
    const scale = 1.025 + scrollProgress.value * 0.135

    return {
      transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    }
  })

  onMounted(() => {
    reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion = reduceMotionQuery.matches
    reduceMotionQuery.addEventListener('change', handleMotionPreference)

    sectionRef.value?.addEventListener('pointermove', handlePointerMove, { passive: true })
    sectionRef.value?.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    handleScroll()
  })

  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    reduceMotionQuery?.removeEventListener('change', handleMotionPreference)
    sectionRef.value?.removeEventListener('pointermove', handlePointerMove)
    sectionRef.value?.removeEventListener('pointerleave', handlePointerLeave)
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
  })

  return {
    imageStyle,
    motionActive,
    pointerActive,
    pointerX,
    pointerY,
    scrollProgress,
  }
}
