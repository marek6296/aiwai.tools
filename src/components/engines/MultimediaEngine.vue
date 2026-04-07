<template>
  <div class="multimedia-engine">
    <div v-if="!file" class="upload-zone glass clickable" @click="triggerUpload" @dragover.prevent @drop.prevent="handleDrop">
      <PhCloudArrowUp :size="64" weight="duotone" />
      <h3>Nahrajte váš obrázok</h3>
      <p>Technológia AIWai podporuje JPG, PNG a WebP do 50MB.</p>
      <input type="file" ref="fileInput" hidden @change="handleFile" accept="image/*" />
    </div>

    <div v-else class="processor-view reveal">
      <!-- Main Preview -->
      <div class="preview-column">
        <div class="preview-card glass">
          <div class="preview-image">
            <img :src="previewUrl" alt="Preview" ref="previewImg" />
          </div>
          <div class="file-info-bar">
            <div class="meta">
              <strong>{{ file.name }}</strong>
              <span>{{ (file.size / 1024).toFixed(1) }} KB • {{ originalWidth }}x{{ originalHeight }} px</span>
            </div>
            <button class="btn-clear" @click="reset">Zrušiť a vybrať iný</button>
          </div>
        </div>
      </div>

      <!-- Controls Sidebar -->
      <div class="options-sidebar glass">
        <div class="sidebar-header">
          <h3>Nastavenia Exportu</h3>
          <span class="pro-badge">V2.0 PRO</span>
        </div>
        
        <div class="option-group">
          <label>Cieľový Formát</label>
          <div class="format-toggle">
            <button 
              v-for="f in ['JPG', 'PNG', 'WebP']" 
              :key="f"
              class="fmt-btn"
              :class="{ active: targetFormat === f.toLowerCase() }"
              @click="targetFormat = f.toLowerCase()"
            >{{ f }}</button>
          </div>
        </div>

        <div v-if="targetFormat !== 'png'" class="option-group">
          <div class="label-row">
            <label>Kvalita (Kompresia)</label>
            <span>{{ quality }}%</span>
          </div>
          <input type="range" v-model="quality" min="1" max="100" class="slider" />
        </div>

        <div class="option-group">
          <label>Zmena Rozmerov</label>
          <div class="dimension-inputs">
            <div class="input-box">
              <input type="number" v-model="width" @input="handleWidthInput" />
              <span>Šírka (px)</span>
            </div>
            <PhArrowsLeftRight :size="16" class="link-icon" />
            <div class="input-box">
              <input type="number" v-model="height" @input="handleHeightInput" />
              <span>Výška (px)</span>
            </div>
          </div>
          <p class="resize-hint">Pomer strán je automaticky zachovaný.</p>
        </div>

        <button class="btn-process clickable" :disabled="processing" @click="processImage">
          <PhSparkle v-if="!processing" :size="20" />
          <PhCircleNotch v-else :size="20" class="spin" />
          {{ processing ? 'Spracúvam...' : 'Spracovať a Stiahnuť' }}
        </button>
      </div>
    </div>

    <canvas ref="canvasRef" hidden></canvas>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { 
  PhCloudArrowUp, PhSparkle, PhCircleNotch, 
  PhArrowsLeftRight 
} from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

const file = ref(null)
const previewUrl = ref('')
const fileInput = ref(null)
const canvasRef = ref(null)
const previewImg = ref(null)

const targetFormat = ref('jpg')
const quality = ref(85)
const width = ref(0)
const height = ref(0)
const originalWidth = ref(0)
const originalHeight = ref(0)
const aspectRatio = ref(1)
const processing = ref(false)

const triggerUpload = () => fileInput.value.click()

const handleFile = (e) => {
  const f = e.target.files[0]
  if (f) initFile(f)
}

const handleDrop = (e) => {
  const f = e.dataTransfer.files[0]
  if (f && f.type.startsWith('image/')) initFile(f)
}

const initFile = (f) => {
  file.value = f
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(f)
  
  const img = new Image()
  img.onload = () => {
    originalWidth.value = img.width
    originalHeight.value = img.height
    width.value = img.width
    height.value = img.height
    aspectRatio.value = img.width / img.height
  }
  img.src = previewUrl.value
}

const handleWidthInput = () => {
  height.value = Math.round(width.value / aspectRatio.value)
}

const handleHeightInput = () => {
  width.value = Math.round(height.value * aspectRatio.value)
}

const reset = () => {
  file.value = null
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
}

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

const processImage = async () => {
  processing.value = true
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const img = new Image()
  
  img.onload = () => {
    canvas.width = width.value
    canvas.height = height.value
    
    // Draw and apply optional filter
    ctx.drawImage(img, 0, 0, width.value, height.value)
    
    if (props.tool.id === 'img-grayscale') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        data[i] = avg
        data[i + 1] = avg
        data[i + 2] = avg
      }
      ctx.putImageData(imageData, 0, 0)
    }
    
    const mime = targetFormat.value === 'jpg' ? 'image/jpeg' : `image/${targetFormat.value}`
    const resultUrl = canvas.toDataURL(mime, quality.value / 100)
    
    const link = document.createElement('a')
    const baseName = file.value.name.substring(0, file.value.name.lastIndexOf('.'))
    link.download = `${baseName}-aiwai.${targetFormat.value}`
    link.href = resultUrl
    link.click()
    
    processing.value = false
  }
  
  img.src = previewUrl.value
}
</script>

<style scoped>
.multimedia-engine { width: 100%; }

.upload-zone {
  border: 2px dashed var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 6rem 2rem;
  text-align: center;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.upload-zone:hover {
  border-color: var(--accent-gold);
  background: rgba(197, 169, 106, 0.05);
}

.processor-view {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2.5rem;
}

.preview-card {
  padding: 1.5rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.preview-image {
  width: 100%;
  aspect-ratio: 4/3;
  background: var(--bg-deep);
  border-radius: var(--radius-sm);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.file-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta { display: flex; flex-direction: column; gap: 2px; }
.meta strong { font-size: 1rem; color: var(--text-primary); }
.meta span { font-size: 0.8rem; color: var(--text-muted); }

.btn-clear {
  padding: 0.5rem 1rem;
  background: rgba(231, 76, 60, 0.1);
  color: #ff7675;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  border: none;
}

.options-sidebar {
  padding: 2rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.pro-badge {
  font-size: 0.65rem;
  padding: 0.2rem 0.5rem;
  background: var(--accent-gold);
  color: var(--bg-deep);
  border-radius: 4px;
  font-weight: 800;
}

.option-group { display: flex; flex-direction: column; gap: 1rem; }
.option-group label {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
}

.format-toggle {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  background: var(--bg-deep);
  padding: 0.25rem;
  border-radius: 8px;
}

.fmt-btn {
  padding: 0.6rem;
  background: transparent;
  border: none;
  color: var(--text-muted);
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.fmt-btn.active {
  background: var(--bg-soft);
  color: var(--accent-gold);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.label-row { display: flex; justify-content: space-between; align-items: center; }
.label-row span { color: var(--accent-gold); font-weight: 800; }

.slider {
  width: 100%;
  appearance: none;
  height: 6px;
  background: var(--bg-deep);
  border-radius: 3px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--accent-gold);
  border-radius: 50%;
  cursor: pointer;
}

.dimension-inputs {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.input-box { flex: 1; }
.input-box input {
  width: 100%;
  padding: 0.8rem;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: 6px;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 0.9rem;
  text-align: center;
}
.input-box span {
  display: block;
  font-size: 0.65rem;
  text-align: center;
  margin-top: 0.4rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.link-icon { color: var(--text-muted); opacity: 0.5; }
.resize-hint { font-size: 0.75rem; color: var(--text-muted); font-style: italic; }

.btn-process {
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

.btn-process:disabled { opacity: 0.5; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .processor-view { grid-template-columns: 1fr; }
}
</style>
