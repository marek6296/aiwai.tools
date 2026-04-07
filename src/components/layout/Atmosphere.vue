<template>
  <div class="atmosphere">
    <div class="noise-overlay"></div>
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'

onMounted(() => {
  // Ultra-smooth, slow animations with reduced complexity
  gsap.to('.orb-1', {
    x: '15vw',
    y: '8vh',
    duration: 20,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
  
  gsap.to('.orb-2', {
    x: '-10vw',
    y: '-15vh',
    duration: 25,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 2
  })
  
  gsap.to('.orb-3', {
    x: '8vw',
    y: '-10vh',
    duration: 18,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 5
  })
})
</script>

<style scoped>
.atmosphere {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-color: var(--bg-deep);
  overflow: hidden;
  pointer-events: none;
  /* Force GPU */
  transform: translateZ(0);
}

.orb {
  position: absolute;
  border-radius: 50%;
  /* Reduced blur for performance (80px -> 60px) */
  filter: blur(60px);
  opacity: 0.1;
  will-change: transform;
  transform: translateZ(0);
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: var(--accent-gold);
  top: -150px;
  left: 15%;
}

.orb-2 {
  width: 450px;
  height: 450px;
  background: var(--accent-cyan);
  bottom: -100px;
  right: 10%;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: #7b8fc0;
  top: 35%;
  left: 35%;
}

/* Highly optimized noise overlay */
.noise-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-image: url("https://www.transparenttextures.com/patterns/carbon-fibre.png");
  opacity: 0.03;
  pointer-events: none;
  mix-blend-mode: overlay;
}
</style>
