<script setup>
import { onMounted } from 'vue'
import Lenis from 'lenis'
import Atmosphere from './components/layout/Atmosphere.vue'
import GlobalNavbar from './components/layout/GlobalNavbar.vue'
import SearchOverlay from './components/ui/SearchOverlay.vue'

onMounted(() => {
  const lenis = new Lenis()

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
})
</script>

<template>
  <div class="app-container">
    <Atmosphere />
    <GlobalNavbar />
    <SearchOverlay />
    
    <main class="page-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </transition>
      </router-view>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="logo">
              <span class="logo-text">AIWai</span>
              <span class="logo-badge">Tools</span>
            </div>
            <p>Najväčšia kolekcia bezplatných online nástrojov pre profesionálov.</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 AIWai Tools. Vyrobené pre profesionálov.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
}

.footer {
  padding: 4rem 0 2rem;
  border-top: 1px solid var(--border-dim);
  background: var(--bg-deep);
  margin-top: 4rem;
}

.footer-bottom {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-dim);
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.5rem;
}

.logo-badge {
  font-size: 0.7rem;
  background: var(--accent-gold);
  color: var(--bg-deep);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
