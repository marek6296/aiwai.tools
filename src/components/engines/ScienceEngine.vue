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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
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
const unitType = ref('pressure')

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
.science-engine { padding: 3rem; border-radius: var(--radius-lg); width: 100%; max-width: 800px; }
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
@media (max-width: 768px) { .base-grid { grid-template-columns: 1fr; } }
</style>
