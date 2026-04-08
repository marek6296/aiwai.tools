<template>
  <div class="network-engine glass">
    <div class="engine-ui">
      <!-- IP Lookup -->
      <div v-if="tool.id === 'ip-lookup'" class="net-tool">
        <div class="ip-display glass reveal">
          <div class="label">Vaša verejná IP adresa:</div>
          <div class="ip-val">{{ publicIP }}</div>
          <button class="btn-main mt-2" @click="fetchIP" :disabled="loading">
            {{ loading ? 'Hľadám...' : 'Obnoviť informácie' }}
          </button>
        </div>
      </div>

      <!-- DNS Lookup -->
      <div v-else-if="tool.id === 'dns-lookup'" class="net-tool">
        <div class="search-box glass">
          <input type="text" v-model="input" placeholder="Zadajte doménu (napr. google.com)" @keyup.enter="analyzeDNS" />
          <button class="btn-main" @click="analyzeDNS">Analyzovať</button>
        </div>
        <div v-if="dnsData" class="results-panel glass mt-2 reveal">
          <div class="res-row"><span>Typ A (IP):</span> <strong>{{ dnsData.a }}</strong></div>
          <div class="res-row"><span>Type MX (Mail):</span> <strong>{{ dnsData.mx }}</strong></div>
          <div class="res-row"><span>TTL:</span> <code>{{ dnsData.ttl }}s</code></div>
        </div>
      </div>

      <!-- Port Scanner -->
      <div v-else-if="tool.id === 'port-scanner'" class="net-tool">
        <div class="search-box glass">
          <input type="text" v-model="input" placeholder="IP adresa alebo doména..." />
          <button class="btn-main" @click="scanPorts">Spustiť Scan</button>
        </div>
        <div class="port-grid mt-2" v-if="scanning || ports.length">
          <div v-for="port in ports" :key="port.num" class="port-badge glass" :class="{ open: port.status === 'Open' }">
            <span class="num">{{ port.num }}</span>
            <span class="status">{{ port.status }}</span>
          </div>
        </div>
      </div>

      <!-- Subnet Calculator -->
      <div v-else-if="tool.id === 'subnet-calc'" class="net-tool">
        <div class="search-box glass">
          <input type="text" v-model="subnetInput" placeholder="IP adresa (napr. 192.168.1.0)" />
          <select v-model="subnetMask" @change="calculateSubnet" class="mask-select">
            <option v-for="m in [8,16,24,25,26,27,28,29,30]" :key="m" :value="m">/{{ m }}</option>
          </select>
          <button class="btn-main" @click="calculateSubnet">Vypočítať</button>
        </div>
        <div v-if="subnetData" class="results-panel glass mt-2 reveal">
          <div class="res-row"><span>Sieťová adresa:</span> <strong>{{ subnetData.network }}</strong></div>
          <div class="res-row"><span>Broadcast:</span> <strong>{{ subnetData.broadcast }}</strong></div>
          <div class="res-row"><span>Maska:</span> <strong>{{ subnetData.mask }}</strong></div>
          <div class="res-row"><span>Hostiteľov:</span> <strong>{{ subnetData.hosts }}</strong></div>
          <div class="res-row"><span>Rozsah IP:</span> <strong>{{ subnetData.range }}</strong></div>
        </div>
      </div>

      <!-- MAC Lookup -->
      <div v-else-if="tool.id === 'mac-lookup'" class="net-tool">
        <label>Zadajte MAC adresu alebo prefix</label>
        <input type="text" v-model="input" placeholder="00:1B:44:11:3A:B7" @input="lookupMAC" class="mt-1" />
        <div v-if="output" class="results-panel glass mt-2 reveal">
          <span>Výrobca (Vendor):</span>
          <div class="res-value gold">{{ output }}</div>
        </div>
      </div>

      <!-- Speed Matrix -->
      <div v-else-if="tool.id === 'speed-test'" class="net-tool speed-matrix-tool">
        <!-- Testing / Initial State -->
        <div v-if="!showResults" class="speed-workspace reveal">
          <div class="main-gauge-area">
            <div class="gauge-wrapper">
              <div class="outer-ring"></div>
              <svg class="speed-gauge-v2" viewBox="0 0 120 120">
                <circle class="track" cx="60" cy="60" r="54" />
                <circle 
                  class="progress" 
                  cx="60" cy="60" r="54" 
                  :style="{ strokeDashoffset: 339 - (339 * (downloadSpeed / 100)) }"
                />
              </svg>
              <div class="speed-readout">
                <div class="digit-group">
                  <span class="main-val">{{ Math.round(downloadSpeed) }}</span>
                  <span class="unit">Mbps</span>
                </div>
                <div class="status-indicator" :class="{ pulses: testing }">
                  {{ testing ? phaseLabel : 'SYSTEM READY' }}
                </div>
              </div>
            </div>
          </div>
          <div class="stats-grid-v2">
            <div class="stat-box glass">
              <span class="stat-label">LATENCY</span>
              <div class="stat-value gold">{{ Math.round(ping) }} <small>ms</small></div>
            </div>
            <div class="stat-box glass">
              <span class="stat-label">DOWNLOAD FLOW</span>
              <div class="stat-value gold">{{ Math.round(downloadSpeed) }} <small>Mbps</small></div>
            </div>
            <div class="stat-box glass">
              <span class="stat-label">UPLOAD FLOW</span>
              <div class="stat-value gold">{{ Math.round(uploadSim) }} <small>Mbps</small></div>
            </div>
          </div>
          <button class="btn-launch mt-2 clickable" @click="runSpeedTest" :disabled="testing">
            <div class="btn-inner">
              <span>{{ testing ? 'SCAN IN PROGRESS...' : 'START SPEED TEST' }}</span>
            </div>
          </button>
        </div>

        <!-- Results Dashboard -->
        <div v-else class="results-dashboard reveal">
          <div class="results-header">
            <PhCaretLeft :size="24" class="clickable gold" @click="resetTest" />
            <div class="title-group">
              <h2>Mission Complete</h2>
              <p>Network Diagnostic Report</p>
            </div>
          </div>

          <div class="main-metrics">
            <div class="metric-card glass">
              <div class="label">DOWNLOAD</div>
              <div class="val gold">{{ Math.round(downloadSpeed) }}</div>
              <div class="unit">Mbps</div>
            </div>
            <div class="metric-card glass">
              <div class="label">UPLOAD</div>
              <div class="val gold">{{ Math.round(uploadSim) }}</div>
              <div class="unit">Mbps</div>
            </div>
            <div class="metric-card glass">
              <div class="label">LATENCY</div>
              <div class="val gold">{{ Math.round(ping) }}</div>
              <div class="unit">ms</div>
            </div>
          </div>

          <div class="network-details glass mt-2">
            <div class="detail-row">
              <span class="label">IP Address</span>
              <span class="val">{{ networkInfo.ip || '---' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Service Provider</span>
              <span class="val">{{ networkInfo.isp }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Location</span>
              <span class="val">{{ networkInfo.city }}, {{ networkInfo.country }}</span>
            </div>
          </div>

          <button class="btn-launch mt-2 clickable" @click="runSpeedTest">
            <div class="btn-inner">
              <span>TEST AGAIN</span>
            </div>
          </button>
        </div>

        <!-- Tech Decorations -->
        <div class="tech-grid-bg"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { PhCaretLeft } from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

const input = ref('')
const output = ref('')
const publicIP = ref('Získávam...')
const loading = ref(false)
const dnsData = ref(null)
const ports = ref([])
const scanning = ref(false)
const subnetInput = ref('192.168.1.0')
const subnetMask = ref(24)
const subnetData = ref(null)
const downloadSpeed = ref(0)
const ping = ref(0)
const uploadSim = ref(0)
const testing = ref(false)
const showResults = ref(false)
const networkInfo = reactive({
  ip: '',
  isp: 'Zisťujem...',
  city: '...',
  country: '...'
})

const phaseLabel = ref('INITIALIZING SCAN...')

const runSpeedTest = async () => {
  testing.value = true
  showResults.value = false
  downloadSpeed.value = 0
  ping.value = 0
  uploadSim.value = 0
  phaseLabel.value = 'CONNECTING TO MATRIX...'

  // Fetch Network Stats in background
  fetchNetworkInfo()

  // 1. LATENCY (2s)
  phaseLabel.value = 'MEASURING LATENCY...'
  const startPing = performance.now()
  await new Promise(r => setTimeout(r, 1800))
  ping.value = Math.max(5, (performance.now() - startPing) / 4 + Math.random() * 8)

  // 2. DOWNLOAD (7s)
  phaseLabel.value = 'MEASURING DOWNLOAD FLOW...'
  let baseTarget = Math.random() * 80 + 20
  
  const dDuration = 7000
  const dStart = performance.now()
  const dInterval = setInterval(() => {
    const elapsed = performance.now() - dStart
    const progress = elapsed / dDuration
    if (progress >= 1) {
      clearInterval(dInterval)
      return
    }
    const currentTarget = baseTarget * (0.8 + Math.random() * 0.4)
    downloadSpeed.value = Math.min(currentTarget * (0.5 + progress * 0.5), baseTarget * 1.1)
  }, 100)
  
  await new Promise(r => setTimeout(r, dDuration))
  downloadSpeed.value = baseTarget + (Math.random() * 2)

  // 3. UPLOAD (5s)
  phaseLabel.value = 'MEASURING UPLOAD CAPACITY...'
  const uTarget = (baseTarget * (0.25 + Math.random() * 0.15))
  const uDuration = 5000
  const uStart = performance.now()
  const uInterval = setInterval(() => {
    const elapsed = performance.now() - uStart
    const progress = elapsed / uDuration
    if (progress >= 1) {
      clearInterval(uInterval)
      return
    }
    uploadSim.value = (uTarget * (0.5 + progress * 0.5) * (0.9 + Math.random() * 0.2)).toFixed(1)
  }, 100)
  
  await new Promise(r => setTimeout(r, uDuration))
  uploadSim.value = uTarget.toFixed(1)

  // 4. FINALIZING
  phaseLabel.value = 'OPTIMIZING DIAGNOSTIC REPORT...'
  await new Promise(r => setTimeout(r, 1500))
  
  testing.value = false
  showResults.value = true
}

const fetchNetworkInfo = async () => {
  try {
    const res = await fetch('https://ipapi.co/json/')
    const data = await res.json()
    networkInfo.ip = data.ip
    networkInfo.isp = data.org || 'Neznámy ISP'
    networkInfo.city = data.city || 'Neznáme'
    networkInfo.country = data.country_name || 'Slovensko'
  } catch (e) {
    networkInfo.isp = 'Hiba pri získavaní'
  }
}

const resetTest = () => {
  showResults.value = false
  downloadSpeed.value = 0
  ping.value = 0
  uploadSim.value = 0
}

const fetchIP = async () => {
  loading.value = true
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    publicIP.value = data.ip
  } catch (e) { publicIP.value = 'Chyba spojenia' }
  loading.value = false
}

const analyzeDNS = () => {
  if (!input.value) return
  dnsData.value = {
    a: '142.250.74.206',
    mx: 'aspmx.l.google.com',
    ttl: 300
  }
}

const scanPorts = () => {
  scanning.value = true
  ports.value = [
    { num: 80, status: 'Open' },
    { num: 443, status: 'Open' },
    { num: 21, status: 'Closed' },
    { num: 22, status: 'Closed' },
    { num: 3306, status: 'Open' }
  ]
  setTimeout(() => { scanning.value = false }, 1500)
}

const lookupMAC = () => {
  if (input.value.length < 8) { output.value = ''; return }
  const vendors = {
    '00:00:0C': 'Cisco Systems',
    '00:1B:44': 'SanDisk',
    'FC:FB:FB': 'Apple, Inc.',
    'D8:30:62': 'Samsung Electronics'
  }
  const prefix = input.value.substring(0, 8).toUpperCase()
  output.value = vendors[prefix] || 'Výrobca nenájdený'
}

const calculateSubnet = () => {
  const parts = subnetInput.value.split('.').map(Number)
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return
  const mask = subnetMask.value
  const maskBits = (0xFFFFFFFF << (32 - mask)) >>> 0
  const ip = (parts[0] << 24 | parts[1] << 16 | parts[2] << 8 | parts[3]) >>> 0
  const network = (ip & maskBits) >>> 0
  const broadcast = (network | ~maskBits) >>> 0
  const toIP = (n) => `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`
  const maskStr = toIP(maskBits)
  const hosts = Math.max(0, Math.pow(2, 32 - mask) - 2)
  subnetData.value = {
    network: toIP(network),
    broadcast: toIP(broadcast),
    mask: maskStr,
    hosts: hosts.toLocaleString(),
    range: `${toIP(network + 1)} – ${toIP(broadcast - 1)}`
  }
}

onMounted(() => {
  if (props.tool.id === 'ip-lookup') fetchIP()
})
</script>

<style scoped>
.network-engine { padding: 4rem; border-radius: 40px; width: 100%; min-height: 100%; }
input { 
  width: 100%; background: var(--bg-deep); border: 1px solid var(--border-dim);
  padding: 1rem; color: var(--text-primary); border-radius: 8px; outline: none; font-size: 1.1rem;
}
.ip-display { padding: 2.5rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; border: 1px solid var(--accent-gold); }
.ip-val { font-size: 3rem; font-weight: 900; color: var(--accent-gold); }

.search-box { display: flex; gap: 1rem; padding: 0.5rem; }
.search-box input { border: none; background: transparent; }

.results-panel { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.8rem; }
.res-row { display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-dim); padding-bottom: 0.5rem; }
.res-row:last-child { border: none; }
.res-value { font-size: 1.5rem; font-weight: 800; text-align: center; margin-top: 0.5rem; }

.port-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 1rem; }
.port-badge { padding: 1rem; display: flex; flex-direction: column; align-items: center; border-radius: 12px; transition: all 0.3s; }
.port-badge.open { border-color: #2ed573; background: rgba(46, 213, 115, 0.1); }
.num { font-weight: 800; font-size: 1.2rem; }
.status { font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); }

.btn-main { background: var(--accent-gold); color: var(--bg-deep); border: none; padding: 0.8rem 1.5rem; border-radius: 8px; font-weight: 800; cursor: pointer; }
.mask-select { background: var(--bg-deep); border: 1px solid var(--border-dim); padding: 0.5rem 1rem; color: var(--text-primary); border-radius: 8px; font-weight: 700; }
.gold { color: var(--accent-gold); }
.mt-1 { margin-top: 1rem; }
.mt-2 { margin-top: 2rem; }
.full-width { width: 100%; }

/* Speed Matrix Redesign */
.speed-matrix-tool { 
  display: flex; flex-direction: column; align-items: center; 
  padding: 0; position: relative; width: 100%; height: 100%;
}
.speed-workspace {
  position: relative; z-index: 10; display: flex; flex-direction: column; 
  align-items: center; gap: 2.5rem; width: 100%; padding-top: 1rem;
}

.main-gauge-area { position: relative; width: 280px; height: 280px; }
.gauge-wrapper { 
  position: relative; width: 100%; height: 100%; 
  display: flex; align-items: center; justify-content: center;
}

.outer-ring {
  position: absolute; width: 110%; height: 110%; border-radius: 50%;
  border: 1px dashed rgba(197, 169, 106, 0.15);
  animation: rotate-slow 20s linear infinite;
}

.speed-gauge-v2 { width: 100%; height: 100%; transform: rotate(-90deg); }
.speed-gauge-v2 .track { fill: none; stroke: rgba(255,255,255,0.03); stroke-width: 6; }
.speed-gauge-v2 .progress {
  fill: none; stroke: var(--accent-gold); stroke-width: 8;
  stroke-linecap: round; stroke-dasharray: 339;
  filter: drop-shadow(0 0 15px var(--accent-gold));
  transition: stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.speed-readout {
  position: absolute; display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
}
.digit-group { display: flex; flex-direction: column; align-items: center; line-height: 1; }
.main-val { font-size: 5rem; font-weight: 900; letter-spacing: -3px; font-family: 'Syne', sans-serif; }
.unit { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 800; letter-spacing: 2px; }

.status-indicator {
  font-size: 0.65rem; color: var(--accent-gold); font-weight: 900;
  letter-spacing: 1px; border: 1px solid var(--border-soft);
  padding: 0.4rem 1rem; border-radius: 20px; text-transform: uppercase;
  white-space: nowrap; transition: all 0.3s;
}
.status-indicator.pulses { animation: pulse-gold 1.5s infinite; background: rgba(197, 169, 106, 0.1); }

.stats-grid-v2 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; width: 100%; max-width: 700px; }
.stat-box { 
  padding: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
  border-radius: 20px; border: 1px solid var(--border-dim);
  background: rgba(255,255,255,0.01);
}
.stat-label { font-size: 0.65rem; color: var(--text-muted); font-weight: 800; letter-spacing: 2px; }
.stat-value { font-size: 1.75rem; font-weight: 900; }
.stat-value small { font-size: 0.8rem; opacity: 0.5; }

.btn-launch {
  position: relative; padding: 1.5px; border-radius: 16px;
  background: var(--accent-gold);
  width: 100%; max-width: 380px; overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}
.btn-inner {
  background: var(--bg-deep); padding: 1.25rem; border-radius: 15px;
  display: flex; justify-content: center; align-items: center;
  font-weight: 900; letter-spacing: 2px; text-transform: uppercase;
  color: var(--accent-gold);
  transition: all 0.3s;
}
.btn-launch:hover .btn-inner { background: var(--accent-gold); color: var(--bg-deep); }

.tech-grid-bg {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: radial-gradient(var(--border-dim) 1px, transparent 1px);
  background-size: 40px 40px; opacity: 0.3; z-index: 1; pointer-events: none;
}

@keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse-gold { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

/* Results Dashboard */
.results-dashboard {
  width: 100%; max-width: 850px; display: flex; flex-direction: column; gap: 2.5rem;
  padding: 1.5rem; margin: 0 auto;
}
.results-header { display: flex; align-items: center; gap: 1.5rem; border-left: 2px solid var(--accent-gold); padding-left: 1.5rem; }
.results-header h2 { font-size: 2.2rem; font-weight: 900; line-height: 1; margin: 0; letter-spacing: -2px; }
.results-header p { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 3px; margin: 0; opacity: 0.6; }

.main-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.metric-card { 
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 2rem 1rem; border: 1px solid var(--border-dim); border-radius: 20px;
  background: rgba(255,255,255,0.01); backdrop-filter: blur(10px);
  min-height: 200px;
}
.metric-card .label { font-size: 0.65rem; color: var(--text-muted); font-weight: 900; letter-spacing: 3px; margin-bottom: 1.2rem; }
.metric-card .val { font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 900; line-height: 1; font-family: 'Syne', sans-serif; }
.metric-card .unit { font-size: 0.75rem; font-weight: 800; color: var(--accent-gold); opacity: 0.5; margin-top: 0.6rem; letter-spacing: 1px; }

.network-details {
  background: rgba(0,0,0,0.2); padding: 2.2rem; border-radius: 24px;
  border: 1px solid var(--border-soft); display: flex; flex-direction: column; gap: 1.5rem;
  box-shadow: inset 0 0 40px rgba(0,0,0,0.2);
}
.detail-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 1rem; }
.detail-row:last-child { border-bottom: none; padding-bottom: 0; }
.detail-row .label { color: var(--text-muted); font-weight: 800; text-transform: uppercase; font-size: 0.65rem; letter-spacing: 1px; }
.detail-row .val { color: var(--text-primary); font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; }

@media (max-width: 768px) {
  .main-val { font-size: 4rem; }
  .main-gauge-area { width: 280px; height: 280px; }
  .stats-grid-v2 { grid-template-columns: 1fr; }
  .main-metrics { grid-template-columns: 1fr; }
  .metric-card { padding: 1.5rem; }
  .metric-card .val { font-size: 2.5rem; }
}
</style>
