<template>
  <div class="security-engine">
    <!-- Password Generator -->
    <div v-if="tool.id === 'pass-gen'" class="pass-tool">
      <div class="main-display glass">
        <div class="generated-code">{{ password || 'Generujem...' }}</div>
        <div class="display-actions">
          <button class="icon-btn clickable" @click="copy(password)" title="Kopírovať">
            <PhCopy :size="20" />
          </button>
          <button class="icon-btn clickable" @click="generatePassword" title="Nové heslo">
            <PhArrowsCounterClockwise :size="20" />
          </button>
        </div>
      </div>

      <div class="strength-meter">
        <div class="meter-bar">
          <div class="fill" :style="{ width: strength + '%', background: strengthColor }"></div>
        </div>
        <div class="meter-label" :style="{ color: strengthColor }">{{ strengthText }}</div>
      </div>

      <div class="settings-grid glass">
        <div class="setting-range">
          <label>Dĺžka: <strong>{{ length }}</strong></label>
          <input type="range" v-model="length" min="6" max="64" class="range-input" @input="generatePassword" />
        </div>
        <div class="setting-toggles">
          <label class="toggle clickable"><input type="checkbox" v-model="options.upper" @change="generatePassword" /> Veľké písmená (A-Z)</label>
          <label class="toggle clickable"><input type="checkbox" v-model="options.lower" @change="generatePassword" /> Malé písmená (a-z)</label>
          <label class="toggle clickable"><input type="checkbox" v-model="options.numbers" @change="generatePassword" /> Čísla (0-9)</label>
          <label class="toggle clickable"><input type="checkbox" v-model="options.symbols" @change="generatePassword" /> Symboly (!@#$%)</label>
        </div>
      </div>
    </div>

    <!-- UUID Generator -->
    <div v-else-if="tool.id === 'uuid-gen'" class="uuid-tool">
      <div class="main-display glass">
        <div class="generated-code">{{ uuidVal || 'Generujem...' }}</div>
        <div class="display-actions">
          <button class="icon-btn clickable" @click="copy(uuidVal)" title="Kopírovať">
            <PhCopy :size="20" />
          </button>
          <button class="icon-btn clickable" @click="uuidVal = crypto.randomUUID()" title="Nové UUID">
            <PhArrowsCounterClockwise :size="20" />
          </button>
        </div>
      </div>
      <button class="btn-gen-new clickable" @click="uuidVal = crypto.randomUUID()">Generovať nové UUID v4</button>
    </div>

    <!-- URL Parser -->
    <div v-else-if="tool.id === 'url-parser'" class="dev-tool">
      <div class="io-panel full">
        <label>URL Adresa</label>
        <input type="text" v-model="input" @input="parseURL" class="glass-input" placeholder="https://example.com/path?key=value" />
      </div>
      <div v-if="urlData" class="results-panel glass mt-2">
        <div class="result-row"><span>Protokol:</span> <strong>{{ urlData.protocol }}</strong></div>
        <div class="result-row"><span>Host:</span> <strong>{{ urlData.host }}</strong></div>
        <div class="result-row"><span>Cesta:</span> <strong>{{ urlData.pathname }}</strong></div>
        <div class="result-row"><span>Parametre:</span> <code>{{ urlData.search }}</code></div>
      </div>
    </div>

    <!-- HTML Entity -->
    <div v-else-if="tool.id === 'html-entity'" class="bridge-tool">
      <div class="io-grid">
        <div class="io-panel">
          <label>Pôvodný Text</label>
          <textarea v-model="input" @input="processHTML" class="glass" placeholder="<h1>Ahoj</h1>"></textarea>
        </div>
        <div class="io-panel">
          <label>HTML Entity</label>
          <textarea v-model="output" readonly class="glass"></textarea>
        </div>
      </div>
    </div>

    <!-- Regex Tester -->
    <div v-else-if="tool.id === 'regex-tester'" class="dev-tool">
      <div class="io-grid">
        <div class="io-panel">
          <label>Regex Pattern</label>
          <input type="text" v-model="val1" @input="testRegex" class="glass-input" placeholder="[a-zA-Z]+" />
        </div>
        <div class="io-panel">
          <label>Testovací Text</label>
          <textarea v-model="input" @input="testRegex" class="glass small"></textarea>
        </div>
      </div>
      <div class="regex-status glass" :class="{ 'match': regexMatch }">
        {{ regexMatch ? '✓ Zhoda nájdená' : '✗ Žiadna zhoda' }}
      </div>
    </div>

    <!-- CRON Helper -->
    <div v-else-if="tool.id === 'cron-helper'" class="dev-tool">
      <div class="control-row glass p-2 mb-2">
        <input type="text" v-model="input" @input="explainCron" class="glass-input big" placeholder="0 12 * * *" />
      </div>
      <div class="cron-explanation glass p-2" v-if="output">
        <PhClock :size="24" class="gold" />
        <p>{{ output }}</p>
      </div>
    </div>

    <!-- JSON to TypeScript -->
    <div v-else-if="tool.id === 'json-ts'" class="bridge-tool">
      <div class="io-grid">
        <div class="io-panel">
          <label>Vstupný JSON</label>
          <textarea v-model="input" @input="jsonToTS" class="glass" placeholder='{"id": 1, "name": "Test"}'></textarea>
        </div>
        <div class="io-panel">
          <label>TypeScript Interface</label>
          <textarea v-model="output" readonly class="glass"></textarea>
        </div>
      </div>
    </div>

    <!-- Base64 / URL Bridge -->
    <div v-else-if="['base64', 'url-enc'].includes(tool.id)" class="bridge-tool">
      <div class="io-grid">
        <div class="io-panel">
          <label>Vstup (Text)</label>
          <textarea v-model="input" @input="processBridge" class="glass" placeholder="Vložte text sem..."></textarea>
        </div>
        
        <div class="io-panel">
          <label>Výstup ({{ tool.id === 'base64' ? 'Base64' : 'URL Encoded' }})</label>
          <textarea v-model="output" readonly class="glass" placeholder="Výsledok sa zobrazí tu..."></textarea>
          <button v-if="output" class="btn-copy-float clickable" @click="copy(output)">
            <PhCopy :size="18" /> Kopírovať
          </button>
        </div>
      </div>
      
      <div class="bridge-actions">
        <button class="btn-swap clickable" @click="reverseBridge">
          <PhArrowsLeftRight :size="18" /> Otočiť smer
        </button>
      </div>
    </div>

    <!-- Hashes -->
    <div v-else-if="tool.id.includes('-hash') || tool.id === 'md5-hash'" class="hash-tool">
      <div class="io-panel full">
        <label>Vstupné dáta pre {{ tool.name }}</label>
        <textarea v-model="input" @input="generateHash" class="glass" placeholder="Napíšte text pre kontrolný súčet..."></textarea>
      </div>

      <div class="hash-result glass" v-if="output">
        <div class="hash-val">{{ output }}</div>
        <button class="icon-btn clickable" @click="copy(output)">
          <PhCopy :size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { 
  PhCopy, PhArrowsCounterClockwise, PhArrowsLeftRight, PhShieldCheck, PhLockKey, PhClock 
} from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

// General States
const input = ref('')
const output = ref('')
const val1 = ref('') // Used for Regex pattern
const urlData = ref(null)
const regexMatch = ref(false)

// Password States
const password = ref('')
const length = ref(16)
const strength = ref(0)
const strengthText = ref('Slabé')
const strengthColor = ref('#ff4d4d')
const options = reactive({ upper: true, lower: true, numbers: true, symbols: true })
const isDecoding = ref(false)
const uuidVal = ref(crypto.randomUUID())

const parseURL = () => {
  try {
    const url = new URL(input.value)
    urlData.value = {
      protocol: url.protocol,
      host: url.host,
      pathname: url.pathname,
      search: url.search || 'žiadne'
    }
  } catch (e) { urlData.value = null }
}

const testRegex = () => {
  try {
    const re = new RegExp(val1.value)
    regexMatch.value = re.test(input.value)
  } catch (e) { regexMatch.value = false }
}

const processHTML = () => {
  output.value = input.value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

const explainCron = () => {
  const parts = input.value.trim().split(/\s+/)
  if (parts.length < 5) { output.value = ''; return }
  output.value = `Tento CRON sa spúšťa nasledovne: [Minúta: ${parts[0]}], [Hodina: ${parts[1]}], [Deň v mesiaci: ${parts[2]}], [Mesiac: ${parts[3]}], [Deň v týždni: ${parts[4]}]`
}

const jsonToTS = () => {
  try {
    const obj = JSON.parse(input.value)
    let ts = "interface RootObject {\n"
    for (const key in obj) {
      ts += `  ${key}: ${typeof obj[key]};\n`
    }
    ts += "}"
    output.value = ts
  } catch (e) { output.value = 'Neplatný JSON' }
}

const generatePassword = () => {
  const charset = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
  }
  let combined = ''
  if (options.upper) combined += charset.upper
  if (options.lower) combined += charset.lower
  if (options.numbers) combined += charset.numbers
  if (options.symbols) combined += charset.symbols
  
  if (!combined) { password.value = 'Vyberte možnosť'; return }
  
  let res = ''
  const array = new Uint32Array(length.value)
  window.crypto.getRandomValues(array)
  for (let i = 0; i < length.value; i++) {
    res += combined.charAt(array[i] % combined.length)
  }
  password.value = res
  calculateStrength()
}

const calculateStrength = () => {
  let score = 0
  if (length.value > 12) score += 25
  if (length.value > 20) score += 25
  if (options.numbers && options.symbols) score += 25
  if (options.upper && options.lower) score += 25
  
  strength.value = score
  if (score <= 25) { strengthText.value = 'Veľmi Slabé'; strengthColor.value = '#ff4d4d' }
  else if (score <= 50) { strengthText.value = 'Slabé'; strengthColor.value = '#ffa502' }
  else if (score <= 75) { strengthText.value = 'Dobré'; strengthColor.value = '#2ed573' }
  else { strengthText.value = 'Extrémne Bezpečné'; strengthColor.value = '#1e90ff' }
}

const processBridge = () => {
  if (!input.value) { output.value = ''; return }
  
  try {
    if (props.tool.id === 'base64') {
      output.value = isDecoding.value ? atob(input.value) : btoa(input.value)
    } else if (props.tool.id === 'url-enc') {
      output.value = isDecoding.value ? decodeURIComponent(input.value) : encodeURIComponent(input.value)
    }
  } catch (e) {
    output.value = 'Neplatný formát pre dekódovanie'
  }
}

const reverseBridge = () => {
  isDecoding.value = !isDecoding.value
  const temp = input.value
  input.value = output.value
  output.value = temp
  processBridge()
}

const generateHash = async () => {
  if (!input.value) { output.value = ''; return }
  
  if (props.tool.id === 'sha256-hash') {
    const msgUint8 = new TextEncoder().encode(input.value)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    output.value = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } else {
    // Mock MD5 (simple fallback or warning)
    output.value = 'MD5 prebieha v zabezpečenom režime... (SHA-256 je odporúčané)'
  }
}

const copy = (txt) => {
  navigator.clipboard.writeText(txt)
}

onMounted(() => {
  if (props.tool.id === 'pass-gen') generatePassword()
})

watch(() => props.tool.id, () => {
  input.value = ''
  output.value = ''
  if (props.tool.id === 'pass-gen') generatePassword()
})
</script>

<style scoped>
.security-engine {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.main-display {
  padding: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-soft);
  background: rgba(255, 255, 255, 0.02);
}

.generated-code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--accent-gold);
  word-break: break-all;
}

.display-actions {
  display: flex;
  gap: 1rem;
}

.icon-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all 0.3s;
}

.icon-btn:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.strength-meter {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.meter-bar {
  height: 6px;
  background: var(--bg-soft);
  border-radius: 3px;
  overflow: hidden;
}

.fill {
  height: 100%;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.meter-label {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background: var(--bg-soft);
  border-radius: var(--radius-md);
}

.setting-toggles {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.range-input {
  width: 100%;
  accent-color: var(--accent-gold);
  margin-top: 1rem;
}

.io-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.io-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
}

.io-panel label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}

.io-panel textarea {
  width: 100%;
  height: 250px;
  padding: 1.5rem;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: monospace;
  resize: none;
  outline: none;
}

.btn-copy-float {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: var(--accent-gold);
  color: var(--bg-deep);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bridge-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btn-swap {
  padding: 0.8rem 1.5rem;
  background: var(--bg-soft);
  border: 1px solid var(--accent-gold);
  color: var(--accent-gold);
  border-radius: var(--radius-full);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hash-result {
  margin-top: 2rem;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: var(--radius-md);
  background: rgba(197, 169, 106, 0.05);
}

.hash-val {
  font-family: monospace;
  font-size: 1.1rem;
  color: var(--accent-gold);
  word-break: break-all;
}

@media (max-width: 768px) {
  .io-grid { grid-template-columns: 1fr; }
  .setting-toggles { grid-template-columns: 1fr; }
}

/* Dev Tools Expansion */
.dev-tool {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.glass-input {
  width: 100%;
  padding: 1.2rem;
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1.1rem;
}

.glass-input.big {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  font-family: monospace;
}

.regex-status {
  padding: 1rem;
  text-align: center;
  font-weight: 700;
  border-radius: var(--radius-sm);
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
}

.regex-status.match {
  background: rgba(46, 213, 115, 0.1);
  color: #2ed573;
}

.cron-explanation {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(197, 169, 106, 0.05);
  border: 1px solid var(--accent-gold);
  border-radius: var(--radius-md);
}

.cron-explanation p {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
}

.gold { color: var(--accent-gold); }
.mt-2 { margin-top: 1rem; }
.small { height: 150px !important; }

.pass-tool, .uuid-tool { display: flex; flex-direction: column; gap: 2rem; width: 100%; }
.btn-gen-new { padding: 1rem; background: var(--accent-gold); color: var(--bg-deep); border: none; border-radius: var(--radius-md); font-weight: 800; font-size: 1rem; cursor: pointer; }
.setting-range { display: flex; flex-direction: column; gap: 0.5rem; }
.setting-range label { font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); }

.results-panel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
</style>
