<template>
  <div class="video-downloader">
    <div class="search-box-container glass">
      <div class="platform-indicators">
        <PhYoutubeLogo :class="{ active: platform === 'youtube' }" :size="24" weight="fill" />
        <PhTiktokLogo :class="{ active: platform === 'tiktok' }" :size="24" weight="fill" />
        <PhInstagramLogo :class="{ active: platform === 'instagram' }" :size="24" weight="fill" />
        <PhFacebookLogo :class="{ active: platform === 'facebook' }" :size="24" weight="fill" />
      </div>
      
      <div class="input-row">
        <input 
          v-model="url" 
          type="url" 
          :placeholder="placeholderText"
          class="url-input"
          @input="detectPlatform"
        />
        <button 
          class="btn-fetch clickable" 
          :disabled="!isValidUrl || loading"
          @click="fetchMedia"
        >
          <PhMagnifyingGlass v-if="!loading" :size="20" weight="bold" />
          <PhCircleNotch v-else :size="20" class="spin" />
          {{ loading ? 'Hľadám...' : 'Analyzovať' }}
        </button>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="result" class="results-view reveal" ref="resultsRef">
      <div class="video-card glass">
        <div class="thumb-wrapper">
          <img :src="result.thumbnail" alt="Preview" />
          <span class="duration-badge">{{ result.duration }}</span>
        </div>
        <div class="video-details">
          <h3>{{ result.title }}</h3>
          <p class="author">{{ result.author }} • {{ result.platform }}</p>
          
          <div class="quality-selector">
            <label>Vyberte kvalitu sťahovania:</label>
            <div class="quality-grid">
              <button 
                v-for="opt in result.formats" 
                :key="opt.quality" 
                class="quality-btn"
                :class="{ recommended: opt.quality === '1080p' }"
                @click="downloadFile(opt)"
              >
                <div class="q-info">
                  <span class="q-label">{{ opt.quality }}</span>
                  <span class="q-size">{{ opt.size }}</span>
                </div>
                <PhDownload :size="18" weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="pro-tip glass">
        <PhInfo :size="20" weight="duotone" />
        <p><strong>Pro Tip:</strong> Môžete sťahovať aj samotné audio vo formáte MP3 pre vaše projekty.</p>
      </div>
    </div>

    <div v-if="error" class="error-strip reveal">
      <PhWarningCircle :size="20" weight="fill" />
      {{ error }}
    </div>

    <div class="guide-grid">
      <div class="guide-card glass">
        <PhLinkSimple :size="32" weight="duotone" />
        <h4>1. Skopírujte link</h4>
        <p>Z YouTube, TikTok alebo IG Reels.</p>
      </div>
      <div class="guide-card glass">
        <PhArrowFatDown :size="32" weight="duotone" />
        <h4>2. Vložte hore</h4>
        <p>Kliknite na tlačidlo Analyzovať.</p>
      </div>
      <div class="guide-card glass">
        <PhFileVideo :size="32" weight="duotone" />
        <h4>3. Sťahujte</h4>
        <p>Vyberte si kvalitu a uložte súbor.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  PhYoutubeLogo, PhTiktokLogo, PhInstagramLogo, PhFacebookLogo, PhVideo, 
  PhDownload, PhCircleNotch, PhWarningCircle, PhMagnifyingGlass,
  PhInfo, PhLinkSimple, PhArrowFatDown, PhFileVideo
} from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

const url = ref('')
const loading = ref(false)
const error = ref('')
const result = ref(null)
const platform = ref('generic')

const isValidUrl = computed(() => {
  return url.value.length > 5 && url.value.includes('.')
})

const placeholderText = computed(() => {
  if (props.tool?.id.includes('yt')) return 'Vložte YouTube link (napr. https://youtube.com/watch?v=...)'
  if (props.tool?.id.includes('tt')) return 'Vložte TikTok link (napr. https://tiktok.com/@user/video/...)'
  if (props.tool?.id.includes('ig')) return 'Vložte Instagram link (Reels, Story alebo Post)'
  return 'Vložte URL adresu videa...'
})

const detectPlatform = () => {
  const lowUrl = url.value.toLowerCase()
  if (lowUrl.includes('youtube.com') || lowUrl.includes('youtu.be')) platform.value = 'youtube'
  else if (lowUrl.includes('tiktok.com')) platform.value = 'tiktok'
  else if (lowUrl.includes('instagram.com')) platform.value = 'instagram'
  else if (lowUrl.includes('facebook.com') || lowUrl.includes('fb.watch')) platform.value = 'facebook'
  else platform.value = 'generic'
}

const fetchMedia = async () => {
  loading.value = true
  error.value = ''
  result.value = null
  
  try {
    // Artificial delay for analysis feel
    await new Promise(r => setTimeout(r, 1800))
    
    if (url.value.includes('error')) throw new Error()

    result.value = {
      title: "How AI is changing the world in 2026",
      author: "TechVision Daily",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
      duration: "12:45",
      platform: platform.value.toUpperCase(),
      formats: [
        { quality: '4K Ultra HD', size: '1.2 GB', ext: 'MP4' },
        { quality: '1080p Full HD', size: '450 MB', ext: 'MP4' },
        { quality: '720p HD', size: '210 MB', ext: 'MP4' },
        { quality: 'Audio MP3', size: '12 MB', ext: 'MP3' }
      ]
    }
  } catch (e) {
    error.value = "Nepodarilo sa analyzovať video. Uistite sa, že video nie je súkromné a link je správny."
  } finally {
    loading.value = false
  }
}

const downloadFile = (opt) => {
  alert(`Sťahovanie spustené v kvalite ${opt.quality}. Príprava súboru...`)
}
</script>

<style scoped>
.video-downloader { display: flex; flex-direction: column; gap: 3rem; }

.search-box-container {
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.platform-indicators {
  display: flex;
  gap: 1.5rem;
  opacity: 0.3;
}

.platform-indicators svg.active {
  opacity: 1;
  color: var(--accent-gold);
}

.input-row {
  display: flex;
  gap: 1rem;
}

.url-input {
  flex: 1;
  background: var(--bg-deep);
  border: 1px solid var(--border-soft);
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1.1rem;
  outline: none;
  transition: border-color 0.3s;
}

.url-input:focus { border-color: var(--accent-gold); }

.btn-fetch {
  padding: 0 2.5rem;
  background: var(--accent-gold);
  color: var(--bg-deep);
  border-radius: var(--radius-md);
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: none;
}

.results-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.video-card {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2.5rem;
  padding: 2.5rem;
  border-radius: var(--radius-md);
}

.thumb-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
}

.thumb-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.duration-badge {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background: rgba(0,0,0,0.8);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
}

.video-details h3 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.author {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.quality-selector label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin-bottom: 1rem;
}

.quality-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.quality-btn {
  background: var(--bg-soft);
  border: 1px solid var(--border-dim);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-primary);
  transition: all 0.2s;
}

.quality-btn:hover {
  border-color: var(--accent-gold);
  background: rgba(197, 169, 106, 0.1);
}

.quality-btn.recommended {
  border-color: var(--accent-gold);
  box-shadow: 0 0 15px rgba(197, 169, 106, 0.1);
}

.q-info { display: flex; flex-direction: column; text-align: left; }
.q-label { font-weight: 700; font-size: 0.95rem; }
.q-size { font-size: 0.75rem; color: var(--text-muted); }

.pro-tip {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  color: var(--text-secondary);
}

.error-strip {
  padding: 1.5rem;
  background: rgba(231, 76, 60, 0.1);
  border-left: 4px solid #e74c3c;
  color: #ff7675;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.guide-card {
  padding: 2rem;
  text-align: center;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.guide-card h4 { font-weight: 700; }
.guide-card p { font-size: 0.85rem; color: var(--text-muted); }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .video-card { grid-template-columns: 1fr; }
  .guide-grid { grid-template-columns: 1fr; }
}
</style>
