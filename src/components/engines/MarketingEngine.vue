<template>
  <div class="marketing-engine">
    <!-- QR GENERATOR TOOL -->
    <div v-if="tool.id === 'qr-gen'" class="qr-tool reveal">
      <div class="input-panel glass">
        <h3>QR Generátor Pro</h3>
        <p>Premeňte URL, text alebo Wi-Fi na profesionálny QR kód.</p>
        
        <div class="input-group">
          <label>Obsah QR kódu</label>
          <textarea v-model="qrContent" placeholder="Vložte odkaz (napr. https://mojweb.sk)..."></textarea>
        </div>

        <div class="settings-grid">
          <div class="setting">
            <label>Farba kódu</label>
            <input type="color" v-model="qrColor" />
          </div>
          <div class="setting">
            <label>Veľkosť (px)</label>
            <input type="number" v-model="qrSize" min="100" max="1000" />
          </div>
        </div>

        <button class="btn-main clickable" @click="generateQR">
          <PhQrCode :size="20" weight="bold" />
          Generovať QR kód
        </button>
      </div>

      <div class="preview-panel glass">
        <div v-if="qrResult" class="qr-display reveal">
          <img :src="qrResult" alt="QR Code" ref="qrImg" />
          <div class="qr-actions">
            <button class="btn-sub clickable" @click="downloadQR">
              <PhDownload :size="18" /> Stiahnuť PNG
            </button>
          </div>
        </div>
        <div v-else class="qr-placeholder">
          <PhQrCode :size="100" weight="thin" />
          <p>Náhľad sa zobrazí tu</p>
        </div>
      </div>
    </div>

    <!-- YT THUMBNAIL TOOL -->
    <div v-if="tool.id === 'yt-thumb'" class="yt-thumb-tool reveal">
      <div class="input-panel glass">
        <h3>YouTube Thumbnail Grabber</h3>
        <p>Získajte náhľadový obrázok z akéhokoľvek videa v plnom rozlíšení.</p>
        
        <div class="input-group">
          <label>YouTube URL</label>
          <input type="url" v-model="ytUrl" placeholder="https://youtube.com/watch?v=..." @input="extractThumb" />
        </div>

        <div v-if="thumbResult" class="thumb-preview reveal">
          <img :src="thumbResult" alt="Thumbnail" />
          <div class="download-grid">
            <button class="btn-main clickable" @click="downloadThumb('maxresdefault')">Stiahnuť HD (1280x720)</button>
            <button class="btn-sub clickable" @click="downloadThumb('hqdefault')">Stiahnuť SD (480x360)</button>
          </div>
        </div>
      </div>
    </div>

    <!-- META TAGS TOOL -->
    <div v-if="tool.id === 'meta-tags'" class="meta-tool glass reveal">
      <div class="meta-header">
        <h3>Meta Tag Generátor</h3>
        <p>Optimalizujte svoj web pre vyhľadávače a sociálne siete.</p>
      </div>
      
      <div class="meta-input-grid">
        <div class="field">
          <label>Názov stránky (Title)</label>
          <input type="text" v-model="metaTitle" placeholder="Max 60 znakov" />
        </div>
        <div class="field">
          <label>Popis (Description)</label>
          <textarea v-model="metaDesc" placeholder="Max 160 znakov"></textarea>
        </div>
      </div>

      <div class="meta-output">
        <div class="output-header">
          <span>Vygenerovaný kód:</span>
          <button class="btn-copy clickable" @click="copy(generatedMeta)">Kopírovať</button>
        </div>
        <pre class="code-block"><code>{{ generatedMeta }}</code></pre>
      </div>
    </div>

    <!-- ROBOTS.TXT GENERATOR -->
    <div v-else-if="tool.id === 'robots-gen'" class="robots-tool glass reveal">
      <div class="meta-header">
        <h3>Robots.txt Maker</h3>
        <p>Vytvorte inštrukcie pre vyhľadávacie roboty jediným klikom.</p>
      </div>

      <div class="robots-grid">
        <div class="settings-panel">
          <div class="field">
            <label>User-agent</label>
            <select v-model="robotsAgent" class="glass clickable">
              <option value="*">Všetky roboty (*)</option>
              <option value="Googlebot">Googlebot</option>
              <option value="Bingbot">Bingbot</option>
            </select>
          </div>
          <div class="field">
            <label>Zakázané cesty (Disallow)</label>
            <input type="text" v-model="robotsDisallow" placeholder="/admin, /private..." />
          </div>
          <div class="field">
            <label>Sitemap URL</label>
            <input type="url" v-model="robotsSitemap" placeholder="https://vásweb.sk/sitemap.xml" />
          </div>
        </div>

        <div class="output-panel">
          <div class="output-header">
            <span>Obsah súboru:</span>
            <button class="btn-copy clickable" @click="copy(generatedRobots)">Kopírovať</button>
          </div>
          <pre class="code-block"><code>{{ generatedRobots }}</code></pre>
        </div>
      </div>
    </div>

    <!-- SITEMAP HELPER -->
    <div v-if="tool.id === 'sitemap-helper'" class="sitemap-tool glass reveal">
      <div class="meta-header">
        <h3>Sitemap XML Pomocník</h3>
        <p>Vygenerujte štruktúru XML mapy vašich kľúčových stránok.</p>
      </div>

      <div class="sitemap-grid">
        <div class="field">
          <label>Zoznam URL adries (jedna na riadok)</label>
          <textarea v-model="sitemapUrls" placeholder="https://mojweb.sk/&#10;https://mojweb.sk/blog"></textarea>
        </div>

        <div class="meta-output">
          <div class="output-header">
            <span>XML Výstup:</span>
            <button class="btn-copy clickable" @click="copy(generatedSitemap)">Kopírovať XML</button>
          </div>
          <pre class="code-block"><code>{{ generatedSitemap }}</code></pre>
        </div>
      </div>
    </div>

    <!-- HASHTAG GENERATOR -->
    <div v-if="tool.id === 'hashtag-gen'" class="marketing-tool glass reveal">
      <div class="meta-header">
        <h3>Hashtag Generátor</h3>
        <p>Získajte najlepšie tagy pre Instagram, TikTok a Twitter.</p>
      </div>
      <div class="input-panel">
        <div class="input-group">
          <label>Téma alebo kľúčové slovo</label>
          <input type="text" v-model="marketingInput" placeholder="napr. fitness, marketing, tech" @input="generateHashtags" />
        </div>
        <div v-if="hashtagResult" class="tags-cloud reveal">
          <span v-for="tag in hashtagResult" :key="tag" class="tag clickable" @click="copy(tag)">{{ tag }}</span>
        </div>
        <button v-if="hashtagResult" class="btn-main mt-1" @click="copy(hashtagResult.join(' '))">Kopírovať všetko</button>
      </div>
    </div>

    <!-- UTM BUILDER -->
    <div v-if="tool.id === 'utm-builder'" class="marketing-tool glass reveal">
      <div class="meta-header">
        <h3>UTM Tag Builder</h3>
        <p>Vytvorte trackovacie linky pre vaše kampane.</p>
      </div>
      <div class="utm-grid">
        <div class="field">
          <label>Cieľová URL</label>
          <input type="text" v-model="val1" @input="buildUTM" placeholder="https://vásweb.sk" />
        </div>
        <div class="field-row">
          <div class="field">
            <label>Zdroj (Source)</label>
            <input type="text" v-model="val2" @input="buildUTM" placeholder="facebook, google, newsletter" />
          </div>
          <div class="field">
            <label>Médium</label>
            <input type="text" v-model="val3" @input="buildUTM" placeholder="cpc, social, email" />
          </div>
        </div>
        <div class="field">
          <label>Názov kampane</label>
          <input type="text" v-model="val4" @input="buildUTM" placeholder="spring_sale" />
        </div>
      </div>
      <div class="meta-output mt-2" v-if="output">
        <div class="output-header">
          <span>Final URL:</span>
          <button class="btn-copy clickable" @click="copy(output)">Kopírovať</button>
        </div>
        <div class="code-block">{{ output }}</div>
      </div>
    </div>

    <!-- OG PREVIEWER -->
    <div v-if="tool.id === 'og-preview'" class="marketing-tool glass reveal">
      <div class="meta-header">
        <h3>Social Previewer</h3>
        <p>Simulujte náhľad vášho webu na sociálnych sieťach.</p>
      </div>
      <div class="og-preview-box">
        <div class="og-input">
          <label>URL Obrázka (OG Image)</label>
          <input type="text" v-model="val1" placeholder="https://vásweb.sk/og-image.jpg" />
          <label class="mt-1">Titulok príspevku</label>
          <input type="text" v-model="val2" placeholder="Názov vašej stránky" />
        </div>
        <div class="og-card-demo glass mt-2">
          <img :src="val1 || 'https://via.placeholder.com/1200x630/222/cea96a?text=AIWai+Preview'" class="og-img" />
          <div class="og-content">
            <div class="og-site">VÁŠWEB.SK</div>
            <div class="og-title">{{ val2 || 'Tu bude váš titulok' }}</div>
            <div class="og-desc">Toto je ukážka popisu, ktorý sa zobrazí na sociálnych sieťach...</div>
          </div>
        </div>
      </div>
    </div>

    <!-- EMAIL SUBJECT TESTER -->
    <div v-if="tool.id === 'email-subject-test'" class="marketing-tool glass reveal">
      <div class="meta-header">
        <h3>Email Subject Tester</h3>
        <p>Získajte skóre otvárateľnosti pre váš predmet emailu.</p>
      </div>
      <div class="input-panel">
        <label>Zadajte predmet emailu</label>
        <input type="text" v-model="input" @input="testEmailSubject" placeholder="Akciove zlavy len dnes!" />
        
        <div v-if="subjectScore" class="score-display mt-2 text-center">
          <div class="score-circle" :style="{ borderColor: subjectColor }">
            <span :style="{ color: subjectColor }">{{ subjectScore }}%</span>
          </div>
          <p class="score-label">{{ subjectFeedback }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { PhQrCode, PhDownload, PhMagnifyingGlass, PhPlus, PhHash } from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

const marketingInput = ref('')
const hashtagResult = ref(null)
const keywordResult = ref([])
const input = ref('')
const output = ref('')
const val1 = ref('')
const val2 = ref('')
const val3 = ref('')
const val4 = ref('')

const subjectScore = ref(0)
const subjectFeedback = ref('')
const subjectColor = ref('')

const buildUTM = () => {
  if (!val1.value) { output.value = ''; return }
  let base = val1.value
  const params = []
  if (val2.value) params.push(`utm_source=${encodeURIComponent(val2.value)}`)
  if (val3.value) params.push(`utm_medium=${encodeURIComponent(val3.value)}`)
  if (val4.value) params.push(`utm_campaign=${encodeURIComponent(val4.value)}`)
  
  const separator = base.includes('?') ? '&' : '?'
  output.value = params.length ? `${base}${separator}${params.join('&')}` : base
}

const testEmailSubject = () => {
  if (!input.value) { subjectScore.value = 0; return }
  let score = 50
  const txt = input.value.toLowerCase()
  if (txt.length > 20 && txt.length < 60) score += 20
  if (txt.includes('!') || txt.includes('?')) score += 10
  if (txt.length > 100) score -= 30
  if (txt.includes('zadarmo') || txt.includes('výhra')) score -= 15 // Spam filter feel
  
  subjectScore.value = Math.min(100, Math.max(0, score))
  if (score > 70) { subjectFeedback.value = 'Skvelý predmet!'; subjectColor.value = '#2ed573' }
  else if (score > 40) { subjectFeedback.value = 'Priemerný, skúste vylepšiť.'; subjectColor.value = '#ffa502' }
  else { subjectFeedback.value = 'Príliš dlhý alebo pôsobí ako spam.'; subjectColor.value = '#ff4757' }
}

const generateHashtags = () => {
  if (!marketingInput.value) { hashtagResult.value = null; return }
  const base = marketingInput.value.toLowerCase().replace(/\s+/g, '')
  hashtagResult.value = [
    `#${base}`, `#${base}life`, `#best${base}`, `#${base}2026`, 
    `#${base}tips`, `#${base}pro`, `#ai${base}`, `#${base}world`
  ]
}

const findKeywords = () => {
  if (!marketingInput.value) return
  const kw = marketingInput.value
  keywordResult.value = [
    `${kw} cena`, `${kw} recenzie`, `${kw} návod`, `najlepšie ${kw}`, 
    `ako funguje ${kw}`, `${kw} online`, `články o ${kw}`
  ]
}

// QR Logic
const qrContent = ref('')
const qrColor = ref('#cea96a') // Our gold accent
const qrSize = ref(400)
const qrResult = ref(null)

const generateQR = () => {
  if (!qrContent.value) return
  // Using goqr.me API for zero-dependency high speed QR generation
  const color = qrColor.value.replace('#', '')
  qrResult.value = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize.value}x${qrSize.value}&data=${encodeURIComponent(qrContent.value)}&color=${color}&bgcolor=0-0-0-0`
}

const downloadQR = () => {
  const link = document.createElement('a')
  link.href = qrResult.value
  link.download = 'aiwai-qr-code.png'
  link.click()
}

// YT Thumbnail Logic
const ytUrl = ref('')
const thumbResult = ref(null)
const videoId = ref('')

const extractThumb = () => {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = ytUrl.value.match(regExp)
  if (match && match[2].length == 11) {
    videoId.value = match[2]
    thumbResult.value = `https://img.youtube.com/vi/${videoId.value}/maxresdefault.jpg`
  } else {
    thumbResult.value = null
  }
}

const downloadThumb = (quality) => {
  const url = `https://img.youtube.com/vi/${videoId.value}/${quality}.jpg`
  const link = document.createElement('a')
  link.href = url
  link.download = `yt-thumbnail-${quality}.jpg`
  link.click()
}

// Meta Tags Logic
const metaTitle = ref('')
const metaDesc = ref('')
const generatedMeta = computed(() => {
  return `<!-- SEO Meta Tags -->
<title>${metaTitle.value || 'Názov stránky'}</title>
<meta name="description" content="${metaDesc.value || 'Popis stránky pre vyhľadávače.'}">

<!-- Open Graph / FB -->
<meta property="og:type" content="website">
<meta property="og:title" content="${metaTitle.value || 'Názov stránky'}">
<meta property="og:description" content="${metaDesc.value || 'Popis stránky...'}">`
})

// Robots.txt Logic
const robotsAgent = ref('*')
const robotsDisallow = ref('/admin')
const robotsSitemap = ref('')
const generatedRobots = computed(() => {
  let res = `User-agent: ${robotsAgent.value}\nDisallow: ${robotsDisallow.value}`
  if (robotsSitemap.value) res += `\n\nSitemap: ${robotsSitemap.value}`
  return res
})

// Sitemap Helper Logic
const sitemapUrls = ref('')
const generatedSitemap = computed(() => {
  const urls = sitemapUrls.value.split('\n').filter(u => u.trim())
  if (!urls.length) return '<!-- Vložte URL adresy pre vygenerovanie XML -->'
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  urls.forEach(url => {
    xml += `  <url>\n    <loc>${url.trim()}</loc>\n    <priority>0.8</priority>\n  </url>\n`
  })
  xml += '</urlset>'
  return xml
})

const copy = (txt) => {
  navigator.clipboard.writeText(txt)
  alert('Skopírované do schránky!')
}
</script>

<style scoped>
.marketing-engine { width: 100%; }

.qr-tool, .yt-thumb-tool {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.input-panel {
  padding: 2.5rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group { display: flex; flex-direction: column; gap: 0.75rem; }
.input-group label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }

textarea, input[type="text"], input[type="url"], input[type="number"], select {
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  padding: 1rem;
  border-radius: 8px;
  color: var(--text-primary);
  outline: none;
  font-size: 1rem;
}

textarea { min-height: 120px; resize: none; }

.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.setting { display: flex; flex-direction: column; gap: 0.5rem; }
.setting label { font-size: 0.75rem; color: var(--text-muted); }
input[type="color"] { width: 100%; height: 40px; border: none; background: transparent; cursor: pointer; }

.preview-panel {
  padding: 2.5rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.qr-display {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.qr-display img {
  max-width: 250px;
  border: 8px solid white;
  border-radius: 8px;
}

.qr-placeholder {
  text-align: center;
  color: var(--text-muted);
  opacity: 0.3;
}

.thumb-preview img {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.download-grid { display: grid; gap: 0.75rem; }

/* Meta & SEO Tools */
.meta-tool, .robots-tool, .sitemap-tool { padding: 3rem; border-radius: var(--radius-lg); display: flex; flex-direction: column; gap: 2rem; }
.meta-input-grid, .robots-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.field { display: flex; flex-direction: column; gap: 0.75rem; }
.field label { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }

.meta-output, .output-panel {
  margin-top: 1rem;
  background: var(--bg-deep);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-dim);
}

.output-header { 
  background: var(--bg-soft); 
  padding: 0.75rem 1.5rem; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  font-size: 0.85rem;
}

.btn-copy { background: var(--accent-gold); color: var(--bg-deep); border: none; padding: 0.4rem 1rem; border-radius: 4px; font-weight: 700; cursor: pointer; }

.code-block { padding: 1.5rem; overflow-x: auto; color: var(--accent-gold); font-size: 0.9rem; line-height: 1.5; }

.btn-main {
  background: var(--accent-gold);
  color: var(--bg-deep);
  padding: 1rem;
  border-radius: var(--radius-md);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: none;
}

.btn-sub {
  background: var(--bg-soft);
  color: var(--text-primary);
  border: 1px solid var(--border-dim);
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .qr-tool, .yt-thumb-tool, .meta-input-grid, .robots-grid { grid-template-columns: 1fr; }
}

/* New Marketing Tools Styles */
.marketing-tool { padding: 3rem; border-radius: var(--radius-lg); }
.tags-cloud { display: flex; flex-wrap: wrap; gap: 0.8rem; margin: 1.5rem 0; }
.tag {
  padding: 0.5rem 1rem;
  background: rgba(197, 169, 106, 0.1);
  border: 1px solid var(--accent-gold);
  border-radius: var(--radius-full);
  color: var(--accent-gold);
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s;
}
.tag:hover {
  background: var(--accent-gold);
  color: var(--bg-deep);
  transform: translateY(-2px);
}

.search-box { display: flex; gap: 0.5rem; }
.search-box input { flex: 1; }
.btn-search {
  width: 50px;
  background: var(--accent-gold);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-deep);
}

.results-list { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
.kw-item {
  padding: 1rem;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mt-1 { margin-top: 1rem; }

/* UTM Builder Styles */
.utm-grid { display: flex; flex-direction: column; gap: 1.5rem; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

/* OG Preview Styles */
.og-card-demo { 
  background: #f0f2f5; color: #1c1e21; border-radius: 0; overflow: hidden; 
  border: 1px solid #ddd; max-width: 500px; margin: auto;
}
.og-img { width: 100%; aspect-ratio: 1.91 / 1; object-fit: cover; }
.og-content { padding: 12px; border-top: 1px solid #ddd; }
.og-site { font-size: 12px; color: #65676b; text-transform: uppercase; }
.og-title { font-size: 16px; font-weight: 600; margin: 4px 0; color: #1c1e21; }
.og-desc { font-size: 14px; color: #65676b; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* Score Display Styles */
.score-circle {
  width: 120px; height: 120px; border-radius: 50%; border: 8px solid;
  display: flex; align-items: center; justify-content: center;
  margin: 1.5rem auto; font-size: 2rem; font-weight: 900;
  transition: all 0.5s ease;
}
.score-label { font-weight: 700; font-size: 1.1rem; }
</style>
