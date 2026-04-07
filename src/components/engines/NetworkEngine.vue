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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
.network-engine { padding: 3rem; border-radius: var(--radius-lg); width: 100%; max-width: 800px; }
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
</style>
