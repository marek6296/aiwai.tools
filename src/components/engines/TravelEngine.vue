<template>
  <div class="travel-engine glass">
    <div class="engine-ui">
      <!-- Currency Converter -->
      <div v-if="tool.id === 'currency-conv'" class="travel-tool">
        <div class="conv-grid">
          <div class="input-block">
            <label>Suma</label>
            <input type="number" v-model="val1" @input="convertCurrency" />
          </div>
          <div class="input-block">
            <label>Z meny</label>
            <select v-model="fromCurr" @change="convertCurrency">
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">Dolar (USD)</option>
              <option value="GBP">Libra (GBP)</option>
            </select>
          </div>
          <div class="input-block">
            <label>Do meny</label>
            <select v-model="toCurr" @change="convertCurrency">
              <option value="USD">Dolar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">Libra (GBP)</option>
            </select>
          </div>
        </div>
        <div class="res-display glass mt-2 text-center" v-if="output">
          <div class="label">Výsledná suma:</div>
          <div class="total-val gold">{{ output }} {{ toCurr }}</div>
        </div>
      </div>

      <!-- World Clock -->
      <div v-else-if="tool.id === 'world-clock'" class="travel-tool">
        <div class="clock-grid">
          <div v-for="c in cities" :key="c.name" class="city-clock glass">
            <div class="city-name">{{ c.name }}</div>
            <div class="city-time">{{ getTime(c.tz) }}</div>
          </div>
        </div>
      </div>

      <!-- Flight Distance -->
      <div v-else-if="tool.id === 'flight-dist'" class="travel-tool">
        <div class="io-grid">
          <input type="text" v-model="val1" placeholder="Z mesta (napr. Bratislava)" class="glass-input" />
          <input type="text" v-model="val2" placeholder="Do mesta (napr. Londýn)" class="glass-input" />
        </div>
        <button class="btn-primary mt-1 clickable" @click="calcDist">Vypočítať vzdialenosť</button>
        <div class="res-display glass mt-2 text-center" v-if="output">
          <div class="label">Odhadovaná vzdialenosť:</div>
          <div class="total-val gold">{{ output }} km</div>
        </div>
      </div>

      <!-- Travel Budget -->
      <div v-else-if="tool.id === 'travel-budget'" class="travel-tool">
        <div class="budget-form glass p-2">
          <div class="field">
            <label>Ubytovanie (€/noc)</label>
            <input type="number" v-model="hotel" @input="calcBudget" />
          </div>
          <div class="field">
            <label>Strava (€/deň)</label>
            <input type="number" v-model="food" @input="calcBudget" />
          </div>
          <div class="field">
            <label>Počet dní</label>
            <input type="number" v-model="days" @input="calcBudget" />
          </div>
        </div>
        <div class="res-display glass mt-2 text-center" v-if="output">
          <div class="label">Celkový rozpočet:</div>
          <div class="total-val gold">{{ output }} €</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  tool: Object
})

const val1 = ref(100)
const val2 = ref('')
const fromCurr = ref('EUR')
const toCurr = ref('USD')
const output = ref('')
const hotel = ref(60)
const food = ref(30)
const days = ref(7)

const cities = [
  { name: 'Londýn', tz: 'Europe/London' },
  { name: 'New York', tz: 'America/New_York' },
  { name: 'Tokio', tz: 'Asia/Tokyo' },
  { name: 'Dubaj', tz: 'Asia/Dubai' }
]

const getTime = (tz) => {
  return new Intl.DateTimeFormat('sk-SK', {
    timeStyle: 'medium',
    timeZone: tz
  }).format(new Date())
}

const convertCurrency = () => {
  const rates = { EUR: 1, USD: 1.08, GBP: 0.85 }
  const inBase = val1.value / rates[fromCurr.value]
  output.value = (inBase * rates[toCurr.value]).toFixed(2)
}

const calcDist = () => {
  // Mock distance logic
  output.value = Math.floor(Math.random() * 2000) + 500
}

const calcBudget = () => {
  output.value = (hotel.value + food.value) * days.value
}

onMounted(() => {
  convertCurrency()
  calcBudget()
})
</script>

<style scoped>
.travel-engine { padding: 3rem; border-radius: var(--radius-lg); width: 100%; max-width: 800px; }
.conv-grid, .clock-grid, .io-grid { display: grid; gap: 1.5rem; }
.conv-grid { grid-template-columns: 2fr 1fr 1fr; }
.clock-grid { grid-template-columns: repeat(2, 1fr); }
.io-grid { grid-template-columns: 1fr 1fr; }

label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 800; margin-bottom: 0.5rem; display: block; }
input, select { width: 100%; background: var(--bg-deep); border: 1px solid var(--border-dim); padding: 1rem; color: var(--text-primary); border-radius: 8px; outline: none; }

.res-display { padding: 2rem; border: 1px solid var(--accent-gold); }
.total-val { font-size: 3rem; font-weight: 900; }
.gold { color: var(--accent-gold); }

.city-clock { padding: 1.5rem; text-align: center; border: 1px solid var(--border-dim); }
.city-name { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 800; }
.city-time { font-size: 1.5rem; font-weight: 700; color: var(--accent-gold); margin-top: 0.5rem; }

.budget-form { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.5rem; }

.btn-primary { width: 100%; background: var(--accent-gold); color: var(--bg-deep); padding: 1rem; border-radius: 12px; font-weight: 900; text-transform: uppercase; border: none; }
</style>
