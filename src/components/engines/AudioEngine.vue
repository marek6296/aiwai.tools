<template>
  <div class="audio-engine">
    <div v-if="!file" class="upload-zone glass clickable" @click="triggerUpload">
      <PhMusicNotes :size="64" weight="duotone" />
      <h3>Nahrajte váš audio súbor</h3>
      <p>Podporujeme MP3, WAV, OGG, FLAC (max. 30MB)</p>
      <input type="file" ref="fileInput" hidden @change="handleFile" accept="audio/*" />
    </div>

    <div v-else class="processor-view reveal">
      <div class="main-column">
        <div class="player-card glass">
          <div class="wave-visualizer-container">
            <div class="wave-bars">
              <div 
                v-for="i in 60" 
                :key="i" 
                class="wave-bar" 
                :style="{ height: waveData[i-1] + '%', transitionDelay: (i * 10) + 'ms' }"
              ></div>
            </div>
          </div>
          <div class="audio-meta">
            <div class="info">
              <strong>{{ file.name }}</strong>
              <span>{{ (file.size / 1024 / 1024).toFixed(2) }} MB • {{ targetFormat.toUpperCase() }}</span>
            </div>
            <button class="btn-reset" @click="reset">Zmeniť súbor</button>
          </div>
        </div>
      </div>

      <div class="pro-settings glass">
        <div class="header">
          <h3>Pro Nastavenia</h3>
          <PhGearSix :size="20" weight="fill" />
        </div>

        <div class="group">
          <label>Cieľový Formát</label>
          <div class="format-grid">
            <button 
              v-for="f in ['MP3', 'WAV', 'M4A', 'FLAC']" 
              :key="f"
              class="fmt-pill"
              :class="{ active: targetFormat === f.toLowerCase() }"
              @click="targetFormat = f.toLowerCase()"
            >{{ f }}</button>
          </div>
        </div>

        <div class="group">
          <label>Bitrate (Kvalita)</label>
          <select v-model="bitrate" class="pro-select">
            <option value="320">320 kbps (Insane quality)</option>
            <option value="256">256 kbps (High quality)</option>
            <option value="192">192 kbps (Standard)</option>
            <option value="128">128 kbps (Mobile/Small)</option>
          </select>
        </div>

        <div class="group">
          <label>Audio Kanály</label>
          <div class="toggle-row">
            <button 
              class="toggle-btn" 
              :class="{ active: channels === 'stereo' }"
              @click="channels = 'stereo'"
            >Stereo</button>
            <button 
              class="toggle-btn"
              :class="{ active: channels === 'mono' }"
              @click="channels = 'mono'"
            >Mono</button>
          </div>
        </div>

        <button class="btn-action clickable" :disabled="processing" @click="processAudio">
          <PhActivity v-if="!processing" :size="20" weight="bold" />
          <PhCircleNotch v-else :size="20" class="spin" />
          {{ processing ? 'Spracúvam zvuk...' : 'Spustiť spracovanie' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  PhMusicNotes, PhGearSix, PhActivity, PhCircleNotch 
} from '@phosphor-icons/vue'

const file = ref(null)
const fileInput = ref(null)
const processing = ref(false)
const targetFormat = ref('mp3')
const bitrate = ref('320')
const channels = ref('stereo')
const waveData = ref(new Array(60).fill(10))

const triggerUpload = () => fileInput.value.click()

const handleFile = (e) => {
  const f = e.target.files[0]
  if (f) {
    file.value = f
    generateMockWave()
  }
}

const generateMockWave = () => {
  waveData.value = waveData.value.map(() => Math.random() * 80 + 20)
}

const reset = () => {
  file.value = null
  waveData.value = new Array(60).fill(10)
}

const processAudio = () => {
  processing.value = true
  // Mocking heavy audio processing
  const interval = setInterval(generateMockWave, 100)
  
  setTimeout(() => {
    clearInterval(interval)
    processing.value = false
    alert(`Audio bolo úspešne spracované do formátu ${targetFormat.value.toUpperCase()} (${bitrate.value} kbps). Sťahovanie sa spustí automaticky.`)
  }, 3000)
}

onMounted(() => {
  // Static animation start
  setInterval(() => {
    if (!processing.value) {
      waveData.value = waveData.value.map(v => Math.max(10, v + (Math.random() * 10 - 5)))
    }
  }, 200)
})
</script>

<style scoped>
.audio-engine { width: 100%; }

.upload-zone {
  border: 2px dashed var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 6rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s;
}

.upload-zone:hover {
  border-color: var(--accent-gold);
  background: rgba(197, 169, 106, 0.05);
}

.processor-view {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
}

.player-card {
  padding: 2.5rem;
  border-radius: var(--radius-md);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.wave-visualizer-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.3);
  border-radius: var(--radius-sm);
  padding: 0 1rem;
}

.wave-bars {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 100%;
  width: 100%;
}

.wave-bar {
  flex: 1;
  background: var(--accent-gold);
  border-radius: 4px;
  min-height: 4px;
  transition: height 0.2s ease-out;
}

.audio-meta {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info { display: flex; flex-direction: column; gap: 4px; }
.info strong { font-size: 1.1rem; color: var(--text-primary); }
.info span { font-size: 0.8rem; color: var(--text-muted); }

.btn-reset {
  background: var(--bg-soft);
  color: var(--text-secondary);
  border: 1px solid var(--border-dim);
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
}

.pro-settings {
  padding: 2rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--accent-gold);
}

.group { display: flex; flex-direction: column; gap: 1rem; }
.group label {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
}

.format-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.fmt-pill {
  padding: 0.8rem;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  color: var(--text-muted);
  border-radius: 8px;
  font-weight: 700;
  transition: all 0.2s;
}

.fmt-pill.active {
  background: var(--accent-gold);
  color: var(--bg-deep);
  border-color: var(--accent-gold);
}

.pro-select {
  padding: 1rem;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  color: var(--text-primary);
  border-radius: 8px;
  font-weight: 600;
  outline: none;
}

.toggle-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--bg-deep);
  padding: 0.25rem;
  border-radius: 8px;
}

.toggle-btn {
  padding: 0.6rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 6px;
  font-weight: 700;
}

.toggle-btn.active {
  background: var(--bg-soft);
  color: var(--accent-gold);
}

.btn-action {
  margin-top: 1rem;
  padding: 1.25rem;
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

.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .processor-view { grid-template-columns: 1fr; }
}
</style>
