<template>
  <div class="ai-engine">

    <!-- ── Universal AI text tool layout ── -->
    <div v-if="tool.id.includes('ai-')" class="tool-layout">

      <!-- Input section -->
      <div class="input-section">
        <label class="field-label">{{ inputLabel }}</label>
        <textarea
          v-model="input"
          :placeholder="inputPlaceholder"
          class="main-textarea"
          :rows="7"
        ></textarea>
      </div>

      <!-- Action bar -->
      <div class="action-bar">
        <template v-if="tool.id === 'ai-text-smarter'">
          <button class="btn-secondary clickable" @click="processText('context')">Pridať kontext</button>
          <button class="btn-secondary clickable" @click="processText('simplify')">Zjednodušiť</button>
          <button class="btn-secondary clickable" @click="processText('bullets')">Na body</button>
        </template>
        <button v-else class="btn-generate clickable" @click="generateAI" :disabled="isGenerating">
          <PhSparkle v-if="!isGenerating" :size="16" weight="fill" />
          <span v-else class="spinner-mini"></span>
          {{ isGenerating ? 'Generujem...' : 'Generovať cez AI' }}
        </button>
      </div>

      <!-- Output section -->
      <transition name="slide-up">
        <div v-if="output || generatedImageUrl" class="output-section">
          <div class="output-header">
            <span class="field-label">Výsledok</span>
            <div class="output-actions">
              <button v-if="output" class="btn-copy clickable" @click="copy(output)">
                <PhCopy :size="14" /> Kopírovať
              </button>
              <a v-if="generatedImageUrl" :href="generatedImageUrl" download="aiwai-image.png" class="btn-copy clickable">
                Stiahnuť obrázok
              </a>
            </div>
          </div>
          <div v-if="generatedImageUrl" class="image-output">
            <img :src="generatedImageUrl" alt="AI Generated" />
          </div>
          <div v-if="output" class="text-output">{{ output }}</div>
        </div>
      </transition>

    </div>

    <!-- ── Prompt enhancer layout ── -->
    <div v-else-if="tool.id.includes('prompt')" class="tool-layout">
      <div class="input-section">
        <label class="field-label">Zadajte základný nápad alebo kľúčové slová</label>
        <textarea v-model="input" @input="enhancePrompt" class="main-textarea" :rows="5" placeholder="napr. mačka v lese, kyberpunkové mesto..."></textarea>
      </div>

      <div class="settings-row">
        <div class="setting-field" v-if="tool.id === 'ai-prompt-mid'">
          <label class="field-label">Pomer strán</label>
          <select v-model="ar" @change="enhancePrompt" class="field-select">
            <option value="16:9">16:9 Kino</option>
            <option value="9:16">9:16 Mobil</option>
            <option value="1:1">1:1 Štvorec</option>
            <option value="3:2">3:2 Foto</option>
          </select>
        </div>
        <div class="setting-field">
          <label class="field-label">Umelecký štýl</label>
          <select v-model="style" @change="enhancePrompt" class="field-select">
            <option value="photorealistic">Fotorealizmus</option>
            <option value="digital-art">Digitálne umenie</option>
            <option value="oil-painting">Olejomaľba</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="minimalist">Minimalizmus</option>
          </select>
        </div>
      </div>

      <transition name="slide-up">
        <div v-if="output" class="output-section">
          <div class="output-header">
            <span class="field-label">Vylepšený prompt</span>
            <button class="btn-copy clickable" @click="copy(output)"><PhCopy :size="14" /> Kopírovať</button>
          </div>
          <div class="text-output">{{ output }}</div>
        </div>
      </transition>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PhCopy, PhSparkle } from '@phosphor-icons/vue'
import { gemini } from '../../lib/ai'

const props = defineProps({ tool: Object })

const input = ref('')
const output = ref('')
const ar = ref('16:9')
const style = ref('photorealistic')
const isGenerating = ref(false)
const generatedImageUrl = ref('')

const inputLabel = computed(() => ({
  'ai-chat':         'Povedzte niečo chatbotovi',
  'ai-blog-gen':     'Téma blogu alebo kľúčové slová',
  'ai-email-writer': 'Komu a o čom má byť email?',
  'ai-product-desc': 'Názov produktu a jeho vlastnosti',
  'ai-translator':   'Text na preklad',
  'ai-grammar':      'Text na kontrolu a štylizáciu',
  'ai-cover-letter': 'Pozícia a vaše skúsenosti',
  'ai-resume-gen':   'Základné údaje pre CV',
  'ai-ad-copy':      'Čo promujeme? (Produkt / Služba)',
  'ai-text-smarter': 'Obsah pre AI vylepšenie',
}[props.tool.id] || 'Vaše zadanie'))

const inputPlaceholder = computed(() => ({
  'ai-blog-gen':     'napr: Budúcnosť AI v roku 2026...',
  'ai-email-writer': 'napr: Žiadosť o dovolenku pre šéfa, formálne...',
  'ai-product-desc': 'napr: Bezdrôtové slúchadlá s potlačením hluku...',
  'ai-cover-letter': 'napr: Junior Frontend Developer v tech firme...',
  'ai-translator':   'Sem napíšte text ktorý chcete preložiť...',
  'ai-grammar':      'Sem vložte text na kontrolu gramatiky a štýlu...',
}[props.tool.id] || 'Sem napíšte vaše zadanie...'))

const generateAI = async () => {
  if (!input.value.trim()) return
  isGenerating.value = true
  output.value = ''
  generatedImageUrl.value = ''
  try {
    const prompt = `Task: ${props.tool.name}\nDescription: ${props.tool.description}\nUser INPUT: "${input.value}"\n\nPlease fulfill this task precisely and in the language of the input.`
    output.value = await gemini.generateText(prompt)
  } catch (err) {
    output.value = `Chyba: ${err.message}`
  } finally {
    isGenerating.value = false
  }
}

const enhancePrompt = () => {
  if (!input.value) { output.value = ''; return }
  const styles = {
    photorealistic: 'highly detailed, 8k resolution, cinematic lighting, shot on 35mm lens',
    'digital-art':  'concept art, vibrant colors, intricate details, trending on artstation',
    'oil-painting': 'textured oil on canvas, expressive brushstrokes, classical masterpiece',
    cyberpunk:      'neon lights, high-tech low-life, rainy aesthetic, futuristic synthwave',
    minimalist:     'clean lines, vast negative space, geometric balance, monochrome',
  }
  output.value = `${input.value}, ${styles[style.value]}, aspect ratio ${ar.value}`
  if (props.tool.id === 'ai-prompt-mid') output.value += ' --v 6.0'
}

const processText = (mode) => {
  if (!input.value) return
  const map = {
    context:  `Analyze the following text and provide deep insights:\n\n"${input.value}"`,
    simplify: `Explain this to a 5-year old:\n\n"${input.value}"`,
    bullets:  `Convert this text into clear bullet points:\n\n"${input.value}"`,
  }
  output.value = map[mode]
}

const copy = (t) => navigator.clipboard.writeText(t)
</script>

<style scoped>
.ai-engine { width: 100%; }

.tool-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Input ── */
.input-section { display: flex; flex-direction: column; gap: 0.6rem; }

.field-label {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.main-textarea {
  width: 100%;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.6;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
  font-family: inherit;
}
.main-textarea:focus { border-color: var(--border-soft); }

/* ── Action bar ── */
.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-generate {
  background: var(--accent-gold);
  color: var(--bg-deep);
  padding: 0.85rem 2rem;
  border-radius: var(--radius-md);
  font-weight: 900;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.25s ease;
  border: none;
  cursor: pointer;
}
.btn-generate:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(197,169,106,0.3); }
.btn-generate:disabled { opacity: 0.55; cursor: wait; }

.btn-secondary {
  background: var(--bg-soft);
  color: var(--text-primary);
  border: 1px solid var(--border-dim);
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover { border-color: var(--border-soft); color: var(--accent-gold); }

/* ── Output ── */
.output-section {
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  background: rgba(197,169,106,0.03);
  overflow: hidden;
}

.output-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--border-dim);
  background: rgba(197,169,106,0.04);
}

.output-actions { display: flex; gap: 0.5rem; }

.btn-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--accent-gold);
  background: rgba(197,169,106,0.1);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}
.btn-copy:hover { background: rgba(197,169,106,0.18); }

.text-output {
  padding: 1.25rem;
  color: var(--text-primary);
  font-size: 0.98rem;
  line-height: 1.8;
  white-space: pre-wrap;
}

.image-output {
  padding: 1.25rem;
  display: flex;
  justify-content: center;
}
.image-output img { max-width: 100%; border-radius: var(--radius-md); }

/* ── Settings row (for prompt tools) ── */
.settings-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.setting-field { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; min-width: 160px; }
.field-select {
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
}

/* ── Spinner ── */
.spinner-mini {
  width: 16px; height: 16px;
  border: 2px solid var(--bg-deep);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Animation ── */
.slide-up-enter-active { transition: all 0.3s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(12px); }
</style>
