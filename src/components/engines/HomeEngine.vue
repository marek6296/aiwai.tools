<template>
  <div class="home-engine glass">
    <div class="engine-ui">
      <!-- Kitchen Converter -->
      <div v-if="tool.id === 'kitchen-conv'" class="home-tool">
        <label>Množstvo (Hrnčeky / Lyžice)</label>
        <div class="input-row">
          <input type="number" v-model="val1" @input="convertKitchen" />
          <select v-model="unit" @change="convertKitchen">
            <option value="cups">Hrnčeky (Cups)</option>
            <option value="tbsp">Polievkové lyžice (Tbsp)</option>
            <option value="tsp">Čajové lyžice (Tsp)</option>
          </select>
        </div>
        <div class="results-panel glass mt-2 reveal" v-if="output">
          <div class="res-item"><span>Gramy (múka):</span> <strong>{{ output.grams }} g</strong></div>
          <div class="res-item"><span>Mililitre (tekutina):</span> <strong>{{ output.ml }} ml</strong></div>
        </div>
      </div>

      <!-- Laundry Symbols -->
      <div v-else-if="tool.id === 'washing-sym'" class="laundry-tool">
        <div class="symbols-grid">
          <div v-for="s in laundryIcons" :key="s.label" class="sym-card glass clickable" @click="selectedSym = s">
            <div class="sym-name">{{ s.label }}</div>
          </div>
        </div>
        <div v-if="selectedSym" class="sym-detail glass mt-2 reveal">
          <h3>{{ selectedSym.label }}</h3>
          <p>{{ selectedSym.desc }}</p>
        </div>
      </div>

      <!-- Oven Temp -->
      <div v-else-if="tool.id === 'oven-temp'" class="oven-tool">
        <div class="temp-grid">
          <div class="temp-item">
            <label>Celsius (°C)</label>
            <input type="number" v-model="celsius" @input="convertTemp('c')" />
          </div>
          <div class="temp-item">
            <label>Fahrenheit (°F)</label>
            <input type="number" v-model="fahrenheit" @input="convertTemp('f')" />
          </div>
        </div>
      </div>

      <!-- BAC Calc (Demo) -->
      <div v-else-if="tool.id === 'bac-calc'" class="bac-tool">
        <div class="input-grid">
          <div class="field">
            <label>Váha (kg)</label>
            <input type="number" v-model="weight" />
          </div>
          <div class="field">
            <label>Počet nápojov (0.5l pivo / 0.1l víno)</label>
            <input type="number" v-model="drinks" />
          </div>
        </div>
        <div class="bac-result glass mt-2 text-center" v-if="drinks > 0">
          <div class="label">Odhadované promile:</div>
          <div class="val gold">{{ ((drinks * 20) / (weight * 0.7)).toFixed(2) }} ‰</div>
          <p class="warning">Výsledok je len orientačný a nenahrádza dychovú skúšku!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  tool: Object
})

const val1 = ref(1)
const unit = ref('cups')
const output = ref(null)
const celsius = ref(180)
const fahrenheit = ref(356)
const weight = ref(75)
const drinks = ref(0)
const selectedSym = ref(null)

const laundryIcons = [
  { label: '30°C', desc: 'Pranie v práčke pri maximálnej teplote 30 stupňov.' },
  { label: 'Ručné pranie', desc: 'Iba ručné pranie v studenej alebo vlažnej vode.' },
  { label: 'Nebieliť', desc: 'Nepoužívať bieliace prostriedky s chlórom.' },
  { label: 'Žehliť (Nízka)', desc: 'Žehlenie pri nízkej teplote (max 110°C).' }
]

const convertKitchen = () => {
  let ml = 0
  if (unit.value === 'cups') ml = val1.value * 236.6
  if (unit.value === 'tbsp') ml = val1.value * 14.8
  if (unit.value === 'tsp') ml = val1.value * 4.9
  
  output.value = {
    ml: Math.round(ml),
    grams: Math.round(ml * 0.53) // Approximation for flour
  }
}

const convertTemp = (who) => {
  if (who === 'c') fahrenheit.value = Math.round((celsius.value * 9/5) + 32)
  else celsius.value = Math.round((fahrenheit.value - 32) * 5/9)
}

convertKitchen()
</script>

<style scoped>
.home-engine { padding: 3rem; border-radius: var(--radius-lg); width: 100%; max-width: 800px; }
.input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem; }
input, select { background: var(--bg-deep); border: 1px solid var(--border-dim); padding: 1rem; color: var(--text-primary); border-radius: 8px; outline: none; }

.results-panel { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.8rem; }
.res-item { display: flex; justify-content: space-between; }

.symbols-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.sym-card { padding: 1.5rem; text-align: center; border: 1px solid var(--border-dim); }
.sym-card:hover { border-color: var(--accent-gold); }
.sym-detail { padding: 2rem; border: 1px solid var(--accent-gold); }

.temp-grid, .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 0.5rem; display: block; }

.bac-result { padding: 2rem; border-color: #ff4757; }
.val { font-size: 3rem; font-weight: 900; }
.warning { font-size: 0.8rem; color: #ff4757; opacity: 0.7; margin-top: 1rem; }
.text-center { text-align: center; }
.gold { color: var(--accent-gold); }
</style>
