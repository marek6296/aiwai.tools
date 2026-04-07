<template>
  <div class="health-engine glass">
    <div class="engine-header">
      <div class="gender-toggle">
        <button 
          class="toggle-btn clickable" 
          :class="{ active: gender === 'male' }"
          @click="gender = 'male'; calculateResult()"
        >Muž</button>
        <button 
          class="toggle-btn clickable" 
          :class="{ active: gender === 'female' }"
          @click="gender = 'female'; calculateResult()"
        >Žena</button>
      </div>
    </div>

    <div class="input-grid">
      <div class="input-item">
        <label>Váha (kg)</label>
        <input type="number" v-model="weight" @input="calculateResult" />
      </div>
      <div class="input-item">
        <label>Výška (cm)</label>
        <input type="number" v-model="height" @input="calculateResult" />
      </div>
      <div v-if="tool.id === 'bmr-calc' || tool.id === 'bmi-calc'" class="input-item">
        <label>Vek (roky)</label>
        <input type="number" v-model="age" @input="calculateResult" />
      </div>
    </div>

    <div class="results-panel glass mt-2 reveal" v-if="results.length">
      <div v-for="res in results" :key="res.label" class="result-card">
        <span class="res-label">{{ res.label }}</span>
        <span class="res-value" :style="{ color: res.color || 'var(--accent-gold)' }">{{ res.value }}</span>
        <span class="res-sub" v-if="res.sub">{{ res.sub }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  tool: Object
})

const gender = ref('male')
const weight = ref(75)
const height = ref(180)
const age = ref(25)
const results = ref([])

const calculateResult = () => {
  const id = props.tool.id
  results.value = []

  if (id === 'bmi-calc') {
    const bmi = (weight.value / Math.pow(height.value / 100, 2)).toFixed(1)
    let category = 'Normálna váha'
    let color = '#2ed573'
    if (bmi < 18.5) { category = 'Podváha'; color = '#1e90ff' }
    else if (bmi > 25 && bmi < 30) { category = 'Nadváha'; color = '#ffa502' }
    else if (bmi >= 30) { category = 'Obezita'; color = '#ff4757' }
    
    results.value = [
      { label: 'Vaše BMI', value: bmi },
      { label: 'Kategória', value: category, color }
    ]
  }

  if (id === 'bmr-calc') {
    // Harris-Benedict Equation
    let bmr = 0
    if (gender.value === 'male') {
      bmr = 88.36 + (13.4 * weight.value) + (4.8 * height.value) - (5.7 * age.value)
    } else {
      bmr = 447.59 + (9.2 * weight.value) + (3.1 * height.value) - (4.3 * age.value)
    }
    results.value = [
      { label: 'Bazálny metabolizmus', value: Math.round(bmr).toLocaleString() + ' kcal', sub: 'Toľko spáli vaše telo v pokoji.' }
    ]
  }

  if (id === 'water-goal') {
    const water = (weight.value * 0.033).toFixed(1)
    results.value = [
      { label: 'Denný cieľ', value: water + ' L', sub: 'Odporúčaná hydratácia pre vašu váhu.' }
    ]
  }

  if (id === 'calorie-burn') {
    const activities = [
      { name: 'Chôdza (5 km/h)', met: 3.5 },
      { name: 'Beh (8 km/h)', met: 8 },
      { name: 'Cyklistika', met: 6 },
      { name: 'Plávanie', met: 7 },
      { name: 'Silový tréning', met: 5 }
    ]
    results.value = activities.map(a => ({
      label: a.name,
      value: Math.round(a.met * weight.value * 0.0175 * 60) + ' kcal/h'
    }))
  }

  if (id === 'ideal-weight') {
    // Devine formula (1974)
    let ideal = 0
    const hInches = height.value / 2.54
    const base = 50 + 2.3 * (hInches - 60)
    ideal = gender.value === 'male' ? base : base - 5
    results.value = [
      { label: 'Ideálna hmotnosť', value: Math.round(ideal) + ' kg', sub: 'Odporúčané podľa lekárskych tabuliek.' }
    ]
  }
}

onMounted(() => { calculateResult() })
watch(() => props.tool.id, () => { calculateResult() })
</script>

<style scoped>
.health-engine { padding: 3rem; border-radius: var(--radius-lg); width: 100%; max-width: 800px; }
.gender-toggle { display: flex; gap: 1rem; margin-bottom: 2rem; justify-content: center; }
.toggle-btn {
  padding: 0.8rem 2rem; border-radius: var(--radius-full);
  background: var(--bg-soft); border: 1px solid var(--border-dim);
  color: var(--text-muted); font-weight: 700; transition: all 0.3s;
}
.toggle-btn.active { background: var(--accent-gold); color: var(--bg-deep); border-color: var(--accent-gold); }

.input-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.input-item { display: flex; flex-direction: column; gap: 0.8rem; }
.input-item label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
input { 
  background: var(--bg-deep); border: 1px solid var(--border-dim); padding: 1rem;
  border-radius: 8px; color: var(--text-primary); font-size: 1.25rem; font-weight: 700;
}

.results-panel { margin-top: 2.5rem; display: grid; gap: 1.5rem; padding: 2rem; }
.result-card { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.5rem; }
.res-label { font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; }
.res-value { font-size: 2.5rem; font-weight: 900; }
.res-sub { font-size: 0.85rem; color: var(--text-secondary); opacity: 0.7; }

@media (max-width: 600px) { .input-grid { grid-template-columns: 1fr; } }
</style>
