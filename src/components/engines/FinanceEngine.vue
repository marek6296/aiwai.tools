<template>
  <div class="finance-engine glass">
    <div class="engine-ui">
      <!-- Retirement Planner -->
      <div v-if="tool.id === 'retirement-calc'" class="finance-tool">
        <div class="input-grid">
          <div class="field">
            <label>Aktuálny vek</label>
            <input type="number" v-model="age" />
          </div>
          <div class="field">
            <label>Vek odchodu do dôchodku</label>
            <input type="number" v-model="retireAge" />
          </div>
          <div class="field">
            <label>Mesačná úspora (€)</label>
            <input type="number" v-model="monthlySave" />
          </div>
          <div class="field">
            <label>Očakávaný výnos (%)</label>
            <input type="number" v-model="yieldRate" />
          </div>
        </div>
        <div class="results-grid mt-2" v-if="monthlySave">
          <div class="res-card glass reveal">
            <div class="label">Budúca suma v dôchodku:</div>
            <div class="val gold">{{ retirementTotal.toLocaleString() }} €</div>
            <p class="sub">Odhad pri zachovaní vkladu a úroku.</p>
          </div>
        </div>
      </div>

      <!-- Inflation Impact -->
      <div v-else-if="tool.id === 'inflation-impact'" class="finance-tool">
        <label>Suma (€)</label>
        <input type="number" v-model="val1" placeholder="napr. 10000" />
        <label>Počet rokov</label>
        <input type="range" v-model="years" min="1" max="50" class="range-input clickable" />
        <p class="text-center">{{ years }} rokov</p>
        
        <div class="inflation-results glass mt-2 reveal" v-if="val1">
          <div class="res-label text-center">Kúpna sila vašich peňazí (pri 3% inflácii):</div>
          <div class="val text-center" :style="{ color: '#ff4757' }">{{ inflationVal.toLocaleString() }} €</div>
          <div class="loss-bar mt-1">
            <div class="loss-fill" :style="{ width: (inflationVal / val1 * 100) + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Margin Calculator -->
      <div v-else-if="tool.id === 'margin-calc'" class="finance-tool">
        <div class="input-grid">
          <div class="field">
            <label>Nákupná cena (€)</label>
            <input type="number" v-model="costPrice" />
          </div>
          <div class="field">
            <label>Predajná cena (€)</label>
            <input type="number" v-model="sellPrice" />
          </div>
        </div>
        <div class="roi-result glass mt-2 text-center reveal" v-if="costPrice && sellPrice">
          <div class="label">Zisk:</div>
          <div class="val gold">{{ (sellPrice - costPrice).toFixed(2) }} €</div>
          <div class="net-profit mt-1">
            Marža: <strong>{{ (((sellPrice - costPrice) / sellPrice) * 100).toFixed(2) }} %</strong>
            &nbsp;|&nbsp;
            Prirážka: <strong>{{ (((sellPrice - costPrice) / costPrice) * 100).toFixed(2) }} %</strong>
          </div>
        </div>
      </div>

      <!-- ROI Calculator -->
      <div v-else-if="tool.id === 'roi-calc'" class="finance-tool">
        <div class="input-grid">
          <div class="field">
            <label>Investovaná suma (€)</label>
            <input type="number" v-model="val1" />
          </div>
          <div class="field">
            <label>Celkový zisk / Výnos (€)</label>
            <input type="number" v-model="val2" />
          </div>
        </div>
        <div class="roi-result glass mt-2 text-center reveal" v-if="val1 && val2">
          <div class="label">Návratnosť investície (ROI):</div>
          <div class="val" :class="{ gold: ((val2 - val1) / val1) > 0, red: ((val2 - val1) / val1) < 0 }">
            {{ (((val2 - val1) / val1) * 100).toFixed(2) }} %
          </div>
          <div class="net-profit mt-1">Zisk: <strong>{{ (val2 - val1).toLocaleString() }} €</strong></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  tool: Object
})

const age = ref(30)
const retireAge = ref(65)
const monthlySave = ref(100)
const yieldRate = ref(7)
const val1 = ref(1000)
const val2 = ref(2000)
const costPrice = ref(100)
const sellPrice = ref(150)
const years = ref(10)

const retirementTotal = computed(() => {
  const months = (retireAge.value - age.value) * 12
  const r = (yieldRate.value / 100) / 12
  const res = monthlySave.value * ((Math.pow(1 + r, months) - 1) / r) * (1 + r)
  return Math.round(res)
})

const inflationVal = computed(() => {
  const rate = 0.03 // 3% average inflation
  return Math.round(val1.value / Math.pow(1 + rate, years.value))
})
</script>

<style scoped>
.finance-engine { padding: 3rem; border-radius: var(--radius-lg); width: 100%; max-width: 800px; }
.input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.field { display: flex; flex-direction: column; gap: 0.5rem; }
label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
input { 
  width: 100%; background: var(--bg-deep); border: 1px solid var(--border-dim);
  padding: 1.25rem; color: var(--text-primary); border-radius: 12px; outline: none; font-size: 1.1rem;
}

.results-grid, .roi-result, .inflation-results { padding: 3rem; border: 1px solid var(--accent-gold); text-align: center; }
.val { font-size: 3rem; font-weight: 900; margin: 1rem 0; }
.red { color: #ff4757; }
.gold { color: var(--accent-gold); }
.sub { font-size: 0.85rem; color: var(--text-muted); }

.loss-bar { width: 100%; height: 8px; background: var(--bg-deep); border-radius: 4px; overflow: hidden; }
.loss-fill { height: 100%; background: var(--accent-gold); transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

.range-input { 
  accent-color: var(--accent-gold); width: 100%; height: 6px; background: var(--bg-soft); border-radius: 10px; margin: 1.5rem 0;
}
.text-center { text-align: center; }
.mt-1 { margin-top: 1rem; }
.mt-2 { margin-top: 2rem; }
</style>
