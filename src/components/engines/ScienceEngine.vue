<template>
  <div class="science-engine glass">
    <div class="engine-ui">
      <!-- Morse Code -->
      <div v-if="tool.id === 'morse-code'" class="sci-tool">
        <label>Vložte text pre prevod do Morseovky</label>
        <textarea v-model="input" @input="encodeMorse" placeholder="Ahoj svet..."></textarea>
        <div class="result-box glass p-2 mt-1">
          <div class="res-label">Morseov kód:</div>
          <div class="morse-output">{{ output }}</div>
          <button v-if="output" class="btn-copy clickable" @click="copy(output)"><PhCopy :size="18" /></button>
        </div>
      </div>

      <!-- Binary / Base Conversion -->
      <div v-else-if="tool.id === 'binary-base'" class="sci-tool">
        <div class="base-grid">
          <div class="input-item">
            <label>Desiatková (Decimal)</label>
            <input type="number" v-model="dec" @input="convertBase('dec')" />
          </div>
          <div class="input-item">
            <label>Binárna (Binary)</label>
            <input type="text" v-model="bin" @input="convertBase('bin')" />
          </div>
          <div class="input-item">
            <label>Šestnástková (Hex)</label>
            <input type="text" v-model="hex" @input="convertBase('hex')" />
          </div>
        </div>
      </div>

      <!-- Periodic Table Helper -->
      <div v-else-if="tool.id === 'periodic-table'" class="sci-tool">
        <div class="search-box glass">
          <PhFlask :size="24" class="gold" />
          <input type="text" v-model="input" @input="findTableElement" placeholder="Zadajte názov alebo značku prvku (napr. H, Zlato...)" />
        </div>
        <div v-if="elementData" class="element-card glass reveal mt-2">
          <div class="el-symbol">{{ elementData.symbol }}</div>
          <div class="el-info">
            <div class="el-name">{{ elementData.name }}</div>
            <div class="el-meta">Atómové číslo: <strong>{{ elementData.number }}</strong></div>
            <div class="el-meta">Hmotnosť: <strong>{{ elementData.weight }} u</strong></div>
          </div>
        </div>
      </div>

      <!-- Citation Generator -->
      <div v-if="tool.id === 'citation-gen'" class="sci-tool">
        <div class="input-grid">
          <div class="field">
            <label>Názov diela / Autor</label>
            <input type="text" v-model="input" placeholder="napr. Meno Autora: Názov Knihy (2024)" />
          </div>
          <div class="field">
            <label>Štýl citácie</label>
            <select v-model="unitType" @change="generateCitation">
              <option value="apa">APA Štýl</option>
              <option value="mla">MLA Štýl</option>
              <option value="iso">ISO 690</option>
            </select>
          </div>
        </div>
        <div class="result-box glass mt-2" v-if="output">
          <div class="res-label">Formátovaná citácia:</div>
          <p class="citation-text">{{ output }}</p>
          <button class="btn-copy clickable" @click="copy(output)"><PhCopy :size="18" /></button>
        </div>
      </div>

      <!-- GPA Calculator -->
      <div v-else-if="tool.id === 'gpa-calc'" class="sci-tool">
        <div class="grades-manager">
          <div class="input-row">
            <input type="number" v-model="val1" placeholder="Známka (1.0 - 5.0)" />
            <input type="number" v-model="val2" placeholder="Kredity" />
            <button class="btn-add clickable" @click="addGrade">Pridať</button>
          </div>
          <div class="gpa-display mt-2 glass p-2 text-center" v-if="gpaScore">
            <div class="label">Váš priemer (weighted GPA):</div>
            <div class="gpa-val gold">{{ gpaScore }}</div>
          </div>
        </div>
      </div>

      <!-- Equation Solver -->
      <div v-else-if="tool.id === 'equation-solver'" class="sci-tool">
        <label>Zadajte rovnicu (napr. 2x + 5 = 15)</label>
        <input type="text" v-model="input" placeholder="2x + 5 = 15" class="glass-input big" />
        <button class="btn-primary mt-1 clickable" @click="solveEquation">Vypočítať</button>
        <div class="result-box glass mt-2" v-if="output">
          <div class="res-label">Riešenie:</div>
          <div class="solution-val">{{ output }}</div>
        </div>
      </div>

      <!-- Professional Units -->
      <div v-else-if="tool.id === 'unit-pro'" class="sci-tool">
        <div class="base-grid">
          <div class="input-item">
            <label>Typ jednotiek</label>
            <select v-model="unitType" @change="calculateUnits">
              <option value="pressure">Tlak (Pa → bar)</option>
              <option value="energy">Energia (J → calories)</option>
              <option value="power">Výkon (W → horsepower)</option>
            </select>
          </div>
          <div class="input-item">
            <label>Hodnota</label>
            <input type="number" v-model="val1" @input="calculateUnits" />
          </div>
        </div>
        <div class="results-panel glass mt-1" v-if="output">
          <div class="res-label">Výsledok:</div>
          <div class="res-value gold">{{ output }}</div>
        </div>
      </div>

      <!-- Flashcards -->
      <div v-else-if="tool.id === 'flashcard-maker' || tool.id === 'flashcard-quiz'" class="sci-tool">
        <div class="flashcard-container" @click="flipCard">
          <div class="f-card" :class="{ flipped: cardFlipped }">
            <div class="f-side front">
              <span class="f-label">OTÁZKA</span>
              <p>{{ currentCard.q }}</p>
              <div class="tap-hint gold">Kliknite pre otočenie</div>
            </div>
            <div class="f-side back">
              <span class="f-label">ODPOVEĎ</span>
              <p>{{ currentCard.a }}</p>
              <div class="tap-hint gold">Kliknite pre návrat</div>
            </div>
          </div>
        </div>
        <div class="f-controls mt-2">
          <button class="btn-sub clickable" @click.stop="prevCard">PREDCHÁDZAJÚCA</button>
          <button class="btn-primary clickable" @click.stop="nextCard">ĎALŠIA</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { PhCopy, PhFlask } from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

const input = ref('')
const output = ref('')
const dec = ref(0)
const bin = ref('0')
const hex = ref('0')
const elementData = ref(null)
const val1 = ref(0)
const val2 = ref(0)
const grades = ref([])
const unitType = ref('apa')

// Flashcards
const cardFlipped = ref(false)
const currentIdx = ref(0)
const cards = reactive([
  { q: 'Čo je to fotosyntéza?', a: 'Proces, pri ktorom rastliny premieňajú svetlo na energiu.' },
  { q: 'Ktorá planéta je najbližšie k Slnku?', a: 'Merkúr' },
  { q: 'Kto objavil teóriu relativity?', a: 'Albert Einstein' },
  { q: 'Čo je najväčší orgán ľudského tela?', a: 'Koža' }
])
const currentCard = computed(() => cards[currentIdx.value])

const flipCard = () => { cardFlipped.value = !cardFlipped.value }
const nextCard = () => {
  cardFlipped.value = false
  setTimeout(() => { currentIdx.value = (currentIdx.value + 1) % cards.length }, 150)
}
const prevCard = () => {
  cardFlipped.value = false
  setTimeout(() => { currentIdx.value = (currentIdx.value - 1 + cards.length) % cards.length }, 150)
}

const gpaScore = computed(() => {
  if (grades.value.length === 0) return null
  const total = grades.value.reduce((acc, g) => acc + (g.grade * g.credits), 0)
  const credits = grades.value.reduce((acc, g) => acc + g.credits, 0)
  return (total / credits).toFixed(2)
})

const addGrade = () => {
  if (!val1.value || !val2.value) return
  grades.value.push({ grade: parseFloat(val1.value), credits: parseInt(val2.value) })
  val1.value = 0
  val2.value = 0
}

const generateCitation = () => {
  if (!input.value) return
  const parts = input.value.split(':')
  const author = parts[0]?.trim() || 'Neznámy Autor'
  const title = parts[1]?.trim() || 'Neznáme Dielo'
  
  if (unitType.value === 'apa') output.value = `${author}. (2024). ${title}. Vydavateľstvo.`
  else if (unitType.value === 'mla') output.value = `${author}. "${title}." AIWai Press, 2024.`
  else output.value = `${author.toUpperCase()}. ${title}. 2024. Available at: AIWai tools.`
}

const solveEquation = () => {
  // Very basic linear solver (ax + b = c)
  try {
    const eq = input.value.replace(/\s/g, '')
    const [left, right] = eq.split('=')
    const c = parseFloat(right)
    
    // Pattern: ax+b
    const match = left.match(/(-?\d*)x([+-]\d+)?/)
    if (!match) { output.value = 'Neplatný formát (skúste napr. 2x + 5 = 15)'; return }
    
    const a = parseFloat(match[1] || '1')
    const b = parseFloat(match[2] || '0')
    
    const x = (c - b) / a
    output.value = `x = ${x}`
  } catch (e) { output.value = 'Chyba pri výpočte' }
}

const encodeMorse = () => {
  const dictionary = {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
    'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
    'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
    's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
    'y': '-.--', 'z': '--..', ' ': '/'
  }
  output.value = input.value.toLowerCase().split('').map(char => dictionary[char] || char).join(' ')
}

const convertBase = (source) => {
  if (source === 'dec') {
    const d = parseInt(dec.value)
    bin.value = d.toString(2)
    hex.value = d.toString(16).toUpperCase()
  } else if (source === 'bin') {
    const d = parseInt(bin.value, 2)
    dec.value = d
    hex.value = d.toString(16).toUpperCase()
  } else if (source === 'hex') {
    const d = parseInt(hex.value, 16)
    dec.value = d
    bin.value = d.toString(2)
  }
}

const findTableElement = () => {
  const elements = [
    { symbol: 'H', name: 'Vodík', number: 1, weight: 1.008 },
    { symbol: 'He', name: 'Hélium', number: 2, weight: 4.003 },
    { symbol: 'Li', name: 'Lítium', number: 3, weight: 6.941 },
    { symbol: 'Au', name: 'Zlato', number: 79, weight: 196.97 },
    { symbol: 'Ag', name: 'Striebro', number: 47, weight: 107.87 },
    { symbol: 'Fe', name: 'Železo', number: 26, weight: 55.845 },
    { symbol: 'O', name: 'Kyslík', number: 8, weight: 15.999 }
  ]
  const query = input.value.toLowerCase()
  elementData.value = elements.find(e => e.symbol.toLowerCase() === query || e.name.toLowerCase().includes(query)) || null
}

const calculateUnits = () => {
  if (unitType.value === 'pressure') output.value = `${(val1.value / 100000).toFixed(4)} bar`
  if (unitType.value === 'energy') output.value = `${(val1.value * 0.239).toFixed(2)} cal`
  if (unitType.value === 'power') output.value = `${(val1.value / 745.7).toFixed(2)} hp (Horsepower)`
}

const copy = (t) => { navigator.clipboard.writeText(t) }
</script>

<style scoped>
.science-engine { padding: 4rem; border-radius: 40px; width: 100%; min-height: 100%; }
textarea, input[type="text"], input[type="number"], select { 
  width: 100%; background: var(--bg-deep); border: 1px solid var(--border-dim);
  padding: 1rem; color: var(--text-primary); border-radius: 8px; outline: none;
}
.morse-output { font-family: monospace; font-size: 1.5rem; letter-spacing: 2px; color: var(--accent-gold); margin: 1rem 0; word-break: break-all; }
.base-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.search-box { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 12px; }
.search-box input { border: none; background: transparent; padding: 0.5rem; font-size: 1.1rem; }

.element-card { display: flex; align-items: center; gap: 2rem; padding: 2.5rem; border: 1px solid var(--accent-gold); }
.el-symbol { font-size: 4rem; font-weight: 900; color: var(--accent-gold); min-width: 100px; text-align: center; }
.el-name { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
.el-meta { color: var(--text-muted); font-size: 1rem; }
.el-meta strong { color: var(--text-primary); }

.results-panel { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; }
.res-value { font-size: 1.5rem; font-weight: 800; }
.gold { color: var(--accent-gold); }

/* Education Specific */
.input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }

.grades-manager .input-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; align-items: flex-end; }
.btn-add { background: var(--accent-gold); color: var(--bg-deep); padding: 0.8rem 1.5rem; border: none; border-radius: 8px; font-weight: 800; }

.gpa-val { font-size: 3.5rem; font-weight: 900; }
.citation-text { font-style: italic; color: var(--text-primary); margin: 1rem 0; line-height: 1.6; }

.solution-val { font-size: 2.5rem; font-weight: 900; color: var(--accent-gold); text-align: center; padding: 1rem; }
.glass-input.big { font-size: 1.5rem; text-align: center; font-weight: 700; }
.btn-primary { 
  width: 100%; background: var(--accent-gold); color: var(--bg-deep); padding: 1rem; 
  border-radius: 12px; font-weight: 900; text-transform: uppercase; 
}


/* Flashcards Styles */
.flashcard-container { perspective: 1000px; width: 100%; height: 320px; cursor: pointer; }
.f-card { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.f-card.flipped { transform: rotateY(180deg); }
.f-side { 
  position: absolute; width: 100%; height: 100%; 
  backface-visibility: hidden; 
  -webkit-backface-visibility: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center; 
  padding: 3rem; border-radius: 24px; border: 1px solid var(--border-soft);
  background: var(--bg-glass);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}
.front { transform: translateZ(1px); }
.back { transform: rotateY(180deg) translateZ(1px); background: rgba(197, 169, 106, 0.08); border-color: var(--accent-gold); }
.f-label { font-size: 0.65rem; color: var(--accent-gold); letter-spacing: 2px; font-weight: 800; position: absolute; top: 20px; }
.f-side p { font-size: 1.5rem; font-weight: 700; text-align: center; color: var(--text-primary); }
.tap-hint { position: absolute; bottom: 20px; font-size: 0.7rem; font-weight: 800; opacity: 0.6; text-transform: uppercase; }
.f-controls { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 2rem; 
  margin-top: 5rem;
  width: 100%;
}
.btn-sub {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border-soft);
  color: var(--text-muted);
  padding: 1.25rem;
  border-radius: 16px;
  font-weight: 800;
  letter-spacing: 0.05em;
  transition: all 0.3s;
}
.btn-sub:hover {
  background: rgba(255,255,255,0.06);
  color: var(--text-primary);
}

@media (max-width: 768px) { .base-grid { grid-template-columns: 1fr; } .input-grid { grid-template-columns: 1fr; } }
</style>
