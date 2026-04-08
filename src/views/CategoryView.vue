<template>
  <div class="category-page">

    <!-- Top bar -->
    <div class="cat-topbar">
      <div class="cat-topbar-inner container">
        <router-link to="/" class="back-link clickable">
          <PhArrowLeft :size="14" />
          Späť
        </router-link>
        <div class="cat-identity">
          <div class="cat-icon">
            <component :is="catIcon" :size="22" weight="duotone" />
          </div>
          <div>
            <h1 class="cat-title">{{ category?.title }}</h1>
            <p class="cat-desc">{{ category?.description }}</p>
          </div>
        </div>
        <div class="cat-count">
          <span>{{ category?.tools?.length }} nástrojov</span>
        </div>
      </div>
    </div>

    <!-- Tools grid -->
    <div class="container cat-body" v-if="category">
      <div class="tools-grid">
        <router-link
          v-for="tool in category.tools"
          :key="tool.id"
          :to="`/${categoryId}/${tool.id}`"
          class="tool-card glass clickable"
          ref="toolCards"
        >
          <div class="tool-card-glow" :style="getGlow(tool.id)"></div>
          <div class="tool-card-icon">
            <component :is="catIcon" :size="18" weight="duotone" />
          </div>
          <div class="tool-card-body">
            <h3>{{ tool.name }}</h3>
            <p>{{ tool.description }}</p>
          </div>
          <div class="tool-card-arrow">
            <PhArrowRight :size="14" />
          </div>
        </router-link>
      </div>
    </div>

    <div class="not-found container" v-else>
      <p>Kategória nenájdená.</p>
      <router-link to="/">Späť na domov</router-link>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'
import { store } from '../store/toolStore'
import {
  PhArrowLeft, PhArrowRight,
  PhFilePdf, PhImage, PhTextT, PhCode,
  PhMegaphone, PhTrendUp, PhGameController, PhRobot,
  PhAirplaneTilt, PhGraduationCap, PhWifiHigh
} from '@phosphor-icons/vue'

const route = useRoute()
const categoryId = computed(() => route.params.categoryId)

const category = computed(() =>
  store.categories.find(c => c.id === categoryId.value)
)

const catIcon = computed(() => {
  const icons = {
    media:     PhFilePdf,
    design:    PhImage,
    text:      PhTextT,
    ai:        PhRobot,
    dev:       PhCode,
    marketing: PhMegaphone,
    finance:   PhTrendUp,
    fun:       PhGameController,
    travel:    PhAirplaneTilt,
    edu:       PhGraduationCap,
    internet:  PhWifiHigh,
  }
  return icons[categoryId.value] || PhTextT
})

// Per-card glow on hover
const hoveredId = ref(null)
const mousePos = ref({ x: 0, y: 0 })

const getGlow = (id) => {
  if (hoveredId.value !== id) return { opacity: 0 }
  return {
    opacity: 1,
    background: `radial-gradient(400px circle at ${mousePos.value.x}px ${mousePos.value.y}px, rgba(197,169,106,0.12), transparent 50%)`
  }
}

onMounted(() => {
  gsap.fromTo('.tool-card',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: 'power2.out', delay: 0.05 }
  )

  // Glow tracking
  document.querySelectorAll('.tool-card').forEach((el, i) => {
    const tool = category.value?.tools?.[i]
    if (!tool) return
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect()
      mousePos.value = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      hoveredId.value = tool.id
    })
    el.addEventListener('mouseleave', () => {
      hoveredId.value = null
    })
  })
})
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  padding-top: var(--nav-height);
  padding-bottom: 6rem;
}

/* ── Top bar ── */
.cat-topbar {
  border-bottom: 1px solid var(--border-dim);
  background: rgba(5, 5, 8, 0.85);
  backdrop-filter: blur(16px);
  position: sticky;
  top: var(--nav-height);
  z-index: 10;
}

.cat-topbar-inner {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.25rem 2rem;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;
}
.back-link:hover { color: var(--accent-gold); }

.cat-identity {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.cat-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--bg-soft);
  color: var(--accent-gold);
  border: 1px solid var(--border-dim);
  flex-shrink: 0;
}

.cat-title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  margin: 0;
}

.cat-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0.2rem 0 0;
  line-height: 1.4;
}

.cat-count {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent-gold);
  background: rgba(197, 169, 106, 0.08);
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-soft);
  white-space: nowrap;
}

/* ── Grid ── */
.cat-body {
  padding: 3rem 2rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

/* ── Tool card ── */
.tool-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-3px);
  border-color: var(--border-bright);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

.tool-card-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.tool-card-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--bg-soft);
  color: var(--accent-gold);
  border: 1px solid var(--border-dim);
  flex-shrink: 0;
  z-index: 1;
}

.tool-card-body {
  flex: 1;
  z-index: 1;
  min-width: 0;
}

.tool-card-body h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-card-body p {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tool-card-arrow {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-soft);
  color: var(--text-muted);
  flex-shrink: 0;
  z-index: 1;
  transition: all 0.25s ease;
}

.tool-card:hover .tool-card-arrow {
  background: var(--accent-gold);
  color: var(--bg-deep);
  transform: translateX(2px);
}

.not-found {
  text-align: center;
  padding: 6rem 2rem;
  color: var(--text-muted);
}

/* ── Responsive ── */
@media (max-width: 1200px) {
  .tools-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 860px) {
  .tools-grid { grid-template-columns: repeat(2, 1fr); }
  .cat-desc { display: none; }
}
@media (max-width: 520px) {
  .tools-grid { grid-template-columns: 1fr; }
  .cat-topbar-inner { flex-wrap: wrap; gap: 1rem; }
}
</style>
