<template>
  <div class="unit-engine">
    <div class="converter-box glass">
      <div class="input-section">
        <label>Z hodnoty</label>
        <div class="field-row">
          <input 
            v-model.number="amount" 
            type="number" 
            class="unit-input glass" 
            placeholder="0.00"
            @input="convert"
          />
          <select v-model="fromUnit" class="unit-select glass" @change="convert">
            <option v-for="u in units" :key="u.id" :value="u.id">{{ u.name }}</option>
          </select>
        </div>
      </div>

      <div class="swap-divider">
        <button class="btn-swap clickable" @click="swapUnits">
          <PhArrowsLeftRight :size="20" />
        </button>
      </div>

      <div class="input-section">
        <label>Na hodnotu</label>
        <div class="field-row">
          <input 
            v-model.number="result" 
            type="number" 
            class="unit-input glass result-field" 
            placeholder="0.00"
            readonly
          />
          <select v-model="toUnit" class="unit-select glass" @change="convert">
            <option v-for="u in units" :key="u.id" :value="u.id">{{ u.name }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="formula-box glass" v-if="amount">
      <PhInfo :size="18" />
      <span>Vzorec: {{ amount }} {{ fromUnit }} = {{ result }} {{ toUnit }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { PhArrowsLeftRight, PhInfo } from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

const amount = ref(1)
const result = ref(0)
const fromUnit = ref('')
const toUnit = ref('')

// Unit Definitions
const unitData = {
  'km-miles': {
    units: [{ id: 'km', name: 'Kilometre' }, { id: 'mi', name: 'Míle' }],
    convert: (val, from, to) => from === 'km' ? val * 0.621371 : val / 0.621371
  },
  'kg-lbs': {
    units: [{ id: 'kg', name: 'Kilogramy' }, { id: 'lb', name: 'Libry' }],
    convert: (val, from, to) => from === 'kg' ? val * 2.20462 : val / 2.20462
  },
  'cels-fahr': {
    units: [{ id: 'C', name: 'Celsius' }, { id: 'F', name: 'Fahrenheit' }],
    convert: (val, from, to) => from === 'C' ? (val * 9/5) + 32 : (val - 32) * 5/9
  },
  'mb-gb': {
    units: [{ id: 'MB', name: 'Megabajty' }, { id: 'GB', name: 'Gigabajty' }],
    convert: (val, from, to) => from === 'MB' ? val / 1024 : val * 1024
  }
}

const currentConfig = computed(() => unitData[props.tool.id] || unitData['km-miles'])
const units = computed(() => currentConfig.value.units)

const convert = () => {
  if (amount.value === null || amount.value === undefined) {
    result.value = 0
    return
  }
  result.value = Number(currentConfig.value.convert(amount.value, fromUnit.value, toUnit.value).toFixed(4))
}

const swapUnits = () => {
  const temp = fromUnit.value
  fromUnit.value = toUnit.value
  toUnit.value = temp
  convert()
}

const init = () => {
  fromUnit.value = units.value[0].id
  toUnit.value = units.value[1].id
  convert()
}

onMounted(init)
watch(() => props.tool.id, init)
</script>

<style scoped>
.unit-engine {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.converter-box {
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-soft);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-section label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.field-row {
  display: flex;
  gap: 1rem;
}

.unit-input {
  flex: 1;
  padding: 1rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-dim);
  background: var(--bg-deep);
  color: var(--text-primary);
  outline: none;
  transition: all 0.3s;
}

.unit-input:focus {
  border-color: var(--accent-gold);
}

.result-field {
  background: var(--bg-soft);
  color: var(--accent-gold);
  border-color: var(--border-soft);
}

.unit-select {
  width: 140px;
  padding: 0 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-dim);
  background: var(--bg-soft);
  color: var(--text-primary);
  font-weight: 600;
  outline: none;
}

.swap-divider {
  display: flex;
  justify-content: center;
  position: relative;
}

.btn-swap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg-soft);
  border: 1px solid var(--border-soft);
  color: var(--accent-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-swap:hover {
  transform: rotate(180deg);
  background: var(--accent-gold);
  color: var(--bg-deep);
}

.formula-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .field-row { flex-direction: column; }
  .unit-select { width: 100%; height: 48px; }
}
</style>
