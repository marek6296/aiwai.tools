<template>
  <div class="bmi-app">
    <div class="input-section">
      <div class="input-group">
        <label>Pohlavie</label>
        <div class="gender-toggle">
          <button 
            class="gender-btn clickable" 
            :class="{ active: gender === 'male' }"
            @click="gender = 'male'"
          >Muž</button>
          <button 
            class="gender-btn clickable" 
            :class="{ active: gender === 'female' }"
            @click="gender = 'female'"
          >Žena</button>
        </div>
      </div>

      <div class="metrics-grid">
        <div class="input-group">
          <label>Výška (cm)</label>
          <div class="input-wrapper">
            <input type="number" v-model="height" @input="calculate" placeholder="175" class="glass clickable" />
            <span>cm</span>
          </div>
          <input type="range" v-model="height" min="100" max="250" @input="calculate" class="range-input clickable" />
        </div>

        <div class="input-group">
          <label>Hmotnosť (kg)</label>
          <div class="input-wrapper">
            <input type="number" v-model="weight" @input="calculate" placeholder="70" class="glass clickable" />
            <span>kg</span>
          </div>
          <input type="range" v-model="weight" min="30" max="200" @input="calculate" class="range-input clickable" />
        </div>
      </div>
    </div>

    <div class="result-section">
      <div class="result-card glass" :style="{ borderColor: resultColor }">
        <span class="result-lbl">Vaše BMI</span>
        <h2 class="result-val" :style="{ color: resultColor }">{{ bmi }}</h2>
        <p class="result-category" :style="{ color: resultColor }">{{ category }}</p>
      </div>

      <div class="bmi-scale">
        <div class="scale-info">
          <span>Podváha</span>
          <span>Normál</span>
          <span>Nadváha</span>
          <span>Obezita</span>
        </div>
        <div class="scale-bar">
          <div class="scale-marker" :style="{ left: markerPos + '%' }"></div>
        </div>
      </div>

      <div class="healthy-range">
        Odporúčaná hmotnosť pre vašu výšku: 
        <strong>{{ healthyMin }}kg — {{ healthyMax }}kg</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const height = ref(175)
const weight = ref(70)
const gender = ref('male')

const bmi = computed(() => {
  if (!height.value || !weight.value) return 0
  const m = height.value / 100
  return (weight.value / (m * m)).toFixed(1)
})

const category = computed(() => {
  const val = parseFloat(bmi.value)
  if (val < 18.5) return 'Podváha'
  if (val < 25) return 'Zdravá váha'
  if (val < 30) return 'Nadváha'
  return 'Obezita'
})

const resultColor = computed(() => {
  const val = parseFloat(bmi.value)
  if (val < 18.5) return '#3498db'
  if (val < 25) return '#2ecc71'
  if (val < 30) return '#f1c40f'
  return '#e74c3c'
})

const markerPos = computed(() => {
  const val = parseFloat(bmi.value)
  let pos = ((val - 15) / (40 - 15)) * 100
  return Math.min(Math.max(pos, 0), 100)
})

const healthyMin = computed(() => (18.5 * (height.value / 100) ** 2).toFixed(1))
const healthyMax = computed(() => (24.9 * (height.value / 100) ** 2).toFixed(1))
</script>

<style scoped>
.bmi-app {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group label {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.gender-toggle {
  display: flex;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  padding: 0.4rem;
}

.gender-btn {
  flex: 1;
  padding: 0.8rem;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-muted);
  transition: all 0.3s;
}

.gender-btn.active {
  background: var(--accent-gold);
  color: var(--bg-deep);
}

.metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 1.25rem;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  outline: none;
}

.input-wrapper span {
  position: absolute;
  right: 1.5rem;
  font-weight: 700;
  color: var(--text-dim);
}

.range-input {
  width: 100%;
  accent-color: var(--accent-gold);
  margin-top: 0.5rem;
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  justify-content: center;
}

.result-card {
  padding: 3rem;
  text-align: center;
  border-radius: var(--radius-lg);
  border: 2px solid transparent;
  transition: border-color 0.4s ease;
}

.result-lbl {
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.8rem;
}

.result-val {
  font-family: var(--font-heading);
  font-size: 4.5rem;
  font-weight: 800;
  margin: 0.5rem 0;
  letter-spacing: -0.05em;
}

.result-category {
  font-size: 1.25rem;
  font-weight: 700;
}

.bmi-scale {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.scale-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-dim);
  text-transform: uppercase;
}

.scale-bar {
  height: 8px;
  background: linear-gradient(to right, #3498db 0%, #2ecc71 25%, #f1c40f 50%, #e74c3c 75%, #c0392b 100%);
  border-radius: 4px;
  position: relative;
}

.scale-marker {
  position: absolute;
  top: -6px;
  width: 4px;
  height: 20px;
  background: white;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.healthy-range {
  padding: 1.5rem;
  background: rgba(197, 169, 106, 0.05);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.healthy-range strong {
  color: var(--accent-gold);
  margin-left: 0.5rem;
}

@media (max-width: 900px) {
  .bmi-app {
    grid-template-columns: 1fr;
  }
}
</style>
