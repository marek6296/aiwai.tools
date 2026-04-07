<template>
  <transition name="fade">
    <div v-if="store.isSearchOpen" class="search-overlay" @mousedown.self="store.closeSearch">
      <div class="search-modal glass" ref="modalRef">
        <div class="search-header">
          <PhMagnifyingGlass :size="24" class="search-icon" />
          <input 
            type="text" 
            v-model="store.searchQuery" 
            placeholder="Hľadať nástroj... (napr. 'pdf do word')"
            class="search-input"
            ref="inputRef"
            @keydown.esc="store.closeSearch"
          />
          <button class="close-btn" @click="store.closeSearch">
            <kbd>ESC</kbd>
          </button>
        </div>

        <div class="search-body custom-scrollbar">
          <div v-if="store.filteredTools.length > 0" class="results-list">
            <router-link 
              v-for="tool in store.filteredTools" 
              :key="tool.id"
              :to="`/${tool.categoryId}/${tool.id}`"
              class="result-item clickable"
              @click="store.closeSearch"
            >
              <div class="result-info">
                <span class="tool-name">{{ tool.name }}</span>
                <span class="tool-cat">{{ tool.categoryTitle }}</span>
              </div>
              <PhArrowRight :size="16" class="arrow" />
            </router-link>
          </div>
          
          <div v-else-if="store.searchQuery" class="no-results">
            <PhGhost :size="48" />
            <p>Nenašli sme žiadny nástroj pre "<span>{{ store.searchQuery }}</span>"</p>
          </div>

          <div v-else class="quick-tips">
            <span class="tip-label">Odporúčané:</span>
            <div class="tip-tags">
              <span class="tag clickable" @click="store.searchQuery = 'pdf'">#pdf</span>
              <span class="tag clickable" @click="store.searchQuery = 'youtube'">#video</span>
              <span class="tag clickable" @click="store.searchQuery = 'bmi'">#kalkulacka</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { store } from '../../store/toolStore'
import { PhMagnifyingGlass, PhArrowRight, PhGhost } from '@phosphor-icons/vue'

const inputRef = ref(null)

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const handleKeyDown = (e) => {
  if (e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) {
    e.preventDefault()
    store.toggleSearch()
  }
}

watch(() => store.isSearchOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    nextTick(() => inputRef.value?.focus())
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  padding-top: 15vh;
}

.search-modal {
  width: 100%;
  max-width: 650px;
  max-height: 500px;
  background: var(--bg-deep);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 40px 100px rgba(0,0,0,0.8);
}

.search-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-dim);
  gap: 1rem;
}

.search-icon {
  color: var(--accent-gold);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  font-size: 1.1rem;
  font-family: inherit;
  color: var(--text-primary);
  outline: none;
}

.close-btn kbd {
  background: var(--bg-soft);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-family: var(--font-main);
  color: var(--text-muted);
}

.search-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.result-item:hover {
  background: var(--bg-soft);
  transform: translateX(5px);
}

.tool-name {
  display: block;
  font-weight: 700;
  color: var(--text-primary);
}

.tool-cat {
  font-size: 0.75rem;
  color: var(--accent-gold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.2rem;
  display: block;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
}

.no-results span {
  color: var(--accent-gold);
}

.quick-tips {
  padding: 1rem;
}

.tip-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}

.tip-tags {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.tag {
  padding: 0.4rem 0.8rem;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.tag:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
