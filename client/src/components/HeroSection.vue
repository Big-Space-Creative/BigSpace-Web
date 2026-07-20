<script setup>
import { ref } from 'vue'
import CloudDrift from './CloudDrift.vue'
import { useHeroMotion } from '../composables/useHeroMotion'

const isNavOpen = ref(false)
const heroSection = ref(null)

const { imageStyle, motionActive, pointerActive, pointerX, pointerY, scrollProgress } =
  useHeroMotion(heroSection)

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
}
</script>

<template>
  <section ref="heroSection" class="hero-section">
    <div class="hero-viewport" :class="{ 'is-moving': motionActive }">
      <img
        src="/hero-bg.png"
        alt="Arte espacial com planeta"
        class="hero-background"
        :style="imageStyle"
      />
      <CloudDrift
        :pointer-x="pointerX"
        :pointer-y="pointerY"
        :scroll-progress="scrollProgress"
        :pointer-active="pointerActive"
      />

      <header class="hero-header">
        <div class="brand-logo">
          <svg
            class="brand-logo-svg"
            width="157"
            height="35"
            viewBox="0 0 157 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.797 5.58016H5.5427V10.3364H11.797C13.1077 10.3364 14.1938 9.28777 14.1938 7.977C14.1938 6.62878 13.1077 5.58016 11.797 5.58016ZM12.9579 15.9165H5.5427V20.6728H12.9579C14.2687 20.6728 15.3173 19.6242 15.3173 18.2759C15.3173 16.9652 14.2687 15.9165 12.9579 15.9165ZM0 26.2155V0H11.797C16.1787 0.0374502 19.7365 3.59527 19.7365 7.977C19.7365 9.58738 19.2497 11.1603 18.3134 12.4711C19.9612 13.9691 20.8975 16.0664 20.8975 18.2759C20.86 22.6577 17.3022 26.2155 12.9579 26.2155H0Z"
              fill="currentColor"
            />
            <path
              d="M43.2605 16.4783V14.6807C43.298 11.2352 45.5076 8.16425 48.8032 7.11563V16.4783C48.8032 20.8226 45.957 24.6051 41.7999 25.841C37.6804 27.0394 33.2237 25.3916 30.9018 21.7214C28.5424 18.0887 28.9169 13.3699 31.7257 10.1117C34.572 6.85348 39.2159 5.84231 43.1482 7.63994C41.9123 9.06307 41.0509 10.7858 40.6764 12.6209C39.1409 11.9842 37.3059 12.3213 36.1074 13.5197C34.909 14.7181 34.572 16.5158 35.2086 18.0887C35.8453 19.6616 37.3808 20.6728 39.0661 20.6728C40.1896 20.7102 41.2756 20.2608 42.0621 19.4744C42.8486 18.6879 43.298 17.6018 43.2605 16.4783ZM29.4412 26.2155H35.1337C35.7329 27.9008 37.3059 29.0243 39.0661 29.0243C40.8637 29.0243 42.4366 27.9008 43.0358 26.2155H48.7283C48.0168 31.0092 43.8972 34.567 39.0661 34.567C34.2349 34.567 30.1528 31.0092 29.4412 26.2155Z"
              fill="currentColor"
            />
            <path
              d="M64.3883 10.3364H67.1222C79.2188 10.3364 79.2188 26.2155 67.1222 26.2155H64.3883C58.9579 26.2155 55.9619 22.9947 55.4376 19.4369L60.793 18.2759C60.793 19.4744 61.9914 20.6728 64.3883 20.6728H67.1222C71.9533 20.6728 71.9533 15.9165 67.1222 15.9165H64.3883C52.3292 15.9165 52.3292 0 64.3883 0H67.1222C72.59 0 75.586 3.25821 76.1104 6.81603L70.7549 7.977C70.7549 6.77858 69.5565 5.58016 67.1222 5.58016H64.3883C59.5571 5.58016 59.5571 10.3364 64.3883 10.3364Z"
              fill="currentColor"
            />
            <path
              d="M83.2617 14.6807V16.4783C83.2242 17.6018 83.6736 18.6879 84.4601 19.4744C85.2466 20.2608 86.3326 20.7102 87.4562 20.6728C89.1414 20.6728 90.6769 19.6616 91.3136 18.0887C91.9502 16.5158 91.6132 14.7181 90.4148 13.5197C89.2163 12.3213 87.3812 11.9842 85.8458 12.6209C85.4713 10.7858 84.6099 9.06307 83.374 7.63994C87.4936 5.76741 92.3247 6.92838 95.1335 10.4862C97.9049 14.044 97.8674 19.0624 95.0212 22.5828C92.2124 26.1031 87.3438 27.2267 83.2617 25.2792V34.567H77.719V7.11563C81.0146 8.16425 83.2242 11.2352 83.2617 14.6807Z"
              fill="currentColor"
            />
            <path
              d="M127.65 6.74113C131.769 6.74113 135.477 9.36268 136.825 13.2575L131.32 14.4934C130.421 12.8081 128.474 11.9468 126.601 12.4336C124.766 12.883 123.455 14.5683 123.455 16.4783C123.455 18.4257 124.766 20.0736 126.601 20.5604C128.474 21.0098 130.421 20.1485 131.32 18.4632L136.825 19.6991C135.177 24.3804 130.309 27.0769 125.478 25.9908C120.647 24.9047 117.388 20.3357 117.95 15.3922C118.512 10.4862 122.669 6.74113 127.65 6.74113Z"
              fill="currentColor"
            />
            <path
              d="M142.987 14.7181H150.589C149.878 13.2575 148.417 12.3213 146.807 12.3213C145.159 12.3213 143.698 13.2575 142.987 14.7181ZM146.807 26.2155C142.687 26.2155 139.017 23.6688 137.631 19.8114C136.246 15.954 137.407 11.6097 140.552 8.98817C143.736 6.36662 148.192 6.02956 151.713 8.08935C155.271 10.1866 157.106 14.2313 156.357 18.2759H142.987C143.661 19.6991 145.084 20.6353 146.694 20.6728C148.267 20.7102 149.728 19.8863 150.477 18.4632L155.982 19.6991C154.634 23.6314 150.926 26.2155 146.807 26.2155Z"
              fill="currentColor"
            />
            <path
              d="M111.516 18.2759V16.4783C111.554 15.3922 111.104 14.3062 110.318 13.5197C109.531 12.7332 108.445 12.2838 107.322 12.3213C105.636 12.3213 104.101 13.3324 103.464 14.9054C102.828 16.4783 103.165 18.2759 104.363 19.4744C105.562 20.6728 107.397 21.0098 108.932 20.3732C109.307 22.2083 110.168 23.931 111.404 25.3541C107.471 27.1518 102.828 26.1406 99.9814 22.8824C97.1726 19.6242 96.798 14.8679 99.1574 11.2352C101.479 7.60249 105.936 5.95466 110.056 7.15309C114.213 8.35151 117.059 12.1715 117.059 16.4783V25.8784C113.763 24.8298 111.516 21.7589 111.516 18.2759Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M22.3709 6.74113V26.2155H27.9136V6.74113H22.3709Z"
              fill="currentColor"
            />
            <path
              d="M25.1423 0C26.6778 0 27.9136 1.27333 27.9136 2.8088C27.9136 4.34428 26.6778 5.58016 25.1423 5.58016C23.6068 5.58016 22.3709 4.34428 22.3709 2.8088C22.3709 1.27333 23.6068 0 25.1423 0Z"
              fill="#0870D7"
            />
          </svg>
        </div>

        <div class="nav-actions">
          <button class="btn-iniciar" aria-label="Iniciar projeto">
            <span class="arrow-icon">↗</span>
            <span class="btn-text">Iniciar</span>
          </button>
          <button class="btn-menu" @click="toggleNav" aria-label="Menu principal">
            <div class="hamburger-lines" :class="{ open: isNavOpen }">
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </header>

      <!-- Main Hero Body -->
      <div class="hero-content">
        <!-- Main Left Headline -->
        <h1 class="hero-title">
          <span class="title-line line-1">Espaço</span>
          <span class="title-line line-2">Para</span>
          <span class="title-line line-3">Crescer</span>
        </h1>

        <!-- Bottom Right Subtitle and Link -->
        <div class="hero-sub">
          <p class="hero-description">
            Produtos digitais sob medida<br />
            para marcas que querem<br />
            sair do papel e crescer.
          </p>
          <a href="#servicos" class="hero-link">
            <span>Nossos Serviços</span>
            <span class="link-underline"></span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  height: 180vh;
  width: 100%;
  background-color: var(--bg-hero);
}

.hero-viewport {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 100%;
  background-color: var(--bg-hero);
  overflow: hidden;
  user-select: none;
}

.hero-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right center;
  z-index: 1;
}

.hero-viewport.is-moving .hero-background {
  will-change: transform;
}

/* Header Navbar */
.hero-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
}

@media (min-width: 768px) {
  .hero-header {
    padding: 36px 54px;
  }
}

.brand-logo {
  display: flex;
  align-items: center;
}

.brand-logo-svg {
  height: 28px;
  width: auto;
  color: var(--text-main);
  display: block;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Iniciar CTA Button */
.btn-iniciar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--btn-dark);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.btn-iniciar:hover {
  background-color: var(--btn-dark-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.arrow-icon {
  font-size: 14px;
  transition: transform 0.2s ease;
}

.btn-iniciar:hover .arrow-icon {
  transform: translate(2px, -2px);
}

/* Hamburger Menu Button */
.btn-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background-color: transparent;
  border: 1.5px solid rgba(12, 13, 16, 0.35);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-menu:hover {
  background-color: rgba(12, 13, 16, 0.05);
  border-color: rgba(12, 13, 16, 0.7);
}

.hamburger-lines {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 16px;
}

.hamburger-lines span {
  display: block;
  width: 100%;
  height: 1.5px;
  background-color: var(--text-main);
  transition: all 0.3s ease;
}

.hamburger-lines.open span:nth-child(1) {
  transform: translateY(3.25px) rotate(45deg);
}

.hamburger-lines.open span:nth-child(2) {
  transform: translateY(-3.25px) rotate(-45deg);
}

/* Hero Content Area */
.hero-content {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding: 0 28px 40px 28px;
}

@media (min-width: 768px) {
  .hero-content {
    flex-direction: row;
    align-items: flex-end;
    padding: 0 54px 54px 54px;
  }
}

/* Left Display Title matching screenshot staggered staircase indentation */
.hero-title {
  display: flex;
  flex-direction: column;
  font-family:
    'SF Pro Display',
    -apple-system,
    BlinkMacSystemFont,
    'Inter',
    sans-serif;
  font-size: clamp(48px, 8.5vw, 115px);
  font-weight: 600;
  line-height: 0.92;
  letter-spacing: -0.04em;
  color: #111317;
  margin-bottom: 30px;
}

@media (min-width: 768px) {
  .hero-title {
    margin-bottom: 0;
  }
}

/* Standard stacked title alignment flush left */
.title-line {
  display: block;
  margin-left: 0;
  will-change: transform, opacity;
}

/* Bottom Right Subtitle Box */
.hero-sub {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 320px;
  margin-bottom: 12px;
}

@media (min-width: 992px) {
  .hero-sub {
    margin-right: 20px;
    margin-bottom: 20px;
  }
}

.hero-description {
  font-size: clamp(15px, 1.3vw, 18px);
  line-height: 1.45;
  color: #2a2e35;
  font-weight: 500;
  margin-bottom: 20px;
  letter-spacing: -0.01em;
}

.hero-link {
  position: relative;
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  text-decoration: none;
  padding-bottom: 4px;
  transition: color 0.2s ease;
}

.link-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.5px;
  background-color: var(--text-main);
  transition: width 0.3s ease;
}

.hero-link:hover .link-underline {
  width: 60%;
}
</style>
