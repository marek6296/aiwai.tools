<template>
  <div class="productivity-engine">
    <!-- POMODORO TIMER -->
    <div v-if="tool.id === 'pomodoro'" class="pomodoro-tool reveal">
      <div class="timer-display glass">
        <div class="circular-progress" :style="progressStyle">
          <div class="inner-circle">
            <span class="time">{{ formattedTime }}</span>
            <span class="mode">{{ timerMode === 'work' ? 'Sústredenie' : 'Oddych' }}</span>
          </div>
        </div>
      </div>

      <div class="timer-controls">
        <button class="btn-ctrl clickable" @click="toggleTimer">
          <PhPlay v-if="!isRunning" :size="24" weight="fill" />
          <PhPause v-else :size="24" weight="fill" />
        </button>
        <button class="btn-ctrl secondary clickable" @click="resetTimer">
          <PhArrowsCounterClockwise :size="24" />
        </button>
      </div>

      <div class="mode-chips">
        <button 
          v-for="m in ['work', 'shortBR', 'longBR']" 
          :key="m" 
          :class="['chip', 'clickable', { active: timerMode === m }]"
          @click="setMode(m)"
        >
          {{ modeNames[m] }}
        </button>
      </div>
    </div>

    <!-- TIME ZONE CONVERTER -->
    <div v-else-if="tool.id === 'time-conv'" class="timezone-tool reveal">
      <div class="tz-panel glass">
        <div class="tz-input-row">
          <div class="tz-field">
            <label>Čas</label>
            <input type="time" v-model="tzTime" @input="convertTimezone" />
          </div>
          <div class="tz-field">
            <label>Z časového pásma</label>
            <select v-model="tzFrom" @change="convertTimezone" class="glass">
              <option v-for="tz in timezones" :key="tz.offset" :value="tz.offset">{{ tz.name }}</option>
            </select>
          </div>
        </div>
        <div class="tz-results glass" v-if="tzTime">
          <div v-for="tz in timezones" :key="tz.offset" class="tz-row" :class="{ highlight: tz.offset === tzFrom }">
            <span class="tz-name">{{ tz.name }}</span>
            <strong class="tz-time">{{ getTimeInZone(tz.offset) }}</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- BINARY CLOCK -->
    <div v-else-if="tool.id === 'binary-clock'" class="binary-clock-tool reveal">
      <div class="clock-display glass">
        <div class="current-time">{{ currentTime }}</div>
        <div class="binary-grid">
          <div class="binary-col" v-for="(digit, i) in binaryDigits" :key="i">
            <div class="binary-label">{{ digit.label }}</div>
            <div class="binary-bits">
              <div v-for="(bit, j) in digit.bits" :key="j" class="bit" :class="{ on: bit }"></div>
            </div>
            <div class="binary-val">{{ digit.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- RANDOM PICKER -->
    <div v-else-if="tool.id === 'random-picker'" class="random-tool reveal">
      <div class="input-panel glass">
        <label>Zoznam položiek (jedna na riadok)</label>
        <textarea v-model="listInput" placeholder="Ján&#10;Anna&#10;Peter..."></textarea>
        
        <button class="btn-pick clickable" @click="pickRandom" :disabled="isSpinning">
          <PhDiceFive :size="20" weight="bold" />
          {{ isSpinning ? 'Žrebujem...' : 'Žrebovať víťaza' }}
        </button>
      </div>

      <div class="result-panel glass">
        <div v-if="winner" class="winner-display reveal">
          <span class="winner-label">Výsledok:</span>
          <div class="winner-name">{{ winner }}</div>
        </div>
        <div v-else class="picker-placeholder">
          <PhDiceFive :size="80" weight="thin" />
          <p>Kliknutím na tlačidlo vyberiete náhodnú položku</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { 
  PhPlay, PhPause, PhArrowsCounterClockwise, PhDiceFive, PhTimer 
} from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

// Pomodoro Logic
const timeLeft = ref(25 * 60)
const isRunning = ref(false)
const timerMode = ref('work') // work, shortBR, longBR
const timerInterval = ref(null)

const modeTimes = {
  work: 25 * 60,
  shortBR: 5 * 60,
  longBR: 15 * 60
}

const modeNames = {
  work: 'Práca (25m)',
  shortBR: 'Krátka pauza (5m)',
  longBR: 'Dlhá pauza (15m)'
}

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60)
  const s = timeLeft.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

const progressStyle = computed(() => {
  const total = modeTimes[timerMode.value]
  const progress = ((total - timeLeft.value) / total) * 360
  return {
    background: `conic-gradient(var(--accent-gold) ${progress}deg, rgba(255,255,255,0.05) 0deg)`
  }
})

const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(timerInterval.value)
    isRunning.value = false
  } else {
    isRunning.value = true
    timerInterval.value = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        clearInterval(timerInterval.value)
        isRunning.value = false
        // Play notification sound here if needed
      }
    }, 1000)
  }
}

const resetTimer = () => {
  clearInterval(timerInterval.value)
  isRunning.value = false
  timeLeft.value = modeTimes[timerMode.value]
}

const setMode = (mode) => {
  timerMode.value = mode
  resetTimer()
}

// Timezone Logic
const tzTime = ref('12:00')
const tzFrom = ref(1)
const timezones = [
  { name: 'Londýn (GMT)', offset: 0 },
  { name: 'Bratislava (CET)', offset: 1 },
  { name: 'Moskva (MSK)', offset: 3 },
  { name: 'Dubai (GST)', offset: 4 },
  { name: 'Tokio (JST)', offset: 9 },
  { name: 'Sydney (AEST)', offset: 10 },
  { name: 'New York (EST)', offset: -5 },
  { name: 'Los Angeles (PST)', offset: -8 }
]

const convertTimezone = () => {} // Reactivity via getTimeInZone

const getTimeInZone = (targetOffset) => {
  const [h, m] = tzTime.value.split(':').map(Number)
  const diff = targetOffset - tzFrom.value
  let newH = (h + diff) % 24
  if (newH < 0) newH += 24
  return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Binary Clock Logic
const currentTime = ref('')
const binaryDigits = ref([])
let clockInterval = null

const updateBinaryClock = () => {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${h}:${m}:${s}`

  const digits = [
    { label: 'H', value: h[0], bits: toBits(parseInt(h[0]), 3) },
    { label: 'H', value: h[1], bits: toBits(parseInt(h[1]), 4) },
    { label: 'M', value: m[0], bits: toBits(parseInt(m[0]), 3) },
    { label: 'M', value: m[1], bits: toBits(parseInt(m[1]), 4) },
    { label: 'S', value: s[0], bits: toBits(parseInt(s[0]), 3) },
    { label: 'S', value: s[1], bits: toBits(parseInt(s[1]), 4) }
  ]
  binaryDigits.value = digits
}

const toBits = (num, len) => {
  const bits = []
  for (let i = len - 1; i >= 0; i--) {
    bits.push((num >> i) & 1 ? true : false)
  }
  return bits
}

// Random Picker Logic
const listInput = ref('Možnosť 1\nMožnosť 2\nMožnosť 3')
const winner = ref('')
const isSpinning = ref(false)

const pickRandom = () => {
  const items = listInput.value.split('\n').map(i => i.trim()).filter(i => i)
  if (!items.length) return
  
  isSpinning.value = true
  winner.value = ''
  
  // Fake animation effect
  setTimeout(() => {
    const idx = Math.floor(Math.random() * items.length)
    winner.value = items[idx]
    isSpinning.value = false
  }, 800)
}

onMounted(() => {
  if (props.tool.id === 'binary-clock') {
    updateBinaryClock()
    clockInterval = setInterval(updateBinaryClock, 1000)
  }
})

onUnmounted(() => {
  clearInterval(timerInterval.value)
  if (clockInterval) clearInterval(clockInterval)
})

watch(() => props.tool.id, () => {
  resetTimer()
})
</script>

<style scoped>
.productivity-engine {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding: 1rem;
}

/* Pomodoro Styles */
.pomodoro-tool {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.circular-progress {
  width: 320px;
  height: 320px;
  border-radius: 50%;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 50px rgba(0,0,0,0.3);
}

.inner-circle {
  width: 100%;
  height: 100%;
  background: var(--bg-deep);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.time {
  font-size: 5rem;
  font-weight: 800;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.mode {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent-gold);
  font-weight: 700;
}

.timer-controls {
  display: flex;
  gap: 1.5rem;
}

.btn-ctrl {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--accent-gold);
  color: var(--bg-deep);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 8px 30px rgba(197, 169, 106, 0.3);
}

.btn-ctrl:hover {
  transform: scale(1.1);
}

.btn-ctrl.secondary {
  background: var(--bg-soft);
  color: var(--text-secondary);
  border: 1px solid var(--border-dim);
  box-shadow: none;
}

.mode-chips {
  display: flex;
  gap: 1rem;
}

.chip {
  padding: 0.6rem 1.2rem;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: all 0.3s;
}

.chip.active {
  background: rgba(197, 169, 106, 0.1);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

/* Random Picker Styles */
.random-tool {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
}

.input-panel {
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-panel label {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
}

textarea {
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  min-height: 250px;
  color: var(--text-primary);
  font-size: 1rem;
  resize: none;
  outline: none;
}

.btn-pick {
  padding: 1rem;
  background: var(--accent-gold);
  color: var(--bg-deep);
  border-radius: var(--radius-md);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: none;
}

.result-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  min-height: 350px;
}

.winner-display {
  text-align: center;
}

.winner-label {
  font-size: 0.9rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.winner-name {
  font-size: 3.5rem;
  font-weight: 900;
  color: var(--accent-gold);
  margin-top: 1rem;
  background: linear-gradient(135deg, #cea96a 0%, #ffdf91 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.picker-placeholder {
  text-align: center;
  opacity: 0.2;
  color: var(--text-muted);
}

/* Timezone Converter */
.timezone-tool { width: 100%; }
.tz-panel { width: 100%; padding: 2rem; display: flex; flex-direction: column; gap: 2rem; }
.tz-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.tz-field { display: flex; flex-direction: column; gap: 0.5rem; }
.tz-field label { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); }
.tz-field input, .tz-field select { padding: 1rem; background: var(--bg-deep); border: 1px solid var(--border-dim); border-radius: 8px; color: var(--text-primary); font-size: 1.1rem; outline: none; }
.tz-results { display: flex; flex-direction: column; gap: 0; padding: 0; overflow: hidden; }
.tz-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-dim); }
.tz-row:last-child { border: none; }
.tz-row.highlight { background: rgba(197, 169, 106, 0.1); }
.tz-name { font-size: 0.9rem; color: var(--text-secondary); }
.tz-time { font-size: 1.25rem; color: var(--accent-gold); font-variant-numeric: tabular-nums; }

/* Binary Clock */
.binary-clock-tool { display: flex; justify-content: center; width: 100%; }
.clock-display { padding: 3rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 2rem; }
.current-time { font-size: 4rem; font-weight: 800; color: var(--text-primary); font-variant-numeric: tabular-nums; letter-spacing: 0.1em; }
.binary-grid { display: flex; gap: 1.5rem; }
.binary-col { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.binary-label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
.binary-bits { display: flex; flex-direction: column; gap: 0.4rem; }
.bit { width: 24px; height: 24px; border-radius: 50%; background: var(--bg-soft); border: 2px solid var(--border-dim); transition: all 0.3s; }
.bit.on { background: var(--accent-gold); border-color: var(--accent-gold); box-shadow: 0 0 10px rgba(197, 169, 106, 0.4); }
.binary-val { font-size: 1.5rem; font-weight: 900; color: var(--accent-gold); }

@media (max-width: 768px) {
  .random-tool { grid-template-columns: 1fr; }
  .tz-input-row { grid-template-columns: 1fr; }
}
</style>
