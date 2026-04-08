<template>
  <div class="tool-page">

    <!-- ── Top bar ── -->
    <div class="tool-topbar">
      <div class="tool-topbar-inner container">

        <div class="tool-identity">
          <div class="tool-icon">
            <component :is="icon" :size="24" weight="duotone" />
          </div>
          <div class="tool-meta">
            <h1 class="tool-name">{{ title }}</h1>
            <p class="tool-desc">{{ description }}</p>
          </div>
        </div>

        <div class="tool-topbar-actions">
          <router-link :to="backLink" class="back-link clickable">
            <PhArrowLeft :size="13" />
            Späť
          </router-link>
          <button class="btn-share clickable" @click="share" :class="{ copied }">
            <PhCheckCircle v-if="copied" :size="16" />
            <PhShareNetwork v-else :size="16" />
          </button>
        </div>

      </div>
    </div>

    <!-- ── Main content ── -->
    <div class="tool-body container">
      <div class="tool-content glass">
        <slot></slot>
      </div>

      <!-- ── Related tools — always at the bottom, horizontal ── -->
      <div class="related-section" v-if="related?.length">
        <p class="related-label">Súvisiace nástroje</p>
        <div class="related-row">
          <router-link
            v-for="t in related"
            :key="t.name"
            :to="t.to"
            class="related-chip clickable"
          >
            <component :is="t.icon" :size="14" weight="duotone" />
            {{ t.name }}
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { PhArrowLeft, PhShareNetwork, PhCheckCircle } from '@phosphor-icons/vue'

defineProps({
  title: String,
  description: String,
  icon: Object,
  related: Array
})

const route = useRoute()
const backLink = computed(() => `/${route.params.categoryId}`)

const copied = ref(false)
const share = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch { /* ignore */ }
}
</script>

<style scoped>
/* ── Page ── */
.tool-page {
  min-height: 100vh;
  padding-top: var(--nav-height);
  display: flex;
  flex-direction: column;
}

/* ── Top bar ── */
.tool-topbar {
  position: sticky;
  top: var(--nav-height);
  z-index: 99;
  background: rgba(5, 5, 8, 0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-dim);
}

.tool-topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.65rem;
  padding-bottom: 0.65rem;
}

.tool-identity {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
}

.tool-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: 10px;
  color: var(--accent-gold);
}

.tool-meta { min-width: 0; }

.tool-name {
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-desc {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding: 0.4rem 0.7rem;
  border-radius: 8px;
  border: 1px solid var(--border-dim);
  transition: all 0.2s;
  text-decoration: none;
}
.back-link:hover { color: var(--text-primary); border-color: var(--border-soft); }

.btn-share {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--border-dim);
  background: var(--bg-soft);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-share:hover, .btn-share.copied { border-color: var(--accent-gold); color: var(--accent-gold); }

/* ── Body ── */
.tool-body {
  flex: 1;
  padding-top: 1.5rem;
  padding-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Content card — SAME size for every tool ── */
.tool-content {
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  width: 100%;
  min-height: 560px;
  display: flex;
  flex-direction: column;
}

/* ── Related tools ── */
.related-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.related-label {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  white-space: nowrap;
}

.related-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.related-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}
.related-chip:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  background: rgba(197,169,106,0.06);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .tool-content { padding: 1.5rem; min-height: 420px; }
  .tool-desc { display: none; }
}

@media (max-width: 480px) {
  .tool-content { padding: 1.25rem; }
}
</style>
