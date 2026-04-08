<template>
  <div class="calc-engine glass">
    <div class="engine-ui">
      <!-- Dynamic Inputs based on tool -->
      <div v-if="tool.id === 'vat-calc'" class="calc-grid">
        <div class="input-group">
          <label>Základ dane (€)</label>
          <input type="number" v-model="val1" @input="calculateVAT('net')" />
        </div>
        <div class="input-group">
          <label>Sadzba DPH (%)</label>
          <input type="number" v-model="val2" @input="calculateVAT('net')" />
        </div>
        <div class="input-group">
          <label>Cena s DPH (€)</label>
          <input type="number" v-model="val3" @input="calculateVAT('gross')" />
        </div>
      </div>

      <div v-else-if="tool.id === 'percentage-calc'" class="calc-grid">
        <div class="input-group">
          <label>Typ výpočtu</label>
          <select v-model="percentMode" class="glass clickable" @change="calculatePercent">
            <option value="of">Koľko je X % z Y?</option>
            <option value="isWhat">X je koľko % z Y?</option>
            <option value="change">Percentuálna zmena (z X na Y)</option>
          </select>
        </div>
        <div class="input-group">
          <label>{{ percentMode === 'of' ? 'Percentá (%)' : 'Prvé číslo (X)' }}</label>
          <input type="number" v-model="val1" @input="calculatePercent" />
        </div>
        <div class="input-group">
          <label>{{ percentMode === 'of' ? 'Z celku (Y)' : 'Druhé číslo (Y)' }}</label>
          <input type="number" v-model="val2" @input="calculatePercent" />
        </div>
      </div>

      <div v-else-if="tool.id === 'tip-calc'" class="calc-grid">
        <div class="input-group">
          <label>Suma účtu (€)</label>
          <input type="number" v-model="val1" @input="calculateTip" />
        </div>
        <div class="input-group">
          <label>Prepitné (%)</label>
          <input type="number" v-model="val2" @input="calculateTip" />
        </div>
        <div class="input-group">
          <label>Počet osôb</label>
          <input type="number" v-model="val3" @input="calculateTip" />
        </div>
      </div>

      <div v-else-if="tool.id === 'loan-calc'" class="calc-grid">
        <div class="input-group">
          <label>Výška úveru (€)</label>
          <input type="number" v-model="val1" @input="calculateLoan" />
        </div>
        <div class="input-group">
          <label>Úroková sadzba (% p.a.)</label>
          <input type="number" v-model="val2" @input="calculateLoan" />
        </div>
        <div class="input-group">
          <label>Doba splácania (roky)</label>
          <input type="number" v-model="val3" @input="calculateLoan" />
        </div>
      </div>

      <div v-else-if="tool.id === 'compound-interest'" class="calc-grid">
        <div class="input-group">
          <label>Počiatočný vklad (€)</label>
          <input type="number" v-model="val1" @input="calculateCompound" />
        </div>
        <div class="input-group">
          <label>Mesačný vklad (€)</label>
          <input type="number" v-model="val4" @input="calculateCompound" />
        </div>
        <div class="input-group">
          <label>Úrok (%)</label>
          <input type="number" v-model="val2" @input="calculateCompound" />
        </div>
        <div class="input-group">
          <label>Obdobie (roky)</label>
          <input type="number" v-model="val3" @input="calculateCompound" />
        </div>
      </div>

      <div v-else-if="tool.id === 'margin-calc'" class="calc-grid">
        <div class="input-group">
          <label>Nákupná cena (€)</label>
          <input type="number" v-model="val1" @input="calculateMargin" />
        </div>
        <div class="input-group">
          <label>Predajná cena (€)</label>
          <input type="number" v-model="val2" @input="calculateMargin" />
        </div>
      </div>

      <div v-else-if="tool.id === 'age-calc'" class="calc-grid">
        <div class="input-group">
          <label>Dátum narodenia</label>
          <input type="date" v-model="birthDate" @input="calculateAge" class="date-input" />
        </div>
      </div>

      <!-- Result Display -->
      <div v-if="results.length" class="results-panel reveal-result">
        <div v-for="res in results" :key="res.label" class="result-row">
          <span class="res-label">{{ res.label }}</span>
          <span class="res-value">{{ res.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  tool: Object
})

const val1 = ref(0)
const val2 = ref(0)
const val3 = ref(1)
const val4 = ref(0) // Used for monthly deposit in compound interest
const percentMode = ref('of')
const birthDate = ref('1990-01-01')
const results = ref([])

const calculateLoan = () => {
  const principal = Number(val1.value)
  const rate = (Number(val2.value) / 100) / 12
  const months = Number(val3.value) * 12
  
  if (principal > 0 && rate > 0 && months > 0) {
    const x = Math.pow(1 + rate, months)
    const monthly = (principal * x * rate) / (x - 1)
    const total = monthly * months
    
    results.value = [
      { label: 'Mesačná splátka', value: monthly.toFixed(2) + ' €' },
      { label: 'Celkové preplatenie', value: (total - principal).toFixed(2) + ' €' },
      { label: 'Celková suma', value: total.toFixed(2) + ' €' }
    ]
  }
}

const calculateCompound = () => {
  const p = Number(val1.value) // Principal
  const pmt = Number(val4.value) // Monthly deposit
  const r = (Number(val2.value) / 100) / 12 // Monthly rate
  const n = Number(val3.value) * 12 // Total months
  
  // A = P(1+r)^n + PMT * (((1+r)^n - 1) / r)
  const compoundPrincipal = p * Math.pow(1 + r, n)
  const compoundDeposits = pmt * ((Math.pow(1 + r, n) - 1) / r)
  const total = compoundPrincipal + compoundDeposits
  const totalInvested = p + (pmt * n)
  
  results.value = [
    { label: 'Budúca hodnota', value: total.toFixed(2) + ' €' },
    { label: 'Čistý zisk', value: (total - totalInvested).toFixed(2) + ' €' },
    { label: 'Celkový vklad', value: totalInvested.toFixed(2) + ' €' }
  ]
}

const calculateAge = () => {
  const birth = new Date(birthDate.value)
  const today = new Date()
  
  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()
  let days = today.getDate() - birth.getDate()

  if (days < 0) {
    months--
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    days += lastMonth.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  results.value = [
    { label: 'Vek', value: `${years} rokov` },
    { label: 'Detaily', value: `${months} mesiacov a ${days} dní` }
  ]
}

const calculateVAT = (source) => {
  const rate = val2.value / 100
  if (source === 'net') {
    const vat = val1.value * rate
    val3.value = Number(val1.value + vat).toFixed(2)
    results.value = [
      { label: 'DPH', value: vat.toFixed(2) + ' €' },
      { label: 'Celkom', value: val3.value + ' €' }
    ]
  } else {
    const net = val3.value / (1 + rate)
    val1.value = Number(net).toFixed(2)
    results.value = [
      { label: 'Základ', value: net.toFixed(2) + ' €' },
      { label: 'DPH', value: (val3.value - net).toFixed(2) + ' €' }
    ]
  }
}

const calculatePercent = () => {
  if (percentMode.value === 'of') {
    const res = (val1.value / 100) * val2.value
    results.value = [{ label: 'Výsledok', value: res.toLocaleString() }]
  } else if (percentMode.value === 'isWhat') {
    const res = (val1.value / val2.value) * 100
    results.value = [{ label: 'Výsledok', value: res.toFixed(2) + ' %' }]
  } else if (percentMode.value === 'change') {
    const diff = val2.value - val1.value
    const res = (diff / val1.value) * 100
    results.value = [
      { label: 'Rozdiel', value: diff.toFixed(2) },
      { label: 'Zmena', value: (res > 0 ? '+' : '') + res.toFixed(2) + ' %' }
    ]
  }
}

const calculateTip = () => {
  const tipAmount = (val1.value * (val2.value / 100))
  const total = Number(val1.value) + tipAmount
  const perPerson = total / (val3.value || 1)
  
  results.value = [
    { label: 'Prepitné celkom', value: tipAmount.toFixed(2) + ' €' },
    { label: 'Celková suma', value: total.toFixed(2) + ' €' },
    { label: 'Na osobu', value: perPerson.toFixed(2) + ' €' }
  ]
}

const calculateMargin = () => {
  const profit = val2.value - val1.value
  const margin = (profit / val2.value) * 100
  const markup = (profit / val1.value) * 100
  
  results.value = [
    { label: 'Zisk', value: profit.toFixed(2) + ' €' },
    { label: 'Marža', value: margin.toFixed(2) + ' %' },
    { label: 'Prirážka', value: markup.toFixed(2) + ' %' }
  ]
}

const reset = () => {
  results.value = []
  val1.value = 0
  val2.value = 0
  val3.value = 0
  val4.value = 0
}

onMounted(() => {
  // Init defaults
  if (props.tool.id === 'vat-calc') { val2.value = 20 }
  if (props.tool.id === 'tip-calc') { val1.value = 50; val2.value = 10; val3.value = 2; calculateTip() }
  if (props.tool.id === 'margin-calc') { val1.value = 100; val2.value = 150; calculateMargin() }
  if (props.tool.id === 'age-calc') { calculateAge() }
  if (props.tool.id === 'loan-calc') { val1.value = 10000; val2.value = 4.5; val3.value = 5; calculateLoan() }
  if (props.tool.id === 'compound-interest') { val1.value = 5000; val2.value = 7; val3.value = 10; val4.value = 100; calculateCompound() }
})

watch(() => props.tool.id, () => {
  reset()
})
</script>

<style scoped>
.calc-engine {
  width: 100%;
}

.calc-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}

input {
  width: 100%;
  padding: 1.2rem;
  background: var(--bg-deep);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.results-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: var(--bg-soft);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-dim);
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid var(--border-dim);
}

.result-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-top: 0.5rem;
}

.res-label {
  color: var(--text-secondary);
  font-size: 1rem;
}

.res-value {
  color: var(--accent-gold);
  font-size: 1.5rem;
  font-weight: 800;
}
</style>
