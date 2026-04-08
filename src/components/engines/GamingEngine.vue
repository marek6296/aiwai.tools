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
          <!-- The Pointer -->
          <div class="pointer-wrapper">
             <div class="pointer-needle" :class="{ 'needle-clicking': spinning }"></div>
             <div class="pointer-base"></div>
          </div>
          
          <!-- Confetti for winner -->
          <div class="confetti-cannon" v-if="winner && !spinning">
            <div v-for="p in 30" :key="p" class="particle" :style="getParticleStyle(p)"></div>
          </div>
          
          <!-- Decorative Bulbs -->
          <div class="wheel-decoration">
            <div v-for="i in 24" :key="i" class="deco-dot" :style="{ transform: `rotate(${i * 15}deg) translateY(-165px)` }"></div>
          </div>

          <div class="wheel-outer" :style="{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'all 5s cubic-bezier(0.15, 0, 0.15, 1)' : 'all 0.5s cubic-bezier(0.2, 0, 0, 1)' }">
            <svg viewBox="0 0 100 100" class="wheel-svg">
              <defs>
                <radialGradient id="sliceGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="60%" stop-color="rgba(0,0,0,0)" />
                  <stop offset="100%" stop-color="rgba(0,0,0,0.3)" />
                </radialGradient>
              </defs>
              <g v-for="(opt, i) in options" :key="i">
                <path :d="describeArc(50, 50, 48, (360/options.length)*i, (360/options.length)*(i+1))" :fill="getSliceColor(i)" stroke="rgba(255,255,255,0.1)" stroke-width="0.2" />
                <path :d="describeArc(50, 50, 48, (360/options.length)*i, (360/options.length)*(i+1))" fill="url(#sliceGrad)" />
                <text :x="50" :y="15" :transform="`rotate(${sliceMidAngle(i, options.length)}, 50, 50)`" text-anchor="middle" dominant-baseline="middle" :font-size="sliceFontSize(opt, options.length)" class="slice-text">{{ truncateText(opt, 12) }}</text>
              </g>
              <circle cx="50" cy="50" r="8" fill="#151515" />
              <circle cx="50" cy="50" r="6" fill="var(--accent-gold)" />
              <circle cx="50" cy="50" r="2" fill="white" opacity="0.5" />
            </svg>
          </div>
        </div>

        <div class="result-overlay" v-if="winner && !spinning" @click="winner = ''">
          <div class="result-card">
            <PhSparkle :size="24" class="gold mb-1" />
            <span class="result-label">VÝHERCA</span>
            <strong class="result-value">{{ winner }}</strong>
            <div class="tap-hint">Klepnite pre zatvorenie</div>
          </div>
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
          <button class="btn-spin clickable" @click="spinWheel" :disabled="spinning || options.length < 2">SPIN THE WHEEL!</button>
        </div>
      </div>

      <!-- Digital Dice (3D dots dice) -->
      <div v-else-if="tool.id === 'dice-roll'" class="gaming-tool dice-section">
        <div class="confetti-cannon" v-if="!spinning && diceResult > 0">
          <div v-for="p in 30" :key="p" class="particle" :style="getParticleStyle(p)"></div>
        </div>
        <div class="dice-3d-container big" @click="rollSingleDice">
          <div
            class="dice-3d"
            :class="{ transitioning: diceTransitioning }"
            :style="{ transform: `rotateX(${diceRotX}deg) rotateY(${diceRotY}deg)` }"
          >
            <div class="face front"><span></span></div>
            <div class="face back"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            <div class="face right"><span></span><span></span><span></span></div>
            <div class="face left"><span></span><span></span><span></span><span></span></div>
            <div class="face top"><span></span><span></span></div>
            <div class="face bottom"><span></span><span></span><span></span><span></span><span></span></div>
          </div>
        </div>
        
        <div class="result-overlay" v-if="!spinning && diceResult > 0" @click="diceResult = 0">
          <div class="result-card">
            <span class="result-label">PADLO</span>
            <strong class="result-value">{{ diceResult }}</strong>
            <div class="tap-hint mt-2">Klepnite pre zatvorenie</div>
          </div>
        </div>

        <button class="btn-main mt-3 clickable" @click="rollSingleDice" :disabled="spinning">HODIŤ KOCKOU</button>
      </div>

      <!-- Multi-Dice (3D Dice) -->
      <div v-else-if="tool.id === 'multi-dice'" class="gaming-tool multi-dice-section">
        <div class="dice-grid-3d">
          <div v-for="(d, i) in multiDiceArray" :key="i" class="dice-3d-mini-container">
             <div
               class="dice-3d mini"
               :class="{ transitioning: d.transitioning }"
               :style="{ transform: `rotateX(${d.rotX}deg) rotateY(${d.rotY}deg)` }"
             >
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
             <input type="range" v-model.number="diceCount" min="1" max="5" class="range-gold" />
             <span class="count-badge">{{ diceCount }}</span>
           </div>
           <button class="btn-main full-width mt-1" @click="rollMultiDice" :disabled="spinning">
             HODIŤ VŠETKÝMI{{ multiDiceSum > 0 ? ' — SÚČET: ' + multiDiceSum : '' }}
           </button>
        </div>
      </div>

      <!-- Coin Flip (3D) -->
      <div v-else-if="tool.id === 'coin-flip'" class="gaming-tool coin-section">
        <div class="confetti-cannon" v-if="winner && !spinning">
          <div v-for="p in 30" :key="p" class="particle" :style="getParticleStyle(p)"></div>
        </div>
        <div class="coin-container big" @click="flipCoin">
          <div class="coin" :class="{ flipping: spinning }" :style="{ transform: `rotateY(${rotation}deg)` }">
            <div class="side heads"><span>PANNA</span></div>
            <div class="side tails"><span>OROL</span></div>
          </div>
        </div>
        <div class="result-overlay" v-if="winner && !spinning" @click="winner = ''">
          <div class="result-card">
            <span class="result-label">VÝSLEDOK</span>
            <strong class="result-value">{{ winner }}</strong>
            <div class="tap-hint mt-2">Klepnite pre zatvorenie</div>
          </div>
        </div>
      </div>

      <!-- Truth or Dare -->
      <div v-else-if="tool.id === 'truth-dare'" class="gaming-tool truth-dare-section tool-workspace">
        <div class="result-overlay" v-if="winner" @click="winner = ''">
          <div class="result-card td-result">
            <span class="result-label">{{ tdType }}</span>
            <div class="td-text-wrap">
              <strong class="result-value task-text">{{ winner }}</strong>
            </div>
            <div class="tap-hint">Klepnite pre zatvorenie</div>
          </div>
        </div>

        <div class="td-header">
           <div class="td-icon-wrap">
             <PhChatCircleDots :size="48" weight="duotone" class="gold" />
             <div class="icon-divider"></div>
             <PhSword :size="48" weight="duotone" class="gold" />
           </div>
           <h2>Pravda alebo Odvaha</h2>
           <p>Vyberte si svoju cestu a otestujte svoju úprimnosť alebo odvahu v tejto klasickej spoločenskej hre.</p>
        </div>

        <div class="td-actions">
          <button class="btn-td truth glass-card clickable" @click="pickTD('truth')">
            <div class="btn-icon"><PhChatCircleDots :size="32" weight="duotone" /></div>
            <div class="btn-meta">
              <span class="btn-label">ODHAĽ PRAVDU</span>
              <span class="btn-hint">Úprimnosť nadovšetko</span>
            </div>
          </button>
          
          <button class="btn-td dare glass-card clickable" @click="pickTD('dare')">
            <div class="btn-icon"><PhSword :size="32" weight="duotone" /></div>
            <div class="btn-meta">
              <span class="btn-label">PRIJMI VÝZVU</span>
              <span class="btn-hint">Odvaha nemá hranice</span>
            </div>
          </button>
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
      <!-- Random Picker -->
      <div v-else-if="tool.id === 'random-picker'" class="gaming-tool picker-section">
        <div class="confetti-cannon" v-if="winner && !spinning">
          <div v-for="p in 30" :key="p" class="particle" :style="getParticleStyle(p)"></div>
        </div>
        <div class="picker-box glass">
          <textarea v-model="pickerInput" placeholder="Zadajte možnosti (jedna na riadok)..." class="picker-area"></textarea>
          <button class="btn-spin mt-1 full-width clickable" @click="pickRandom">VYBRAŤ NÁHODNE</button>
        </div>
        <div class="result-overlay" v-if="winner && !spinning" @click="winner = ''">
          <div class="result-card">
            <span class="result-label">VYBRATÉ</span>
            <strong class="result-value">{{ winner }}</strong>
            <div class="tap-hint mt-2">Klepnite pre zatvorenie</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { 
  PhSparkle, PhPlus, PhX, PhChatCircleDots, PhSword,
  PhDiceFive, PhHandHeart, PhCheckCircle, PhArrowLeft, PhShareNetwork
} from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

// ─── General State ────────────────────────────────────────────────────────────
const spinning = ref(false)
const rotation = ref(0)
const options = ref(['Pivo', 'Pizza', 'Kino', 'Výlet', 'Spánok'])
const newOption = ref('')
const winner = ref('')
const pickerInput = ref('')

const pickRandom = () => {
  const list = pickerInput.value.split('\n').filter(l => l.trim())
  if (!list.length) return
  spinning.value = true
  setTimeout(() => {
    winner.value = list[Math.floor(Math.random() * list.length)]
    spinning.value = false
  }, 800)
}

// ─── Wheel Helpers ────────────────────────────────────────────────────────────
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const rad = (angleInDegrees - 90) * Math.PI / 180
  return {
    x: centerX + radius * Math.cos(rad),
    y: centerY + radius * Math.sin(rad)
  }
}

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const s = polarToCartesian(x, y, radius, endAngle)
  const e = polarToCartesian(x, y, radius, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${x} ${y} L ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 0 ${e.x} ${e.y} Z`
}

const sliceMidAngle = (i, count) => (360 / count) * i + (360 / count) / 2

const getParticleStyle = (i) => {
  const colors = ['#D4AF37', '#ffffff', '#AA8A2E', '#F1C40F']
  const color = colors[i % colors.length]
  const left = 20 + Math.random() * 60 + '%'
  const delay = Math.random() * 2 + 's'
  const duration = 1 + Math.random() * 2 + 's'
  return {
    background: color,
    left,
    animationDelay: delay,
    animationDuration: duration
  }
}

const sliceFontSize = (opt, count) => {
  if (count <= 3) return 7
  if (count <= 5) return 5.5
  if (count <= 8) return 4.5
  return 3.5
}

const truncateText = (s, n) => s.length > n ? s.slice(0, n - 1) + '…' : s

const getSliceColor = (i) => {
  const colors = [
    '#E74C3C', // Alizarin Red
    '#3498DB', // Peter River Blue
    '#2ECC71', // Emerald Green
    '#F1C40F', // Sun Flower Yellow
    '#9B59B6', // Amethyst Purple
    '#E67E22', // Carrot Orange
    '#1ABC9C', // Turquoise
    '#D4AF37', // Gold
    '#FF2D55', // Radical Red
    '#34495E'  // Wet Asphalt
  ]
  return colors[i % colors.length]
}

const spinWheel = () => {
  if (spinning.value || options.value.length < 2) return
  spinning.value = true
  winner.value = ''
  const n = options.value.length
  const sliceAngle = 360 / n
  const randomSector = Math.floor(Math.random() * n)
  // Point at top (0°) should land in the middle of the winning sector
  const midOffset = sliceAngle / 2
  const finalRotation = rotation.value + (10 * 360) + (360 - (randomSector * sliceAngle) - midOffset)
  rotation.value = finalRotation
  setTimeout(() => {
    spinning.value = false
    winner.value = options.value[randomSector]
  }, 5000)
}

const addOption = () => {
  if (newOption.value.trim()) {
    options.value.push(newOption.value.trim())
    newOption.value = ''
  }
}

// ─── Dice State ───────────────────────────────────────────────────────────────
// Exact rotations to bring each face to face the viewer
const FACE_ROTATIONS = {
  1: { x: 0,    y: 0   },  // front face (1 dot center)
  2: { x: -90,  y: 0   },  // top face (2 dots)
  3: { x: 0,    y: -90 },  // right face (3 dots diagonal)
  4: { x: 0,    y: 90  },  // left face (4 corner dots)
  5: { x: 90,   y: 0   },  // bottom face (5 dots)
  6: { x: 180,  y: 0   },  // back face (6 dots)
}

const diceTransitioning = ref(false)
const diceRotX = ref(0)
const diceRotY = ref(0)
const diceResult = ref(0)
const diceCount = ref(2)

const rollSingleDice = async () => {
  if (spinning.value) return
  spinning.value = true
  const res = Math.floor(Math.random() * 6) + 1
  diceResult.value = res

  // Step 1: snap back to neutral without animation
  diceTransitioning.value = false
  diceRotX.value = 0
  diceRotY.value = 0

  await nextTick()
  // Small delay to ensure browser applies the reset before transition
  await new Promise(r => setTimeout(r, 30))

  // Step 2: animate to the exact face
  const base = FACE_ROTATIONS[res]
  diceTransitioning.value = true
  diceRotX.value = 1440 + base.x   // 4 full spins + precise landing
  diceRotY.value = 1440 + base.y

  setTimeout(() => { spinning.value = false }, 1300)
}

// Multi-dice
const multiDiceArray = ref(
  Array.from({ length: 2 }, () => ({ val: 1, rotX: 0, rotY: 0, transitioning: false }))
)
const multiDiceSum = computed(() => multiDiceArray.value.reduce((a, b) => a + b.val, 0))

const rollMultiDice = async () => {
  if (spinning.value) return
  spinning.value = true

  const newVals = multiDiceArray.value.map(() => Math.floor(Math.random() * 6) + 1)

  // Step 1: reset all without transition
  multiDiceArray.value = multiDiceArray.value.map((d, idx) => ({
    val: newVals[idx],
    rotX: 0,
    rotY: 0,
    transitioning: false
  }))

  await nextTick()
  await new Promise(r => setTimeout(r, 30))

  // Step 2: animate each die to its face with slightly staggered spins for variety
  multiDiceArray.value = multiDiceArray.value.map(d => {
    const base = FACE_ROTATIONS[d.val]
    const spins = 1080 + Math.floor(Math.random() * 360) // 3+ full rotations, random variety
    return { ...d, rotX: spins + base.x, rotY: spins + base.y, transitioning: true }
  })

  setTimeout(() => { spinning.value = false }, 1300)
}

// Rebuild array when dice count changes
watch(diceCount, (newVal) => {
  multiDiceArray.value = Array.from({ length: newVal }, () => ({
    val: 1, rotX: 0, rotY: 0, transitioning: false
  }))
})

// ─── Other games ─────────────────────────────────────────────────────────────
const flipCoin = () => {
  if (spinning.value) return
  spinning.value = true
  winner.value = ''
  const isHeads = Math.random() > 0.5
  rotation.value += 1800 + (isHeads ? 0 : 180)
  setTimeout(() => { spinning.value = false; winner.value = isHeads ? 'PANNA' : 'OROL' }, 2000)
}

const tdType = ref('truth')
const truths = [
  "Aká je tvoja najtrápnejšia spomienka z detstva?",
  "Kedy si naposledy klamal a čo to bolo?",
  "Kto z prítomných sa ti najviac páči?",
  "Ktorú vlastnosť na sebe najviac nenávidíš?",
  "Máš nejaký tajný talent, o ktorom nikto nevie?",
  "Čo je najdivnejšia vec, ktorú si kedy urobil na verejnosti?",
  "Keby si mohol byť niekým iným na jeden deň, kto by to bol?",
  "Čo je tvoj najväčší strach, o ktorom si nikomu nepovedal?",
  "Kedy si naposledy plakal a prečo?",
  "Akú najhoršiu správu si kedy omylom poslal niekomu inému?"
]
const dares = [
  "Urob 15 klikov práve teraz.",
  "Zaspievaj refrén svojej obľúbenej piesne na plné hrdlo.",
  "Zavolaj niekomu z kontaktov a povedz mu vtip bez vysvetlenia.",
  "Napodobňuj niekoho z prítomných, až kým sa neuhádne, o koho ide.",
  "Zatancuj víťazný tanec bez hudby po dobu 30 sekúnd.",
  "Daj si lyžičku horčice, kečupu alebo niečoho podobného.",
  "Rozprávaj s cudzím prízvukom až do konca ďalšieho kola.",
  "Vymeň si tričko s niekým z prítomných (ak je to možné).",
  "Urob stojku na rukách alebo mostík.",
  "Pošli srdiečko prvej osobe, ktorú vidíš na sociálnych sieťach."
]
const pickTD = (type) => {
  tdType.value = type === 'truth' ? 'Pravda' : 'Odvaha'
  const list = type === 'truth' ? truths : dares
  winner.value = list[Math.floor(Math.random() * list.length)]
}

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
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const suits = ['❤️', '💎', '🍀', '♠️']
  setTimeout(() => {
    card.value = { rank: ranks[Math.floor(Math.random() * ranks.length)], suit: suits[Math.floor(Math.random() * suits.length)] }
    spinning.value = false
  }, 800)
}

onMounted(() => {
  if (props.tool.id === 'multi-dice') rollMultiDice()
})
</script>

<style scoped>
.gaming-engine {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gaming-tool {
  width: 100%;
  min-height: 100%;
  background: rgba(255,255,255,0.015);
  border: 1px solid var(--border-soft);
  border-radius: 40px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.result-overlay {
  position: absolute;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  animation: overlayFade 0.2s ease-out forwards;
  cursor: pointer;
  padding: 2rem;
}

@keyframes overlayFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.result-card {
  background: #000;
  border: 4px solid var(--accent-gold);
  border-radius: 40px;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  box-shadow: 
    0 50px 100px rgba(0,0,0,1),
    0 0 40px rgba(212, 175, 55, 0.4);
  animation: cardPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.25) forwards;
  text-align: center;
  min-width: 360px;
  min-height: 280px; /* Force stable height */
}

@keyframes cardPop {
  0% { transform: scale(0.85); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.result-label {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: rgba(255,255,255,0.5);
  font-weight: 500;
}

.result-value.task-text {
  font-size: 1.8rem;
  font-weight: 700;
  max-width: 500px;
}

.tap-hint {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255,255,255,0.3);
  margin-top: 1rem;
}

/* ── Wheel ─────────────────────────────────────────────────────────────────── */
.wheel-section { display: flex; flex-direction: column; align-items: center; gap: 2rem; }
.wheel-main { position: relative; width: 360px; height: 360px; }
.wheel-outer {
  width: 100%; height: 100%; border-radius: 50%;
  border: 12px solid #111;
  box-shadow: 
    0 0 0 4px rgba(212, 175, 55, 0.3),
    0 20px 50px rgba(0,0,0,0.8),
    inset 0 0 20px rgba(0,0,0,0.5);
  overflow: hidden;
  background: #111;
  position: relative;
  z-index: 2;
}
.wheel-decoration {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 1;
}
.deco-dot {
  position: absolute;
  top: 50%; left: 50%;
  width: 8px; height: 8px;
  background: var(--accent-gold);
  border-radius: 50%;
  margin-left: -4px; margin-top: -4px;
  box-shadow: 0 0 10px var(--accent-gold);
  opacity: 0.8;
}
.wheel-svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 0 2px rgba(0,0,0,0.5)); }
.slice-text {
  fill: #fff;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  pointer-events: none;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.8));
  stroke: rgba(0,0,0,0.2);
  stroke-width: 0.4px;
}

.pointer-wrapper {
  position: absolute; top: -30px; left: 50%;
  transform: translateX(-50%); z-index: 20;
  display: flex; flex-direction: column; align-items: center;
}
.pointer-needle { 
  width: 32px; height: 50px; 
  background: var(--accent-gold); 
  clip-path: polygon(50% 100%, 15% 0, 85% 0);
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
  position: relative;
  z-index: 22;
  transform-origin: 50% 0%;
}
.needle-clicking {
  animation: needleWobble 0.2s infinite ease-in-out;
}
@keyframes needleWobble {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(-20deg); }
  100% { transform: rotate(0deg); }
}

/* Confetti */
.confetti-cannon {
  position: absolute; width: 100%; height: 100%; top: 0; left: 0;
  pointer-events: none; z-index: 50; overflow: hidden;
}
.particle {
  position: absolute; width: 8px; height: 8px; top: -10px;
  border-radius: 2px;
  animation: fall linear forwards;
}
@keyframes fall {
  0% { transform: translateY(0) rotate(0); opacity: 1; }
  100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
}

.pointer-base {
  width: 14px; height: 14px;
  background: #333;
  border: 2px solid var(--accent-gold);
  border-radius: 50%;
  margin-top: -45px;
  z-index: 21;
}

.winner-announcement {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.5rem 4rem; font-size: 1.8rem; color: var(--text-primary);
  background: rgba(var(--accent-gold-rgb), 0.1);
  border: 1px solid var(--accent-gold); 
  border-radius: var(--radius-full);
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 40px rgba(0,0,0,0.4);
  animation: winnerScale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.winner-announcement strong { color: var(--accent-gold); font-size: 2.2rem; text-shadow: 0 0 15px var(--accent-gold-dim); }
.wheel-controls { width: 100%; max-width: 500px; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
.input-row { display: flex; gap: 0.5rem; }
.btn-add { background: var(--accent-gold); color: var(--bg-deep); border: none; padding: 0 1rem; border-radius: 8px; cursor: pointer; }
.options-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.opt-tag { padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); }

/* ── 3D Dice ───────────────────────────────────────────────────────────────── */
.dice-section { padding: 0; }
.dice-3d-container { perspective: 800px; width: 120px; height: 120px; cursor: pointer; position: relative; }
.dice-3d-container.big { width: 180px; height: 180px; perspective: 1000px; }
.dice-3d-container.big .face { padding: 20px; border-radius: 20px; border-width: 3px; }
.dice-3d-container.big .face span { width: 30px; height: 30px; }

/* Large dice face transforms */
.dice-3d-container.big .front  { transform: translateZ(90px); }
.dice-3d-container.big .back   { transform: rotateY(180deg) translateZ(90px); }
.dice-3d-container.big .right  { transform: rotateY(90deg) translateZ(90px); }
.dice-3d-container.big .left   { transform: rotateX(90deg) translateZ(90px); } /* Fixed mapping for 'big' */
.dice-3d-container.big .top    { transform: rotateX(90deg) translateZ(90px); }
.dice-3d-container.big .bottom { transform: rotateX(-90deg) translateZ(90px); }

/* No default transition — transition only applied via .transitioning class */
.dice-3d {
  width: 100%; height: 100%;
  position: relative; transform-style: preserve-3d;
}
.dice-3d.transitioning {
  transition: transform 1.3s cubic-bezier(0.2, 0, 0.1, 1);
}

.face {
  position: absolute; width: 100%; height: 100%;
  background: #f8f8f8;
  border: 2px solid #ccc;
  border-radius: 14px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  padding: 12px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.3);
  backface-visibility: hidden;
}
.face span {
  width: 18px; height: 18px;
  background: #111; border-radius: 50%;
  justify-self: center; align-self: center;
  box-shadow: inset 0 2px 4px rgba(255,255,255,0.15);
}

/* Dot positions */
.front span { grid-area: 2/2; }
.back span:nth-child(1) { grid-area: 1/1; } .back span:nth-child(2) { grid-area: 1/3; }
.back span:nth-child(3) { grid-area: 2/1; } .back span:nth-child(4) { grid-area: 2/3; }
.back span:nth-child(5) { grid-area: 3/1; } .back span:nth-child(6) { grid-area: 3/3; }
.right span:nth-child(1) { grid-area: 1/1; } .right span:nth-child(2) { grid-area: 2/2; } .right span:nth-child(3) { grid-area: 3/3; }
.left span:nth-child(1) { grid-area: 1/1; } .left span:nth-child(2) { grid-area: 1/3; }
.left span:nth-child(3) { grid-area: 3/1; } .left span:nth-child(4) { grid-area: 3/3; }
.top span:nth-child(1) { grid-area: 1/1; } .top span:nth-child(2) { grid-area: 3/3; }
.bottom span:nth-child(1) { grid-area: 1/1; } .bottom span:nth-child(2) { grid-area: 1/3; }
.bottom span:nth-child(3) { grid-area: 2/2; } .bottom span:nth-child(4) { grid-area: 3/1; } .bottom span:nth-child(5) { grid-area: 3/3; }

/* Large dice face transforms */
.dice-3d-container.big .front  { transform: translateZ(90px); }
.dice-3d-container.big .back   { transform: rotateY(180deg) translateZ(90px); }
.dice-3d-container.big .right  { transform: rotateY(90deg) translateZ(90px); }
.dice-3d-container.big .left   { transform: rotateY(-90deg) translateZ(90px); }
.dice-3d-container.big .top    { transform: rotateX(90deg) translateZ(90px); }
.dice-3d-container.big .bottom { transform: rotateX(-90deg) translateZ(90px); }

.dice-3d-container .front  { transform: translateZ(60px); }
.dice-3d-container .back   { transform: rotateY(180deg) translateZ(60px); }
.dice-3d-container .right  { transform: rotateY(90deg) translateZ(60px); }
.dice-3d-container .left   { transform: rotateY(-90deg) translateZ(60px); }
.dice-3d-container .top    { transform: rotateX(90deg) translateZ(60px); }
.dice-3d-container .bottom { transform: rotateX(-90deg) translateZ(60px); }

/* Result label under large dice */
.dice-result-label {
  font-size: 4rem; font-weight: 900;
  color: var(--accent-gold);
  line-height: 1;
  letter-spacing: -2px;
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* ── Mini Dice ─────────────────────────────────────────────────────────────── */
.multi-dice-section { width: 100%; }
.dice-grid-3d { display: flex; flex-wrap: wrap; justify-content: center; gap: 3rem; padding: 1rem 0; width: 100%; }
.dice-3d-mini-container { perspective: 500px; width: 64px; height: 64px; }
.dice-3d.mini { width: 100%; height: 100%; }
.dice-3d.mini .face { border-radius: 8px; padding: 7px; border-width: 1.5px; }
.dice-3d.mini .face span { width: 10px; height: 10px; }

/* Mini face transforms */
.dice-3d.mini .front  { transform: translateZ(32px); }
.dice-3d.mini .back   { transform: rotateY(180deg) translateZ(32px); }
.dice-3d.mini .right  { transform: rotateY(90deg) translateZ(32px); }
.dice-3d.mini .left   { transform: rotateY(-90deg) translateZ(32px); }
.dice-3d.mini .top    { transform: rotateX(90deg) translateZ(32px); }
.dice-3d.mini .bottom { transform: rotateX(-90deg) translateZ(32px); }

/* ── Coin Flip ─────────────────────────────────────────────────────────────── */
.coin-section { padding: 0; }
.coin-container { perspective: 1000px; width: 140px; height: 140px; cursor: pointer; position: relative; }
.coin-container.big { width: 220px; height: 220px; }
.coin-container.big .side { border-width: 10px; font-size: 2rem; }
.coin {
  width: 100%; height: 100%; position: relative; transform-style: preserve-3d;
  transition: transform 2s cubic-bezier(0.15, 0, 0.15, 1);
}
.coin.flipping { animation: coinSpin 0.2s infinite linear; }
.side {
  position: absolute; width: 100%; height: 100%; border-radius: 50%; backface-visibility: hidden;
  display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.2rem;
  border: 4px solid var(--accent-gold); background: var(--bg-deep); color: var(--accent-gold);
  box-shadow: 0 0 30px var(--accent-gold-dim);
}
.tails { transform: rotateY(180deg); background: var(--accent-gold); color: var(--bg-deep); }

/* ── Truth or Dare ─────────────────────────────────────────────────────────── */
.truth-dare-section {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3rem !important;
}

.td-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem; }
.td-icon-wrap { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 0.5rem; }
.icon-divider { width: 1px; height: 30px; background: var(--border-soft); }
.td-header h2 { font-size: 2.5rem; font-weight: 900; letter-spacing: -1px; margin: 0; }
.td-header p { font-size: 0.95rem; color: var(--text-muted); max-width: 500px; line-height: 1.6; }

.td-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; width: 100%; max-width: 800px; }
.btn-td {
  display: flex; align-items: center; gap: 1.5rem; padding: 2.2rem 2rem;
  border-radius: 24px; position: relative; overflow: hidden; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-align: left; background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-soft);
  color: white;
  cursor: pointer;
}
.btn-td:hover { transform: translateY(-8px); background: rgba(255,255,255,0.05); border-color: var(--accent-gold); }

.btn-icon {
  width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;
  background: var(--bg-soft); border-radius: 16px; border: 1px solid var(--border-soft);
  color: var(--accent-gold); transition: all 0.3s;
}
.btn-td:hover .btn-icon { background: var(--accent-gold); color: var(--bg-deep); border-color: var(--accent-gold); }

.btn-meta { display: flex; flex-direction: column; gap: 0.2rem; }
.btn-label { font-size: 1.1rem; font-weight: 900; letter-spacing: 1px; }
.btn-hint { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }

/* Result Card Expansion */
.td-result {
  max-width: 640px; width: 90%; min-height: 340px; padding: 3rem !important;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.td-text-wrap {
  flex: 1; display: flex; align-items: center; justify-content: center; width: 100%;
  margin: 1.5rem 0;
}
.task-text {
  font-size: clamp(1.2rem, 4vw, 2.2rem) !important; line-height: 1.35;
  color: var(--text-primary); font-weight: 800; font-family: 'Syne', sans-serif;
  text-align: center;
}

/* ── Global Utilities ──────────────────────────────────────────────────────── */
.btn-spin {
  background: var(--accent-gold); color: var(--bg-deep); border: none;
  padding: 1.2rem; border-radius: 12px; font-weight: 950; font-size: 1.2rem;
  text-transform: uppercase; letter-spacing: 1px; cursor: pointer;
}
.glass-input {
  flex: 1; background: rgba(255,255,255,0.05); border: 1px solid var(--border-dim);
  padding: 1rem; border-radius: 8px; color: white; outline: none;
}
.btn-main {
  background: var(--accent-gold); color: var(--bg-deep); border: none;
  padding: 1rem 2rem; border-radius: 12px; font-weight: 800; cursor: pointer;
}
.full-width { width: 100%; }
.gold { color: var(--accent-gold); }
.mt-1 { margin-top: 1rem; }
.mt-2 { margin-top: 2rem; }
.mt-3 { margin-top: 3rem; }
.text-center { text-align: center; }

/* Scores */
.scores-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.player-card { padding: 1.5rem; text-align: center; }
.p-score { font-size: 2.5rem; font-weight: 900; color: var(--accent-gold); }
.p-actions { display: flex; justify-content: center; gap: 0.5rem; margin-top: 0.5rem; }
.score-btn { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border-dim); background: var(--bg-soft); color: white; cursor: pointer; }
.btn-sub { background: var(--bg-soft); color: white; border: 1px solid var(--border-dim); padding: 1rem; border-radius: 8px; width: 100%; cursor: pointer; }

/* RPS */
.rps-choices { display: flex; gap: 1rem; justify-content: center; }
.rps-btn { width: 70px; height: 70px; font-size: 2rem; border-radius: 50%; border: 1px solid var(--border-dim); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.rps-battle { padding: 2rem; display: flex; align-items: center; gap: 2rem; justify-content: center; }
.battle-vs { font-weight: 900; color: var(--accent-gold); font-size: 1.5rem; }
.battle-winner { font-size: 1.5rem; font-weight: 900; text-align: center; }

/* Card */
.card-display { width: 140px; height: 200px; border: 4px solid var(--accent-gold); border-radius: 15px; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; cursor: pointer; }

/* Bottle */
.bottle-section { display: flex; flex-direction: column; align-items: center; }
.bottle-container { position: relative; width: 300px; height: 300px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.bottle { transition: transform 3s cubic-bezier(0.1, 0.7, 0.1, 1); filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5)); }

/* Dice controls panel */
.dice-controls-panel { padding: 1.5rem; }
.count-selector { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.range-gold { flex: 1; accent-color: var(--accent-gold); }
.count-badge { font-weight: 900; background: var(--accent-gold); color: var(--bg-deep); padding: 0.2rem 0.6rem; border-radius: 4px; }

/* Picker Specific */
.picker-area { width: 100%; min-height: 180px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-dim); border-radius: 12px; padding: 1.5rem; color: white; outline: none; resize: none; font-size: 1.1rem; }
.picker-area:focus { border-color: var(--accent-gold); }

/* Animations */
@keyframes winnerScale {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes coinSpin {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}
@keyframes popIn {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
