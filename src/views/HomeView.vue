<template>
  <div class="home-view">
    <!-- Hero Section -->
    <header class="hero container">
      <div class="hero-content reveal">
        <div class="hero-badge">
          <span class="pulse"></span>
          300+ Prémiových Nástrojov
        </div>
        <h1 class="hero-title">
          Všetko čo potrebuješ, <br />
          <span class="accent-text">na jednom mieste.</span>
        </h1>
        <p class="hero-subtitle">
          Najväčšia kolekcia bezplatných online nástrojov pre prácu s PDF, obrázkami, videom, audiom a kódom. Úplne zadarmo a bez registrácie.
        </p>
        <div class="hero-btns">
          <button class="btn btn-primary clickable" @click="scrollToTools">
            Preskúmať kategórie
            <PhArrowRight :size="18" />
          </button>
          <a href="#tools" class="btn btn-secondary clickable" @click.prevent="store.openSearch()">
            Hľadať nástroj (Cmd+K)
          </a>
        </div>
      </div>
    </header>

    <!-- Popular Tools Strip -->
    <section id="popular" class="popular-strip glass">
      <div class="container strip-inner">
        <span class="strip-label">Rýchly prístup:</span>
        <div class="strip-items">
          <router-link to="/pdf/pdf-word" class="strip-item clickable"><PhFilePdf weight="duotone" /> PDF do Wordu</router-link>
          <router-link to="/social/yt-down" class="strip-item clickable"><PhVideo weight="duotone" /> YouTube Downloader</router-link>
          <router-link to="/img/img-compress" class="strip-item clickable"><PhFrameCorners weight="duotone" /> Kompresia obrázka</router-link>
          <router-link to="/dev/json-format" class="strip-item clickable"><PhCode weight="duotone" /> JSON Formátovač</router-link>
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section id="tools" class="categories container">
      <div class="section-header">
        <h2 class="section-title">Kategórie nástrojov</h2>
        <p class="section-desc">Vyber si oblasť, v ktorej potrebuješ pomôcť.</p>
      </div>

      <div class="bento-grid">
        <BentoCard 
          v-for="cat in categories" 
          :key="cat.id" 
          :title="cat.title"
          :description="cat.description"
          :icon="getIconForCategory(cat.id)"
          :count="cat.tools?.length || 0"
          :to="`/${cat.id}/${cat.tools?.[0]?.id}`"
          class="category-card reveal"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BentoCard from '../components/ui/BentoCard.vue'
import { store } from '../store/toolStore'
import { 
  PhArrowRight, PhFilePdf, PhImage, PhVideo, PhMusicNotes, 
  PhTextT, PhCalculator, PhRuler, PhCurrencyCircleDollar, 
  PhCode, PhLockKey, PhCalendar, PhPaintBrush, 
  PhShareNetwork, PhFrameCorners, PhChartBar, PhDatabase, 
  PhPalette, PhTimer, PhMegaphone
} from '@phosphor-icons/vue'

gsap.registerPlugin(ScrollTrigger)

const categories = computed(() => store.categories || [])

const getIconForCategory = (id) => {
  const icons = {
    pdf: PhFilePdf,
    img: PhImage,
    video: PhVideo,
    audio: PhMusicNotes,
    text: PhTextT,
    calc: PhCalculator,
    unit: PhRuler,
    dev: PhCode,
    security: PhLockKey,
    seo: PhChartBar,
    marketing: PhMegaphone,
    data: PhDatabase,
    ui: PhPalette,
    productivity: PhTimer,
    finance: PhCurrencyCircleDollar,
    social: PhShareNetwork
  }
  return icons[id] || PhTextT
}

const scrollToTools = () => {
  const el = document.getElementById('tools')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  // Hero Animation
  gsap.fromTo('.hero-content > *', 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
  )

  // Categories Animation
  gsap.fromTo('.category-card',
    { y: 40, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 0.8, 
      stagger: 0.08, 
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.bento-grid',
        start: 'top 85%'
      }
    }
  )
})
</script>

<style scoped>
.home-view {
  padding-top: calc(var(--nav-height) + 4rem);
}

.hero {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 6rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem;
  background: var(--bg-soft);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent-gold);
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pulse {
  width: 8px;
  height: 8px;
  background: var(--accent-gold);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent-gold);
  animation: pulse-ring 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
}

.hero-title {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.accent-text {
  color: var(--accent-gold);
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 600;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.hero-btns {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.btn {
  padding: 1rem 2rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-primary {
  background: var(--accent-gold);
  color: var(--bg-deep);
}

.btn-primary:hover {
  background: var(--accent-gold-light);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(197, 169, 106, 0.2);
}

.btn-secondary {
  border: 1px solid var(--border-soft);
  color: var(--text-primary);
}

.btn-secondary:hover {
  border-color: var(--accent-gold);
  background: var(--bg-soft);
}

/* Popular Strip */
.popular-strip {
  border-top: 1px solid var(--border-dim);
  border-bottom: 1px solid var(--border-dim);
  padding: 1.5rem 0;
  margin-bottom: 8rem;
}

.strip-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.strip-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.strip-items {
  display: flex;
  gap: 1rem;
}

.strip-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: var(--radius-md);
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.strip-item:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

/* Categories */
.categories {
  padding-bottom: 10rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.section-desc {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .hero-btns {
    flex-direction: column;
  }
  .strip-inner {
    flex-direction: column;
    gap: 1rem;
  }
  .strip-items {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
