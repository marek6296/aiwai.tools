<template>
  <div class="word-counter-app">
    <div class="input-area">
      <textarea 
        v-model="text" 
        placeholder="Tu vložte alebo napíšte váš text..."
        class="text-input glass clickable"
        ref="textarea"
        @input="analyzeText"
      ></textarea>
      
      <div class="actions">
        <button @click="text = ''" class="btn-clear clickable">Vymazať</button>
        <button @click="copyText" class="btn-copy clickable">
          <PhCopy :size="16" /> Kopírovať
        </button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-val">{{ stats.words }}</span>
        <span class="stat-lbl">Slov</span>
      </div>
      <div class="stat-card">
        <span class="stat-val">{{ stats.chars }}</span>
        <span class="stat-lbl">Znakov</span>
      </div>
      <div class="stat-card">
        <span class="stat-val">{{ stats.sentences }}</span>
        <span class="stat-lbl">Viet</span>
      </div>
      <div class="stat-card">
        <span class="stat-val">{{ stats.readingTime }}m</span>
        <span class="stat-lbl">Čas čítania</span>
      </div>
    </div>

    <div class="advanced-stats">
      <div class="stat-item">
        <span>Hustota slov:</span>
        <div class="density-list">
          <div v-for="w in stats.topWords" :key="w.word" class="density-badge">
            {{ w.word }} ({{ w.count }}x)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { PhCopy } from '@phosphor-icons/vue'

const text = ref('')
const textarea = ref(null)

const stats = reactive({
  words: 0,
  chars: 0,
  sentences: 0,
  readingTime: 0,
  topWords: []
})

const analyzeText = () => {
  const content = text.value.trim()
  if (!content) {
    Object.assign(stats, { words: 0, chars: 0, sentences: 0, readingTime: 0, topWords: [] })
    return
  }

  stats.words = content.split(/\s+/).filter(w => w.length > 0).length
  stats.chars = content.length
  stats.sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  stats.readingTime = Math.ceil(stats.words / 200)

  // Top words density
  const words = content.toLowerCase().match(/\b\w+\b/g) || []
  const counts = {}
  words.forEach(w => {
    if (w.length > 3) counts[w] = (counts[w] || 0) + 1
  })
  stats.topWords = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }))
}

const copyText = () => {
  navigator.clipboard.writeText(text.value)
}

onMounted(() => {
  textarea.value.focus()
})
</script>

<style scoped>
.word-counter-app {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.input-area {
  position: relative;
}

.text-input {
  width: 100%;
  min-height: 300px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  font-family: var(--font-main);
  font-size: 1.1rem;
  color: var(--text-primary);
  outline: none;
  resize: vertical;
  transition: all 0.3s;
}

.text-input:focus {
  border-color: var(--accent-gold);
  background: rgba(255, 255, 255, 0.05);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-clear {
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-sm);
  background: rgba(255, 0, 0, 0.1);
  color: #ff4d4d;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-copy {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-sm);
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-card {
  padding: 2rem;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  text-align: center;
}

.stat-val {
  display: block;
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 800;
  color: var(--accent-gold);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-lbl {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.advanced-stats {
  padding: 2rem;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item span {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.density-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.density-badge {
  padding: 0.5rem 1rem;
  background: rgba(197, 169, 106, 0.1);
  border: 1px solid var(--border-soft);
  color: var(--accent-gold);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
