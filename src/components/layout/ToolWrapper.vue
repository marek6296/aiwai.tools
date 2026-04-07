<template>
  <div class="tool-wrapper container">
    <header class="tool-header">
      <router-link to="/" class="back-link clickable">
        <PhArrowLeft :size="18" />
        Späť na všetky nástroje
      </router-link>
      
      <div class="header-main">
        <div class="header-info">
          <div class="tool-icon">
            <component :is="icon" :size="32" weight="duotone" />
          </div>
          <div>
            <h1 class="tool-title">{{ title }}</h1>
            <p class="tool-description">{{ description }}</p>
          </div>
        </div>
        
        <div class="tool-actions">
          <button class="btn-share clickable">
            <PhShareNetwork :size="20" />
          </button>
        </div>
      </div>
    </header>

    <main class="tool-content glass">
      <slot></slot>
    </main>

    <aside class="tool-sidebar">
      <section class="sidebar-section">
        <h3>Súvisiace nástroje</h3>
        <div class="related-list">
          <router-link 
            v-for="t in related" 
            :key="t.name" 
            :to="t.to"
            class="related-item clickable"
          >
            <component :is="t.icon" :size="18" weight="duotone" />
            <span>{{ t.name }}</span>
          </router-link>
        </div>
      </section>
    </aside>
  </div>
</template>

<script setup>
import { PhArrowLeft, PhShareNetwork } from '@phosphor-icons/vue'

defineProps({
  title: String,
  description: String,
  icon: Object,
  related: Array
})
</script>

<style scoped>
.tool-wrapper {
  padding-top: calc(var(--nav-height) + 4rem);
  padding-bottom: 6rem;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 3rem;
}

.tool-header {
  grid-column: 1 / -1;
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  transition: color 0.3s;
}

.back-link:hover {
  color: var(--accent-gold);
}

.header-main {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.tool-icon {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-soft);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  color: var(--accent-gold);
}

.tool-title {
  font-family: var(--font-heading);
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.tool-description {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.btn-share {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-dim);
  background: var(--bg-soft);
  color: var(--text-muted);
  transition: all 0.3s;
}

.btn-share:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.tool-content {
  padding: 3rem;
  border-radius: var(--radius-lg);
  min-height: 400px;
}

.tool-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-section h3 {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: var(--text-primary);
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.related-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.related-item:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  transform: translateX(5px);
}

@media (max-width: 1024px) {
  .tool-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
