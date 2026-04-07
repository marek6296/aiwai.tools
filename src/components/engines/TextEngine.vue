<template>
  <div class="text-engine">
    <!-- SIDE BY SIDE FOR DIFF CHECKER -->
    <div v-if="tool.id === 'diff-checker'" class="diff-layout">
      <div class="editor-container glass">
        <div class="editor-header"><span class="label">Pôvodný text</span></div>
        <textarea v-model="diffLeft" placeholder="Vložte prvú verziu..." class="text-input small"></textarea>
      </div>
      <div class="editor-container glass">
        <div class="editor-header"><span class="label">Nová verzia</span></div>
        <textarea v-model="diffRight" placeholder="Vložte druhú verziu..." class="text-input small"></textarea>
      </div>
    </div>

    <!-- STANDARD EDITOR -->
    <div v-else class="editor-container glass">
      <div class="editor-header">
        <span class="label">{{ tool.name }} Vstup</span>
        <div class="actions">
          <button class="action-btn clickable" @click="copyText" title="Kopírovať">
            <PhCopy :size="16" />
          </button>
          <button class="action-btn clickable" @click="input = ''" title="Vymazať">
            <PhTrash :size="16" />
          </button>
        </div>
      </div>
      <textarea 
        v-model="input" 
        :placeholder="placeholder" 
        class="text-input"
        @input="handleAutoProcess"
      ></textarea>
    </div>

    <div class="stats-bar glass" v-if="input && tool.id !== 'diff-checker'">
      <div class="stat"><span>Znaky:</span> <strong>{{ input.length }}</strong></div>
      <div class="stat"><span>Slová:</span> <strong>{{ wordCount }}</strong></div>
      <div class="stat"><span>Riadky:</span> <strong>{{ lineCount }}</strong></div>
    </div>
    
    <!-- Dynamic controls based on tool -->
    <div class="controls-section glass" v-if="hasControls">
      <!-- Lorem Ipsum -->
      <div v-if="tool.id === 'lorem-ipsum'" class="control-row">
        <label>Počet odsekov:</label>
        <input type="number" v-model="loremCount" min="1" max="50" class="num-input glass" @input="processText" />
        <button class="btn-generate clickable" @click="processText">Generovať</button>
      </div>

      <!-- Case Converter -->
      <div v-if="tool.id === 'case-converter'" class="control-row wrap">
        <button class="btn-opt clickable" @click="processText('upper')">VEĽKÉ</button>
        <button class="btn-opt clickable" @click="processText('lower')">malé</button>
        <button class="btn-opt clickable" @click="processText('title')">Prvé Písmená</button>
        <button class="btn-opt clickable" @click="processText('camel')">camelCase</button>
        <button class="btn-opt clickable" @click="processText('snake')">snake_case</button>
        <button class="btn-opt clickable" @click="processText('kebab')">kebab-case</button>
      </div>

      <!-- List Sorter -->
      <div v-if="tool.id === 'list-sorter'" class="control-row wrap">
        <button class="btn-opt clickable" @click="processText('sort-az')">A-Z</button>
        <button class="btn-opt clickable" @click="processText('sort-za')">Z-A</button>
        <button class="btn-opt clickable" @click="processText('sort-len')">Podľa dĺžky</button>
        <button class="btn-opt clickable" @click="processText('reverse-lines')">Obrátiť poradie</button>
      </div>

      <!-- Diff Checker Result -->
      <div v-if="tool.id === 'diff-checker'" class="control-row">
        <button class="btn-generate clickable" @click="processText">Porovnať texty</button>
      </div>

      <!-- Duplicate Remover -->
      <div v-if="tool.id === 'duplicate-remover'" class="control-row">
        <button class="btn-generate clickable" @click="processText">Odstrániť duplicitné riadky</button>
      </div>
    </div>

    <!-- Diff Results -->
    <div v-if="tool.id === 'diff-checker' && diffResult" class="diff-result glass reveal">
      <div class="editor-header"><span class="label">Výsledok analýzy</span></div>
      <div class="diff-content" v-html="diffResult"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { PhCopy, PhTrash } from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

const input = ref('')
const diffLeft = ref('')
const diffRight = ref('')
const diffResult = ref('')
const loremCount = ref(3)

const placeholder = computed(() => {
  if (props.tool.id === 'lorem-ipsum') return 'Generovaný text sa zobrazí tu...'
  if (props.tool.id === 'json-csv') return 'Vložte JSON pole objektov...'
  if (props.tool.id === 'list-sorter') return 'Vložte zoznam položiek (každá na nový riadok)...'
  return 'Sem vložte alebo napíšte váš text...'
})

const wordCount = computed(() => input.value.trim() ? input.value.trim().split(/\s+/).length : 0)
const lineCount = computed(() => input.value.trim() ? input.value.split('\n').length : 0)
const hasControls = computed(() => ['lorem-ipsum', 'case-converter', 'duplicate-remover', 'uuid-gen', 'json-csv', 'list-sorter', 'diff-checker'].includes(props.tool.id))

const handleAutoProcess = () => {
  if (['remove-spaces', 'reverse-text'].includes(props.tool.id)) {
    processText()
  }
}

const processText = (mode) => {
  const id = props.tool.id
  let val = input.value
  
  if (id === 'diff-checker') {
    compareTexts()
    return
  }

  if (id === 'uuid-gen') {
    input.value = crypto.randomUUID()
    return
  }

  if (!val && id !== 'lorem-ipsum') return

  if (id === 'case-converter') {
    if (mode === 'upper') input.value = val.toUpperCase()
    if (mode === 'lower') input.value = val.toLowerCase()
    if (mode === 'camel') {
      input.value = val.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
    }
    if (mode === 'snake') {
      input.value = val.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase()).join('_')
    }
    if (mode === 'kebab') {
      input.value = val.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase()).join('-')
    }
    if (mode === 'title') {
      const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i
      input.value = val.toLowerCase().split(' ').map((word, index) => {
        if (index > 0 && word.match(smallWords)) return word
        return word.charAt(0).toUpperCase() + word.substr(1)
      }).join(' ')
    }
  }

  if (id === 'list-sorter') {
    const lines = val.split('\n').filter(l => l.trim())
    if (mode === 'sort-az') input.value = lines.sort((a,b) => a.localeCompare(b)).join('\n')
    if (mode === 'sort-za') input.value = lines.sort((a,b) => b.localeCompare(a)).join('\n')
    if (mode === 'sort-len') input.value = lines.sort((a,b) => a.length - b.length).join('\n')
    if (mode === 'reverse-lines') input.value = lines.reverse().join('\n')
  }
  
  if (id === 'remove-spaces') input.value = val.replace(/\s+/g, ' ').trim()
  if (id === 'reverse-text') input.value = val.split('').reverse().join('')
  if (id === 'duplicate-remover') {
    const lines = val.split('\n').map(l => l.trim()).filter(l => l)
    input.value = [...new Set(lines)].join('\n')
  }
  
  if (id === 'lorem-ipsum') {
    input.value = generateLorem(loremCount.value)
  }
}

const compareTexts = () => {
  const left = diffLeft.value.split('\n')
  const right = diffRight.value.split('\n')
  let html = ''
  
  const maxLines = Math.max(left.length, right.length)
  for (let i = 0; i < maxLines; i++) {
    const l = left[i] || ''
    const r = right[i] || ''
    if (l === r) {
      html += `<div class="line"> ${l}</div>`
    } else {
      if (l) html += `<div class="line removed">- ${l}</div>`
      if (r) html += `<div class="line added">+ ${r}</div>`
    }
  }
  diffResult.value = html
}

const generateLorem = (paragraphs) => {
  const dictionary = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", 
    "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut", "enim", "ad", "minim", 
    "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", 
    "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", 
    "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur"
  ]
  
  let result = ""
  for (let p = 0; p < paragraphs; p++) {
    let pText = ""
    for (let s = 0; s < 5; s++) {
      let sText = ""
      const wordCount = Math.floor(Math.random() * 8) + 5
      for (let w = 0; w < wordCount; w++) {
        const word = dictionary[Math.floor(Math.random() * dictionary.length)]
        sText += (w === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word) + " "
      }
      pText += sText.trim() + ". "
    }
    result += pText.trim() + "\n\n"
  }
  return result.trim()
}

const copyText = () => {
  navigator.clipboard.writeText(input.value)
}

// Watch tool change to clear or reset
watch(() => props.tool.id, (newId) => {
  if (newId !== 'lorem-ipsum') {
    input.value = ''
  }
  if (newId === 'uuid-gen') {
    processText()
  }
})
</script>

<style scoped>
.text-engine {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.editor-container {
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: var(--bg-soft);
  border-bottom: 1px solid var(--border-dim);
}

.label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  color: var(--text-muted);
  transition: all 0.3s;
}

.action-btn:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.text-input {
  width: 100%;
  min-height: 400px;
  background: transparent;
  border: none;
  padding: 1.5rem;
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.6;
  outline: none;
  resize: vertical;
}

.stats-bar {
  display: flex;
  gap: 2rem;
  padding: 1rem 1.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.stat span { color: var(--text-muted); }
.stat strong { color: var(--accent-gold); margin-left: 0.4rem; }

.controls-section {
  padding: 1.5rem;
  border-radius: var(--radius-md);
}

.control-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.control-row label { font-size: 0.9rem; font-weight: 600; }

.num-input {
  width: 80px;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--border-dim);
  background: var(--bg-deep);
  color: var(--text-primary);
  outline: none;
}

.btn-generate {
  padding: 0.8rem 1.8rem;
  background: var(--accent-gold);
  color: var(--bg-deep);
  border-radius: var(--radius-md);
  font-weight: 800;
  border: none;
  transition: all 0.3s;
}

.btn-generate:hover {
  background: var(--accent-gold-light);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(197, 169, 106, 0.2);
}

.wrap { flex-wrap: wrap; }

.btn-opt {
  padding: 0.6rem 1.2rem;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.btn-opt:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

/* Diff Checker Specific */
.diff-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.text-input.small {
  min-height: 250px;
}

.diff-result {
  margin-top: 1.5rem;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.diff-content {
  padding: 1.5rem;
  background: var(--bg-deep);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

:deep(.line) {
  white-space: pre-wrap;
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
}

:deep(.added) {
  background: rgba(46, 213, 115, 0.15);
  color: #2ed573;
}

:deep(.removed) {
  background: rgba(255, 71, 87, 0.15);
  color: #ff4757;
}

@media (max-width: 900px) {
  .diff-layout { grid-template-columns: 1fr; }
}
</style>
