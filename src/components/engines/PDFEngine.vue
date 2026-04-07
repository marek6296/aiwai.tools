<template>
  <div class="pdf-engine">
    <div v-if="!files.length" class="upload-zone glass clickable" @click="triggerUpload">
      <PhFilePdf :size="64" weight="duotone" />
      <h3>Nahrajte PDF dokumenty</h3>
      <p>Maximálna veľkosť súboru: 100 MB</p>
      <input type="file" ref="fileInput" hidden multiple @change="handleFiles" accept=".pdf" />
    </div>

    <div v-else class="processor-view reveal">
      <div class="pdf-stack">
        <div v-for="(f, idx) in files" :key="idx" class="pdf-item glass">
          <div class="pdf-icon-wrapper">
            <PhFilePdf :size="32" weight="fill" />
            <span class="page-count">? str</span>
          </div>
          <div class="pdf-meta">
            <strong>{{ f.name }}</strong>
            <span>{{ (f.size / 1024 / 1024).toFixed(2) }} MB</span>
          </div>
          <button class="btn-remove" @click="removeFile(idx)">✕</button>
        </div>
        
        <button class="btn-add-more glass" @click="triggerUpload">
          <PhPlus :size="24" />
          Pridať ďalší
        </button>
      </div>

      <div class="pro-panel glass">
        <div class="panel-header">
          <h3>Pro Nastavenia PDF</h3>
          <span class="badge">SECURE</span>
        </div>

        <!-- Tool Specific Settings -->
        <div v-if="tool.id === 'pdf-sign' || tool.id === 'pdf-sign-pro'" class="tool-settings">
          <label>Váš digitálny podpis</label>
          <div class="signature-pad glass">
             <p>Kliknutím sem nahrajete naskenovaný podpis</p>
          </div>
        </div>

        <div v-if="tool.id === 'pdf-compress'" class="tool-settings">
          <label>Úroveň kompresie</label>
          <div class="radio-group">
            <div class="radio-box" :class="{ active: compressLevel === 'ext' }" @click="compressLevel = 'ext'">
              <strong>Extrémna</strong>
              <span>Najmenšia veľkosť</span>
            </div>
            <div class="radio-box" :class="{ active: compressLevel === 'rec' }" @click="compressLevel = 'rec'">
              <strong>Odporúčaná</strong>
              <span>Dobrá kvalita</span>
            </div>
          </div>
        </div>

        <div v-if="tool.id === 'pdf-lock'" class="tool-settings">
          <label>Zabezpečiť heslo</label>
          <div class="password-input">
            <PhLockKey :size="20" />
            <input type="password" v-model="pdfPassword" placeholder="Zadajte silné heslo..." />
          </div>
        </div>

        <div class="global-actions">
          <button class="btn-execute clickable" :disabled="processing" @click="processPDF">
            <PhFileArrowDown v-if="!processing" :size="20" weight="bold" />
            <PhCircleNotch v-else :size="20" class="spin" />
            {{ processing ? 'Spracúvam PDF...' : tool.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  PhFilePdf, PhPlus, PhLockKey, PhFileArrowDown, PhCircleNotch 
} from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

const fileInput = ref(null)
const files = ref([])
const processing = ref(false)
const compressLevel = ref('rec')
const pdfPassword = ref('')

const triggerUpload = () => fileInput.value.click()

const handleFiles = (e) => {
  const selected = Array.from(e.target.files)
  files.value = [...files.value, ...selected]
}

const removeFile = (idx) => {
  files.value.splice(idx, 1)
}

const processPDF = () => {
  processing.value = true
  setTimeout(() => {
    processing.value = false
    alert(`Operácia '${props.tool.name}' úspešne dokončená. Váš dokument je pripravený na stiahnutie.`)
    files.value = []
  }, 2500)
}
</script>

<style scoped>
.pdf-engine { width: 100%; }

.upload-zone {
  border: 2px dashed var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 6rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.processor-view {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
}

.pdf-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pdf-item {
  padding: 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.pdf-icon-wrapper {
  position: relative;
  color: #e74c3c;
}

.page-count {
  position: absolute;
  top: -5px;
  right: -10px;
  background: var(--bg-deep);
  font-size: 0.65rem;
  padding: 2px 5px;
  border-radius: 4px;
  border: 1px solid var(--border-dim);
}

.pdf-meta { flex: 1; display: flex; flex-direction: column; }
.pdf-meta strong { font-size: 0.95rem; }
.pdf-meta span { font-size: 0.75rem; color: var(--text-muted); }

.btn-remove {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
}

.btn-add-more {
  padding: 2rem;
  border-radius: 12px;
  border: 2px dashed var(--border-dim);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
}

.pro-panel {
  padding: 2rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  font-size: 0.65rem;
  padding: 0.2rem 0.5rem;
  background: #27ae60;
  color: white;
  border-radius: 4px;
}

.tool-settings { display: flex; flex-direction: column; gap: 1rem; }
.tool-settings label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }

.radio-group { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.radio-box {
  padding: 1rem;
  border: 1px solid var(--border-dim);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.radio-box.active { border-color: var(--accent-gold); background: rgba(197, 169, 106, 0.1); }
.radio-box strong { display: block; font-size: 0.9rem; }
.radio-box span { font-size: 0.7rem; color: var(--text-muted); }

.password-input {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-deep);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-dim);
}

.password-input input {
  background: transparent;
  border: none;
  color: var(--text-primary);
  outline: none;
  width: 100%;
}

.btn-execute {
  width: 100%;
  padding: 1.25rem;
  background: var(--accent-gold);
  color: var(--bg-deep);
  border-radius: var(--radius-md);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .processor-view { grid-template-columns: 1fr; }
}
</style>
