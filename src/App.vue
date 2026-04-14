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
    <GlobalNavbar v-if="!$route.meta?.hideNav" />
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
            <div class="footer-logo">
              <span class="footer-logo-text">AIWai</span>
              <span class="footer-logo-badge">Tools</span>
            </div>
            <p class="footer-tagline">Platforma pre AI automatizáciu — návody, nástroje a workflow pre modernú prácu.</p>
            <div class="footer-social">
              <a href="https://aiwai.news" target="_blank" rel="noopener" class="social-link">📰 Blog</a>
              <a href="https://aiwai.app" target="_blank" rel="noopener" class="social-link">🚀 App</a>
            </div>
          </div>
          <div class="footer-links-group">
            <span class="footer-links-title">Automatizácia</span>
            <a href="#" class="footer-link">n8n návody</a>
            <a href="#" class="footer-link">Make workflow</a>
            <a href="#" class="footer-link">Zapier tutoriály</a>
            <a href="#" class="footer-link">AI agenti</a>
          </div>
          <div class="footer-links-group">
            <span class="footer-links-title">Nástroje</span>
            <router-link to="/ai" class="footer-link">AI nástroje</router-link>
            <router-link to="/text" class="footer-link">Text & Písanie</router-link>
            <router-link to="/marketing" class="footer-link">Marketing</router-link>
            <router-link to="/dev" class="footer-link">Kód & Dev</router-link>
          </div>
          <div class="footer-links-group">
            <span class="footer-links-title">Spoločnosť</span>
            <a href="#" class="footer-link">O nás</a>
            <a href="#" class="footer-link">Kontakt</a>
            <a href="#" class="footer-link">Podmienky</a>
            <a href="#" class="footer-link">Ochrana súkromia</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 AIWai Tools. Vyrobené pre AI automatizátorov 🤖</p>
          <div class="footer-bottom-links">
            <a href="https://aiwai.news" target="_blank" rel="noopener">aiwai.news</a>
            <span>·</span>
            <a href="https://aiwai.app" target="_blank" rel="noopener">aiwai.app</a>
          </div>
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

/* ── Footer ── */
.footer {
  background: #0F172A;
  padding: 4rem 0 0;
  margin-top: 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.5rem;
  margin-bottom: 0.85rem;
}

.footer-logo-text {
  color: #F8FAFC;
  font-family: var(--font-syne);
  letter-spacing: -0.02em;
}

.footer-logo-badge {
  font-size: 0.62rem;
  background: #4F46E5;
  color: white;
  padding: 0.2rem 0.55rem;
  border-radius: 5px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.footer-tagline {
  font-size: 0.88rem;
  color: rgba(255,255,255,0.45);
  line-height: 1.65;
  max-width: 280px;
  margin-bottom: 1.5rem;
}

.footer-social {
  display: flex;
  gap: 0.5rem;
}

.social-link {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.6);
  padding: 0.35rem 0.85rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.social-link:hover {
  background: rgba(79, 70, 229, 0.2);
  border-color: rgba(79, 70, 229, 0.4);
  color: #A5B4FC;
}

.footer-links-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer-links-title {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255,255,255,0.3);
  margin-bottom: 0.35rem;
}

.footer-link {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  transition: color 0.2s;
  line-height: 1.5;
}

.footer-link:hover {
  color: #A5B4FC;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 0;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.3);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.footer-bottom-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-bottom-links a {
  color: rgba(255,255,255,0.4);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-bottom-links a:hover {
  color: #A5B4FC;
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
