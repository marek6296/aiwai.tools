<template>
  <div class="gaming-engine">
    <div class="engine-ui">
      <!-- Spin the Bottle -->
      <div v-if="tool.id === 'spin-bottle'" class="gaming-tool bottle-section">
        <div class="bottle-container" @click="spinBottle">
          <div class="bottle" :style="{ transform: `rotate(${rotation}deg)` }">
            <svg viewBox="0 0 100 200" width="100" height="200">
              <path d="M50 10 L30 50 L30 150 Q30 180 50 180 Q70 180 70 150 L70 50 L50 10" fill="var(--accent-gold)" />
              <rect x="40" y="30" width="20" height="40" rx="10" fill="rgba(255,255,255,0.2)" />
            </svg>
          </div>
          <div class="bottle-base"></div>
        </div>
        <p class="text-center mt-2">Kliknite na fľašu pre točenie</p>
      </div>

      <!-- Wheel of Fortune (SVG Version) -->
      <div v-else-if="tool.id === 'wheel-fortune'" class="gaming-tool wheel-section">
        <div class="wheel-main">
          <div class="pointer-wrapper">
             <div class="pointer-pin"></div>
          </div>
          <div class="wheel-outer" :style="{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'all 5s cubic-bezier(0.15, 0, 0.15, 1)' : 'none' }">
            <svg viewBox="0 0 100 100" class="wheel-svg">
              <g v-for="(opt, i) in options" :key="i" :transform="`rotate(${(360/options.length) * i} 50 50)`">
                <path :d="describeArc(50, 50, 48, 0, 360/options.length)" :fill="getSliceColor(i)" />
                <!-- Text logic: Midpoint of slice, rotated radially -->
                <text 
                  :x="50 + 35" 
                  :y="50" 
                  :transform="`rotate(${(360/options.length) / 2} 50 50)`" 
                  class="slice-text"
                  text-anchor="end"
                  dominant-baseline="middle"
                >
                  {{ opt }}
                </text>
              </g>
              <circle cx="50" cy="50" r="4" fill="white" />
            </svg>
          </div>
        </div>
        
        <div class="winner-announcement glass" v-if="winner && !spinning">
          <PhSparkle :size="24" class="gold" />
          <span>VÝHERCA: <strong>{{ winner }}</strong></span>
          <PhSparkle :size="24" class="gold" />
        </div>

        <div class="wheel-controls glass mt-2">
          <div class="input-row">
            <input type="text" v-model="newOption" @keyup.enter="addOption" placeholder="Pridáť možnosť..." class="glass-input" />
            <button @click="addOption" class="btn-add"><PhPlus :size="20"/></button>
          </div>
          <div class="options-list" v-if="options.length > 0">
            <div v-for="(opt, i) in options" :key="i" class="opt-tag glass">
              {{ opt }} <PhX :size="14" class="clickable" @click="options.splice(i, 1)" />
            </div>
          </div>
          <button class="btn-spin clickable" @click="spinWheel" :disabled="spinning">SPIN THE WHEEL!</button>
        </div>
      </div>

      <!-- Digital Dice (3D dots dice) -->
      <div v-else-if="tool.id === 'dice-roll'" class="gaming-tool dice-section">
        <div class="dice-3d-container" @click="rollSingleDice">
          <div class="dice-3d" :style="getDiceTransform(diceResult, diceRotation)">
            <div class="face front"><span></span></div>
            <div class="face back"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            <div class="face right"><span></span><span></span><span></span></div>
            <div class="face left"><span></span><span></span><span></span><span></span></div>
            <div class="face top"><span></span><span></span></div>
            <div class="face bottom"><span></span><span></span><span></span><span></span><span></span></div>
          </div>
        </div>
        <button class="btn-main mt-3 clickable" @click="rollSingleDice" :disabled="spinning">HODIŤ KOCKOU</button>
      </div>

      <!-- Multi-Dice (Now with 3D Dice) -->
      <div v-else-if="tool.id === 'multi-dice'" class="gaming-tool multi-dice-section">
        <div class="dice-grid-3d">
          <div v-for="(d, i) in multiDiceArray" :key="i" class="dice-3d-mini-container">
             <div class="dice-3d mini" :style="getDiceTransform(d.val, d.rot)">
                <div class="face front"><span></span></div>
                <div class="face back"><span></span><span></span><span></span><span></span><span></span><span></span></div>
                <div class="face right"><span></span><span></span><span></span></div>
                <div class="face left"><span></span><span></span><span></span><span></span></div>
                <div class="face top"><span></span><span></span></div>
                <div class="face bottom"><span></span><span></span><span></span><span></span><span></span></div>
             </div>
          </div>
        </div>
        <div class="dice-controls-panel glass mt-2">
           <div class="count-selector">
             <label>Počet kociek:</label>
             <input type="range" v-model="diceCount" min="1" max="5" class="range-gold" />
             <span class="count-badge">{{ diceCount }}</span>
           </div>
           <button class="btn-main full-width mt-1" @click="rollMultiDice" :disabled="spinning">HODIŤ VŠETKÝMI ({{ multiDiceSum }})</button>
        </div>
      </div>

      <!-- Coin Flip (3D) -->
      <div v-else-if="tool.id === 'coin-flip'" class="gaming-tool coin-section">
        <div class="coin-container" @click="flipCoin">
          <div class="coin" :class="{ flipping: spinning }" :style="{ transform: `rotateY(${rotation}deg)` }">
            <div class="side heads"><span>PANNA</span></div>
            <div class="side tails"><span>OROL</span></div>
          </div>
        </div>
        <div class="coin-result glass mt-2" v-if="winner && !spinning">
          VÝSLEDOK: <strong>{{ winner }}</strong>
        </div>
      </div>

      <!-- Truth or Dare -->
      <div v-else-if="tool.id === 'truth-dare'" class="gaming-tool truth-dare-section">
        <div class="td-display glass">
          <div v-if="tdTask" class="td-content reveal">
             <div class="td-label">{{ tdType === 'truth' ? 'Pravda' : 'Odvaha' }}</div>
             <p>{{ tdTask }}</p>
          </div>
          <div v-else class="td-placeholder">Vyberte si svoj osud</div>
        </div>
        <div class="td-actions mt-2">
          <button class="btn-td truth" @click="pickTD('truth')">PRAVDA</button>
          <button class="btn-td dare" @click="pickTD('dare')">ODVAHA</button>
        </div>
      </div>

      <!-- Score Keeper -->
      <div v-else-if="tool.id === 'score-keeper'" class="gaming-tool score-section">
        <div class="scores-grid">
          <div v-for="p in players" :key="p.id" class="player-card glass">
            <div class="p-name">{{ p.name }}</div>
            <div class="p-score">{{ p.score }}</div>
            <div class="p-actions">
              <button class="score-btn" @click="p.score--">-</button>
              <button class="score-btn plus" @click="p.score++">+</button>
            </div>
          </div>
        </div>
        <button class="btn-sub mt-2 full-width" @click="resetScores">Resetovať body</button>
      </div>

      <!-- RPS Game -->
      <div v-else-if="tool.id === 'rps-game'" class="gaming-tool rps-section">
        <div class="rps-choices">
          <button v-for="c in ['Rock', 'Paper', 'Scissors']" :key="c" @click="playRPS(c)" class="rps-btn glass">
            {{ c === 'Rock' ? '✊' : c === 'Paper' ? '✋' : '✌️' }}
          </button>
        </div>
        <div v-if="rpsResult" class="rps-battle glass mt-2 reveal">
          <div class="battle-side"><span>Vy:</span> <strong>{{ rpsUser }}</strong></div>
          <div class="battle-vs">VS</div>
          <div class="battle-side"><span>AIWai:</span> <strong>{{ rpsAI }}</strong></div>
          <div class="battle-winner mt-1 gold">{{ rpsResult }}</div>
        </div>
      </div>

      <!-- Card Picker -->
      <div v-else-if="tool.id === 'card-picker'" class="gaming-tool card-section">
        <div class="card-display glass" :class="{ picking: spinning }" @click="pickCard">
          <div v-if="card" class="card-content">
            <div class="card-rank">{{ card.rank }}</div>
            <div class="card-suit">{{ card.suit }}</div>
          </div>
          <div v-else class="card-back">?</div>
        </div>
        <p class="text-center mt-2">Kliknite na kartu pre výber</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { PhCopy, PhSparkle, PhPlus, PhX } from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

// General State
const spinning = ref(false)
const rotation = ref(0)
const options = ref(['Pivo', 'Pizza', 'Kino', 'Výlet', 'Spánok'])
const newOption = ref('')
const winner = ref('')

// Dice State
const diceCount = ref(2)
const diceResult = ref(1)
const diceRotation = reactive({ x: 0, y: 0 })
const multiDiceArray = ref([
  { val: 1, rot: { x: 0, y: 0 } },
  { val: 1, rot: { x: 0, y: 0 } }
])
const multiDiceSum = computed(() => multiDiceArray.value.reduce((a, b) => a + b.val, 0))

// Truth or Dare State
const tdType = ref('truth')
const tdTask = ref('')
const truths = [
  "Aká je tvoja najtrápnejšia spomienka?",
  "Kedy si naposledy klamal a o čom?",
  "Kto je tvoj 'secret crush'?",
  "Čo je najdivnejšia vec, ktorú si kedy jedol?",
  "Máš nejaký strach, o ktorom nikto nevie?"
]
const dares = [
  "Zatancuj ako kura po dobu 30 sekúnd.",
  "Zavolaj náhodnému kontaktu a zaspievaj 'Happy Birthday'.",
  "Urob 20 klikov hneď teraz.",
  "Daj si lyžičku horčice alebo kečupu.",
  "Napodobňuj niekoho v miestnosti, kým neuhádnu kto to je."
]

// Wheel Helpers (RESTORED)
const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
  return [
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "L", x, y
  ].join(" ")
}

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  }
}

const getSliceColor = (i) => {
  const colors = ['#C5A96A', '#1A1A1A', '#2A2A2A', '#3A3A3A', '#D4AF37']
  return colors[i % colors.length]
}

const getDiceTransform = (val, rot) => {
  const baseRotations = {
    1: { x: 0, y: 0 },
    2: { x: -90, y: 0 },
    3: { x: 0, y: -90 },
    4: { x: 0, y: 90 },
    5: { x: 90, y: 0 },
    6: { x: 180, y: 0 }
  }
  const base = baseRotations[val] || { x: 0, y: 0 }
  return { transform: `rotateX(${rot.x + base.x}deg) rotateY(${rot.y + base.y}deg)` }
}

const spinWheel = () => {
  if (spinning.value || options.value.length < 2) return
  spinning.value = true
  winner.value = ''
  
  const sectorCount = options.value.length
  const sectorAngle = 360 / sectorCount
  const spins = 10 
  const randomSector = Math.floor(Math.random() * sectorCount)
  const finalRotation = rotation.value + (spins * 360) + (360 - (randomSector * sectorAngle))

  rotation.value = finalRotation
  setTimeout(() => {
    spinning.value = false
    winner.value = options.value[randomSector]
  }, 5000)
}

// Watch for diceCount changes to rebuild multiDiceArray
watch(diceCount, (newVal) => {
  multiDiceArray.value = Array.from({ length: newVal }, () => ({ val: 1, rot: { x: 0, y: 0 } }))
})

const rollSingleDice = () => {
  if (spinning.value) return
  spinning.value = true
  const res = Math.floor(Math.random() * 6) + 1
  
  // Add 3-5 full rotations + some extra randomness
  diceRotation.x += 1080 + Math.floor(Math.random() * 360)
  diceRotation.y += 1080 + Math.floor(Math.random() * 360)
  diceResult.value = res
  
  setTimeout(() => {
    spinning.value = false
  }, 1200)
}

const rollMultiDice = () => {
  if (spinning.value) return
  spinning.value = true
  
  multiDiceArray.value = multiDiceArray.value.map(d => ({
    val: Math.floor(Math.random() * 6) + 1,
    rot: {
      x: d.rot.x + 1080 + Math.floor(Math.random() * 360),
      y: d.rot.y + 1080 + Math.floor(Math.random() * 360)
    }
  }))

  setTimeout(() => {
    spinning.value = false
  }, 1200)
}

const flipCoin = () => {
  if (spinning.value) return
  spinning.value = true
  winner.value = ''
  const isHeads = Math.random() > 0.5
  rotation.value += 1800 + (isHeads ? 0 : 180)
  
  setTimeout(() => {
    spinning.value = false
    winner.value = isHeads ? 'PANNA' : 'OROL'
  }, 2000)
}

const pickTD = (type) => {
  tdType.value = type
  const list = type === 'truth' ? truths : dares
  tdTask.value = list[Math.floor(Math.random() * list.length)]
}

const addOption = () => {
  if (newOption.value.trim()) {
    options.value.push(newOption.value.trim())
    newOption.value = ''
  }
}

// Inherited handlers
const players = reactive([
  { id: 1, name: 'Hráč 1', score: 0 },
  { id: 2, name: 'Hráč 2', score: 0 },
  { id: 3, name: 'Hráč 3', score: 0 },
  { id: 4, name: 'Hráč 4', score: 0 }
])
const rpsUser = ref(''), rpsAI = ref(''), rpsResult = ref(''), card = ref(null)

const spinBottle = () => {
  if (spinning.value) return
  spinning.value = true
  rotation.value += 1800 + Math.random() * 360
  setTimeout(() => spinning.value = false, 3000)
}
const resetScores = () => players.forEach(p => p.score = 0)
const playRPS = (user) => {
  const choices = ['Rock', 'Paper', 'Scissors'], ai = choices[Math.floor(Math.random() * 3)]
  rpsUser.value = user; rpsAI.value = ai
  if (user === ai) rpsResult.value = 'Remíza!'
  else if ((user === 'Rock' && ai === 'Scissors') || (user === 'Paper' && ai === 'Rock') || (user === 'Scissors' && ai === 'Paper')) rpsResult.value = 'Vyhrali ste!'
  else rpsResult.value = 'AIWai vyhráva!'
}
const pickCard = () => {
  spinning.value = true
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'], suits = ['❤️', '💎', '🍀', '♠️']
  setTimeout(() => { card.value = { rank: ranks[Math.floor(Math.random()*ranks.length)], suit: suits[Math.floor(Math.random()*suits.length)] }; spinning.value = false }, 800)
}
const copy = (t) => navigator.clipboard.writeText(t)

onMounted(() => {
  if (props.tool.id === 'multi-dice') rollMultiDice()
})
</script>

<style scoped>
.gaming-engine { padding: 2rem; width: 100%; max-width: 900px; margin: 0 auto; color: var(--text-primary); }

/* Wheel Premium */
.wheel-section { display: flex; flex-direction: column; align-items: center; gap: 2rem; }
.wheel-main { position: relative; width: 320px; height: 320px; }
.wheel-outer { width: 100%; height: 100%; border-radius: 50%; border: 8px solid var(--bg-soft); box-shadow: 0 0 40px rgba(0,0,0,0.5), 0 0 20px var(--accent-gold-dim); overflow: hidden; }
.wheel-svg { width: 100%; height: 100%; }
.slice-text { 
  fill: white; 
  font-size: 5px; 
  font-weight: 850; 
  text-transform: uppercase; 
  letter-spacing: 0.1px; 
  pointer-events: none;
  paint-order: stroke;
  stroke: rgba(0,0,0,0.4);
  stroke-width: 0.8px;
}
.pointer-wrapper { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); z-index: 10; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.5)); transition: transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.pointer-pin { width: 30px; height: 40px; background: var(--accent-gold); clip-path: polygon(50% 100%, 0 0, 100% 0); }

.winner-announcement { display: flex; align-items: center; gap: 1rem; padding: 1.5rem 3rem; font-size: 1.5rem; color: var(--text-primary); border: 2px solid var(--accent-gold); border-radius: var(--radius-full); animation: winnerScale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.winner-announcement strong { color: var(--accent-gold); font-size: 2rem; }

.wheel-controls { width: 100%; max-width: 500px; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
.input-row { display: flex; gap: 0.5rem; }
.btn-add { background: var(--accent-gold); color: var(--bg-deep); border: none; padding: 0 1rem; border-radius: 8px; }
.options-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.opt-tag { padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); }

/* 3D Dice */
.dice-section { display: flex; flex-direction: column; align-items: center; padding: 4rem 0; }
.dice-3d-container { perspective: 1000px; width: 120px; height: 120px; cursor: pointer; }
.dice-3d { 
  width: 100%; height: 100%; position: relative; transform-style: preserve-3d; 
  transition: transform 1.2s cubic-bezier(0.15, 0, 0.15, 1.2); 
}

.face { 
  position: absolute; width: 100%; height: 100%; background: #fff; border: 2px solid #ddd; border-radius: 12px;
  display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); padding: 12px;
  box-shadow: inset 0 0 15px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.2);
  backface-visibility: visible;
}
.face span { width: 18px; height: 18px; background: #111; border-radius: 50%; justify-self: center; align-self: center; box-shadow: inset 0 2px 4px rgba(255,255,255,0.2); }

/* Dot patterns for faces */
.front span { grid-area: 2/2; }
.back span:nth-child(1) { grid-area: 1/1; } .back span:nth-child(2) { grid-area: 1/3; } .back span:nth-child(3) { grid-area: 2/1; } .back span:nth-child(4) { grid-area: 2/3; } .back span:nth-child(5) { grid-area: 3/1; } .back span:nth-child(6) { grid-area: 3/3; }
.right span:nth-child(1) { grid-area: 1/1; } .right span:nth-child(2) { grid-area: 2/2; } .right span:nth-child(3) { grid-area: 3/3; }
.left span:nth-child(1) { grid-area: 1/1; } .left span:nth-child(2) { grid-area: 1/3; } .left span:nth-child(3) { grid-area: 3/1; } .left span:nth-child(4) { grid-area: 3/3; }
.top span:nth-child(1) { grid-area: 1/1; } .top span:nth-child(2) { grid-area: 3/3; }
.bottom span:nth-child(1) { grid-area: 1/1; } .bottom span:nth-child(2) { grid-area: 1/3; } .bottom span:nth-child(3) { grid-area: 2/2; } .bottom span:nth-child(4) { grid-area: 3/1; } .bottom span:nth-child(5) { grid-area: 3/3; }

/* Mini Dice Support */
.dice-grid-3d { display: flex; flex-wrap: wrap; justify-content: center; gap: 4rem; padding: 3rem 0; width: 100%; }
.dice-3d-mini-container { perspective: 800px; width: 60px; height: 60px; }
.dice-3d.mini { width: 100%; height: 100%; }
.dice-3d.mini .face { border-radius: 6px; padding: 6px; border-width: 1px; }
.dice-3d.mini .face span { width: 8px; height: 8px; }

/* Face positions - shared between large and mini via translateZ logic from container size */
.dice-3d-container .front  { transform: translateZ(60px); }
.dice-3d-container .back   { transform: rotateY(180deg) translateZ(60px); }
.dice-3d-container .right  { transform: rotateY(90deg) translateZ(60px); }
.dice-3d-container .left   { transform: rotateY(-90deg) translateZ(60px); }
.dice-3d-container .top    { transform: rotateX(90deg) translateZ(60px); }
.dice-3d-container .bottom { transform: rotateX(-90deg) translateZ(60px); }

.dice-3d.mini .front  { transform: translateZ(30px); }
.dice-3d.mini .back   { transform: rotateY(180deg) translateZ(30px); }
.dice-3d.mini .right  { transform: rotateY(90deg) translateZ(30px); }
.dice-3d.mini .left   { transform: rotateY(-90deg) translateZ(30px); }
.dice-3d.mini .top    { transform: rotateX(90deg) translateZ(30px); }
.dice-3d.mini .bottom { transform: rotateX(-90deg) translateZ(30px); }

/* Coin Flip */
.coin-section { display: flex; flex-direction: column; align-items: center; padding: 3rem 0; }
.coin-container { perspective: 1000px; width: 140px; height: 140px; cursor: pointer; }
.coin { 
  width: 100%; height: 100%; position: relative; transform-style: preserve-3d;
  transition: transform 2s cubic-bezier(0.15, 0, 0.15, 1);
}
.coin.flipping { animation: coinSpin 0.2s infinite linear; }
.side { 
  position: absolute; width: 100%; height: 100%; border-radius: 50%; backface-visibility: hidden;
  display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.2rem;
  border: 6px solid var(--accent-gold); background: var(--bg-deep); color: var(--accent-gold);
  box-shadow: 0 0 20px var(--accent-gold-dim);
}
.tails { transform: rotateY(180deg); background: var(--accent-gold); color: var(--bg-deep); }

/* Truth or Dare */
.truth-dare-section { padding: 2rem 0; text-align: center; }
.td-display { min-height: 200px; display: flex; align-items: center; justify-content: center; padding: 2rem; margin-bottom: 2rem; }
.td-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: var(--accent-gold); margin-bottom: 1rem; }
.td-content p { font-size: 1.8rem; font-weight: 700; line-height: 1.4; }
.td-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.btn-td { padding: 1.5rem; border-radius: 12px; font-weight: 900; font-size: 1.2rem; border: none; cursor: pointer; transition: all 0.3s; }
.btn-td.truth { background: #2ed573; color: white; }
.btn-td.dare { background: #ff4757; color: white; }
.btn-td:hover { transform: scale(1.05); filter: brightness(1.1); }

/* Global Utilities */
.btn-spin { background: var(--accent-gold); color: var(--bg-deep); border: none; padding: 1.2rem; border-radius: 12px; font-weight: 950; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 1px; }
.glass-input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid var(--border-dim); padding: 1rem; border-radius: 8px; color: white; outline: none; }
.btn-main { background: var(--accent-gold); color: var(--bg-deep); border: none; padding: 1rem 2rem; border-radius: 12px; font-weight: 800; }
.gold { color: var(--accent-gold); }
.mt-3 { margin-top: 3rem; }

@keyframes multiAxisSpin {
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
}

@keyframes coinSpin {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}

@keyframes winnerScale {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* Inherited styles (restored) */
.bottle-section { display: flex; flex-direction: column; align-items: center; }
.bottle-container { position: relative; width: 300px; height: 300px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.bottle { transition: transform 3s cubic-bezier(0.1, 0.7, 0.1, 1); filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5)); }
.dice-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 1rem; width: 100%; }
.dice-3d-wrap { padding: 2rem; display: flex; justify-content: center; }
.mini-dice { font-size: 3rem; font-weight: 900; color: var(--accent-gold); }
.dice-controls-panel { padding: 1.5rem; }
.count-selector { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.range-gold { flex: 1; accent-color: var(--accent-gold); }
.count-badge { font-weight: 900; background: var(--accent-gold); color: var(--bg-deep); padding: 0.2rem 0.6rem; border-radius: 4px; }
.scores-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.player-card { padding: 1.5rem; text-align: center; }
.p-score { font-size: 2.5rem; font-weight: 900; color: var(--accent-gold); }
.score-btn { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border-dim); background: var(--bg-soft); color: white; cursor: pointer; }
.btn-sub { background: var(--bg-soft); color: white; border: 1px solid var(--border-dim); padding: 1rem; border-radius: 8px; width: 100%; }
.rps-choices { display: flex; gap: 1rem; justify-content: center; }
.rps-btn { width: 70px; height: 70px; font-size: 2rem; border-radius: 50%; border: 1px solid var(--border-dim); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.card-display { width: 140px; height: 200px; border: 4px solid var(--accent-gold); border-radius: 15px; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; cursor: pointer; }
</style>
