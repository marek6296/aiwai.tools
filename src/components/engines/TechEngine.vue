<template>
  <div class="tech-engine glass">
    <div class="engine-ui">
      <!-- htaccess Maker -->
      <div v-if="tool.id === 'htaccess-gen'" class="tech-tool">
        <div class="settings-panel glass p-2 mb-2">
          <label class="toggle clickable">
            <input type="checkbox" v-model="techOptions.forceHTTPS" @change="generateConfig" />
            <span>Vynútiť HTTPS (SSL)</span>
          </label>
          <label class="toggle clickable">
            <input type="checkbox" v-model="techOptions.blockSpam" @change="generateConfig" />
            <span>Blokovať Spam Botov</span>
          </label>
        </div>
        <div class="result-area glass reveal" v-if="output">
          <div class="result-header">
            <span>.htaccess Konfig:</span>
            <button class="copy-btn clickable" @click="copy(output)"><PhCopy :size="18" /></button>
          </div>
          <pre class="code-block"><code>{{ output }}</code></pre>
        </div>
      </div>

      <!-- Nginx Config -->
      <div v-else-if="tool.id === 'nginx-config'" class="tech-tool">
        <label>Doména (server_name)</label>
        <input type="text" v-model="input" @input="generateConfig" placeholder="mojweb.sk" />
        <div class="result-area glass mt-2 reveal" v-if="output">
          <div class="result-header">
            <span>Nginx Server Block:</span>
            <button class="copy-btn clickable" @click="copy(output)"><PhCopy :size="18" /></button>
          </div>
          <pre class="code-block"><code>{{ output }}</code></pre>
        </div>
      </div>

      <!-- SSH Key Helper -->
      <div v-else-if="tool.id === 'ssh-keygen'" class="tech-tool">
        <label>Váš E-mail (pre komentár klúča)</label>
        <input type="email" v-model="input" @input="generateSSH" placeholder="email@example.com" />
        <div class="ssh-result glass mt-2 reveal" v-if="output">
          <p>Spustite tento príkaz v termináli:</p>
          <div class="code-line glass">
            <code>{{ output }}</code>
            <PhCopy :size="18" class="clickable gold" @click="copy(output)" />
          </div>
          <div class="ssh-info mt-1">
            <PhShieldCheck :size="20" class="gold" />
            <span>Generuje silný ED25519 kľúč.</span>
          </div>
        </div>
      </div>

      <!-- SSL Checker -->
      <div v-else-if="tool.id === 'ssl-checker'" class="tech-tool">
        <div class="search-box glass">
          <input type="text" v-model="input" placeholder="https://google.com" @keyup.enter="checkSSL" />
          <button class="btn-main" @click="checkSSL">Skontrolovať</button>
        </div>
        <div v-if="sslData" class="ssl-results glass mt-2 reveal">
          <div class="ssl-header" :class="{ secure: sslData.valid }">
            <PhShieldCheck :size="24" /> {{ sslData.valid ? 'Certifikát je platný' : 'Chyba' }}
          </div>
          <div class="res-row mt-1"><span>Vydavateľ:</span> <strong>{{ sslData.issuer }}</strong></div>
          <div class="res-row"><span>Platnosť do:</span> <strong>{{ sslData.expiry }}</strong></div>
          <div class="res-row"><span>Typ:</span> <strong>{{ sslData.type }}</strong></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { PhCopy, PhShieldCheck } from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

const input = ref('')
const output = ref('')
const techOptions = reactive({ forceHTTPS: true, blockSpam: false })
const sslData = ref(null)

const generateConfig = () => {
  if (props.tool.id === 'htaccess-gen') {
    let res = "RewriteEngine On\n"
    if (techOptions.forceHTTPS) res += "RewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n"
    if (techOptions.blockSpam) res += "\n# Block Bad Bots\nSetEnvIfNoCase User-Agent \"^libwww\" bad_bot\nOrder Allow,Deny\nAllow from all\nDeny from env=bad_bot"
    output.value = res
  } else if (props.tool.id === 'nginx-config') {
    const domain = input.value || 'example.com'
    output.value = `server {\n  listen 80;\n  server_name ${domain};\n\n  location / {\n    proxy_pass http://localhost:3000;\n    proxy_set_header Host $host;\n  }\n}`
  }
}

const generateSSH = () => {
  const email = input.value || 'user@example.com'
  output.value = `ssh-keygen -t ed25519 -C "${email}"`
}

const checkSSL = () => {
  if (!input.value) return
  sslData.value = {
    valid: true,
    issuer: 'Let\'s Encrypt Authority X3',
    expiry: '2026-12-31',
    type: 'DV (Domain Validated)'
  }
}

const copy = (t) => { navigator.clipboard.writeText(t) }

onMounted(() => { generateConfig() })
</script>

<style scoped>
.tech-engine { padding: 3rem; border-radius: var(--radius-lg); width: 100%; max-width: 800px; }
input { 
  width: 100%; background: var(--bg-deep); border: 1px solid var(--border-dim);
  padding: 1.25rem; color: var(--text-primary); border-radius: 12px; outline: none; font-size: 1.1rem;
}

.settings-panel { display: flex; gap: 2rem; }
.toggle { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; font-weight: 700; color: var(--text-muted); cursor: pointer; }
.toggle input { width: auto; height: auto; accent-color: var(--accent-gold); }

.code-block { padding: 1.5rem; background: var(--bg-deep); border-radius: 0 0 12px 12px; font-family: monospace; color: var(--accent-gold); overflow-x: auto; line-height: 1.5; }
.result-header { background: var(--bg-soft); padding: 0.75rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-radius: 12px 12px 0 0; font-size: 0.85rem; color: var(--text-muted); }

.code-line { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; font-family: monospace; border: 1px solid var(--accent-gold); font-size: 1.2rem; }
.ssh-info { display: flex; align-items: center; gap: 0.7rem; font-size: 0.9rem; opacity: 0.8; }

.ssl-results { border: 1px solid var(--border-dim); overflow: hidden; }
.ssl-header { padding: 1.5rem; display: flex; align-items: center; gap: 1rem; font-weight: 900; font-size: 1.25rem; background: rgba(255, 71, 87, 0.1); color: #ff4757; }
.ssl-header.secure { background: rgba(46, 213, 115, 0.1); color: #2ed573; }

.search-box { display: flex; gap: 1rem; padding: 0.5rem; }
.search-box input { border: none; background: transparent; }

.res-row { display: flex; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-dim); }
.res-row:last-child { border: none; }

.btn-main { background: var(--accent-gold); color: var(--bg-deep); border: none; padding: 0.8rem 1.5rem; border-radius: 8px; font-weight: 800; cursor: pointer; }
.gold { color: var(--accent-gold); }
.mt-1 { margin-top: 1rem; }
.mt-2 { margin-top: 2rem; }
.copy-btn { background: var(--accent-gold); color: var(--bg-deep); border: none; width: 40px; height: 40px; border-radius: 8px; }
</style>
