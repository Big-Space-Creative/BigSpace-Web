<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  pointerX: {
    type: Number,
    default: 0,
  },
  pointerY: {
    type: Number,
    default: 0,
  },
  scrollProgress: {
    type: Number,
    default: 0,
  },
  pointerActive: {
    type: Boolean,
    default: false,
  },
})

const canvasRef = ref(null)

let cloudField = null
let resizeObserver = null
let visibilityObserver = null
let reduceMotionQuery = null
let isUnmounted = false

const syncInteraction = () => {
  cloudField?.setInteraction({
    pointerX: props.pointerX,
    pointerY: props.pointerY,
    scrollProgress: props.scrollProgress,
    pointerActive: props.pointerActive,
  })
}

const handleResize = ([entry]) => {
  cloudField?.resize(entry.contentRect.width, entry.contentRect.height)
}

const handleVisibility = ([entry]) => {
  cloudField?.setActive(entry.isIntersecting)
}

const handleMotionPreference = (event) => {
  cloudField?.setReducedMotion(event.matches)
}

watch(
  () => [props.pointerX, props.pointerY, props.scrollProgress, props.pointerActive],
  syncInteraction,
)

onMounted(async () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const { CloudFieldWebGL } = await import('../lib/clouds/CloudFieldWebGL')
  if (isUnmounted) return

  cloudField = new CloudFieldWebGL(canvas)
  reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  cloudField.setReducedMotion(reduceMotionQuery.matches)
  reduceMotionQuery.addEventListener('change', handleMotionPreference)

  resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(canvas)

  visibilityObserver = new IntersectionObserver(handleVisibility)
  visibilityObserver.observe(canvas)

  const rect = canvas.getBoundingClientRect()
  cloudField.resize(rect.width, rect.height)
  syncInteraction()
})

onUnmounted(() => {
  isUnmounted = true
  resizeObserver?.disconnect()
  visibilityObserver?.disconnect()
  reduceMotionQuery?.removeEventListener('change', handleMotionPreference)
  cloudField?.destroy()
})
</script>

<template>
  <canvas ref="canvasRef" class="cloud-field" aria-hidden="true"></canvas>
</template>

<style scoped>
.cloud-field {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
