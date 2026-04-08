<template>
  <div class="tool-page">

    <!-- ── Top bar ── -->
    <div class="tool-topbar">
      <div class="tool-topbar-inner container">

        <!-- Left: icon + name + desc -->
        <div class="tool-identity">
          <div class="tool-icon">
            <component :is="icon" :size="26" weight="duotone" />
          </div>
          <div class="tool-meta">
            <h1 class="tool-name">{{ title }}</h1>
            <p class="tool-desc">{{ description }}</p>
          </div>
        </div>

        <!-- Right: share + back -->
        <div class="tool-topbar-actions">
          <router-link to="/" class="back-link clickable">
            <PhArrowLeft :size="14" />
            Späť
          </router-link>
          <button class="btn-share clickable" @click="share" :class="{ copied }">
            <PhCheckCircle v-if="copied" :size="17" />
            <PhShareNetwork v-else :size="17" />
          </button>
        </div>

      </div>
    </div>

    <!-- ── Body ── -->
    <div class="tool-body container">

      <!-- Main content -->
      <main class="tool-main">
        <div class="tool-content glass">
          <slot></slot>
        </div>
      </main>

      <!-- Sidebar -->
      <aside class="tool-sidebar" v-if="related?.length">
        <h3 class="sidebar-title">Súvisiace nástroje</h3>
        <div class="related-list">
          <router-link
            v-for="t in related"
            :key="t.name"
            :to="t.to"
            class="related-item clickable"
          >
            <component :is="t.icon" :size="16" weight="duotone" />
            <span>{{ t.name }}</span>
          </router-link>
        </div>
      </aside>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PhArrowLeft, PhShareNetwork, PhCheckCircle } from '@phosphor-icons/vue'

defineProps({
  title: String,
  description: String,
  icon: Object,
  related: Array
})

const copied = ref(false)

const share = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    /* ignore */
  }
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
  position: relative;
  background: var(--bg-deep);
  border-bottom: 1px solid var(--border-soft);
}

.tool-topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

/* Tool identity */
.tool-identity {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.tool-icon {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: 10px;
  color: var(--accent-gold);
}

.tool-meta {
  min-width: 0;
}

.tool-name {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
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

/* Actions */
.tool-topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
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
  color: var(--text-dim);
  padding: 0.4rem 0.7rem;
  border-radius: 8px;
  border: 1px solid var(--border-dim);
  transition: all 0.2s;
  white-space: nowrap;
}

.back-link:hover {
  color: var(--text-primary);
  border-color: var(--border-soft);
}

.btn-share {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid var(--border-dim);
  background: var(--bg-soft);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-share:hover,
.btn-share.copied {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

/* ── Body ── */
.tool-body {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.5rem;
  padding-top: 1rem;
  padding-bottom: 2rem;
  align-items: start;
}

/* Main */
.tool-main {
  min-width: 0;
}

.tool-content {
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  min-height: 300px;
}

/* Sidebar */
.tool-sidebar {
  position: sticky;
  top: calc(var(--nav-height) + 54px + 1rem); /* 1rem for margin */
}

.sidebar-title {
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-dim);
  margin-bottom: 0.75rem;
  padding-left: 0.25rem;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.related-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.85rem;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.related-item:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  background: rgba(197,169,106,0.05);
  transform: translateX(3px);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .tool-body {
    grid-template-columns: 1fr;
  }

  .tool-sidebar {
    position: static;
  }
}

@media (max-width: 600px) {
  .tool-name {
    font-size: 1rem;
  }

  .tool-desc {
    display: none;
  }

  .tool-content {
    padding: 1.25rem;
  }

  .back-link span {
    display: none;
  }
}
</style>
