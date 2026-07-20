<script setup>
import HeroSection from './components/HeroSection.vue'
</script>

<template>
  <main class="app-main">
    <HeroSection />
  </main>
</template>

<style scoped>
.app-main {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-outer);
}
</style>
