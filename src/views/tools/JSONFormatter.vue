<template>
  <div class="json-app">
    <div class="editor-section">
      <div class="editor-header">
        <div class="tabs">
          <button class="tab clickable" :class="{ active: view === 'pretty' }" @click="view = 'pretty'">Krajší (Prettify)</button>
          <button class="tab clickable" :class="{ active: view === 'minify' }" @click="formatJSON('minify')">Minifikovať</button>
        </div>
        <div class="editor-actions">
          <button class="action-btn clickable" @click="copyToClipboard">
            <PhCopy :size="16" />
          </button>
          <button class="action-btn clickable" @click="input = ''">
            <PhTrash :size="16" />
          </button>
        </div>
      </div>

      <div class="editor-container glass">
        <textarea 
          v-model="input" 
          placeholder="Sem vložte váš JSON..." 
          class="json-textarea clickable"
          spellcheck="false"
          @input="handleInput"
        ></textarea>
        
        <div v-if="error" class="error-toast">
          <PhCircleWavyWarning :size="18" />
          <span>{{ error }}</span>
        </div>
      </div>
    </div>

    <div class="options-section glass">
      <h3>Možnosti formátovania</h3>
      <div class="option-row">
        <label>Odsadzovanie</label>
        <select v-model="indent" @change="formatJSON('pretty')" class="glass clickable">
          <option :value="2">2 medzery</option>
          <option :value="4">4 medzery</option>
          <option :value="'\t'">Tabulátor</option>
        </select>
      </div>
      
      <div class="json-stats" v-if="input">
        <div class="stat">
          <span>Dĺžka:</span>
          <strong>{{ input.length }} znakov</strong>
        </div>
        <div class="stat">
          <span>Veľkosť:</span>
          <strong>{{ (new Blob([input]).size / 1024).toFixed(2) }} KB</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PhCopy, PhTrash, PhCircleWavyWarning } from '@phosphor-icons/vue'

const input = ref('')
const error = ref('')
const indent = ref(2)
const view = ref('pretty')

const handleInput = () => {
  if (!input.value.trim()) {
    error.value = ''
    return
  }
  formatJSON(view.value)
}

const formatJSON = (mode) => {
  view.value = mode
  try {
    const obj = JSON.parse(input.value)
    if (mode === 'pretty') {
      input.value = JSON.stringify(obj, null, indent.value)
    } else {
      input.value = JSON.stringify(obj)
    }
    error.value = ''
  } catch (e) {
    error.value = 'Neplatný JSON formát: ' + e.message
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(input.value)
}
</script>

<style scoped>
.json-app {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.editor-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tabs {
  display: flex;
  background: var(--bg-soft);
  padding: 0.3rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-dim);
}

.tab {
  padding: 0.6rem 1.2rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  transition: all 0.3s;
}

.tab.active {
  background: var(--accent-gold);
  color: var(--bg-deep);
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  color: var(--text-secondary);
  transition: all 0.3s;
}

.action-btn:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.editor-container {
  position: relative;
  min-height: 500px;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
}

.json-textarea {
  width: 100%;
  min-height: 500px;
  background: transparent;
  padding: 1.5rem;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
}

.error-toast {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  background: rgba(231, 76, 60, 0.15);
  border: 1px solid #e74c3c;
  padding: 1rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #ff7675;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.options-section {
  padding: 1.5rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: fit-content;
}

.options-section h3 {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
}

.option-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-row label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}

.option-row select {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-weight: 600;
  outline: none;
}

.json-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-dim);
}

.stat {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.stat span { color: var(--text-muted); }
.stat strong { color: var(--accent-gold); }

@media (max-width: 1024px) {
  .json-app {
    grid-template-columns: 1fr;
  }
}
</style>
