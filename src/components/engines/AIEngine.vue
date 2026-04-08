<template>
  <div class="ai-engine glass">
    <div class="engine-ui">
      <!-- Prompt Enhancer Tools -->
      <div v-if="tool.id.includes('prompt')" class="prompt-gen">
        <div class="input-panel">
          <label>Zadajte základný nápad alebo kľúčové slová</label>
          <textarea v-model="input" @input="enhancePrompt" placeholder="napr. mačka v lese, kyberpunkové mesto..."></textarea>
        </div>
        
        <div class="settings-grid glass">
          <div class="setting" v-if="tool.id === 'ai-prompt-mid'">
            <label>Pomer strán</label>
            <select v-model="ar" @change="enhancePrompt">
              <option value="16:9">16:9 (Kino)</option>
              <option value="9:16">9:16 (Mobil)</option>
              <option value="1:1">1:1 (Štvorec)</option>
              <option value="3:2">3:2 (Foto)</option>
            </select>
          </div>
          <div class="setting">
            <label>Umelecký štýl</label>
            <select v-model="style" @change="enhancePrompt">
              <option value="photorealistic">Fotorealizmus</option>
              <option value="digital-art">Digitálne umenie</option>
              <option value="oil-painting">Olejomaľba</option>
              <option value="cyberpunk">Cyberpunk</option>
              <option value="minimalist">Minimalizmus</option>
            </select>
          </div>
        </div>

        <div class="result-area glass reveal" v-if="output">
          <div class="result-header">
            <span>Vylepšený AI Prompt:</span>
            <button class="copy-btn clickable" @click="copy(output)"><PhCopy :size="18" /></button>
          </div>
          <div class="prompt-text">{{ output }}</div>
        </div>
      </div>

      <!-- Sentiment AI -->
      <div v-else-if="tool.id === 'sentiment-ai'" class="sentiment-tool">
        <label>Vložte text pre analýzu emócií</label>
        <textarea v-model="input" @input="analyzeSentiment" placeholder="Napíšte niečo..."></textarea>
        
        <div class="sentiment-meter glass reveal" v-if="input">
          <div class="emoji-display">{{ sentimentEmoji }}</div>
          <div class="sentiment-label" :style="{ color: sentimentColor }">{{ sentimentText }}</div>
        </div>
      </div>

      <!-- Text Enhancer & Universal Writing Engine -->
      <div v-else-if="tool.id === 'ai-text-smarter' || tool.id.includes('ai-')" class="text-enhancer">
        <div class="io-grid">
          <div class="input-header">
            <span class="label">{{ inputLabel }}</span>
          </div>
          <textarea v-model="input" :placeholder="inputPlaceholder"></textarea>
          
          <div class="ai-actions">
            <!-- Specific buttons for smarter text -->
            <template v-if="tool.id === 'ai-text-smarter'">
              <button class="btn-main clickable" @click="processText('context')">Pridať Kontext</button>
              <button class="btn-main clickable" @click="processText('simplify')">Zjednodušiť</button>
              <button class="btn-main clickable" @click="processText('bullets')">Na body</button>
            </template>
            <!-- Universal AI Generate button -->
            <button v-else class="btn-primary clickable" @click="generateAI" :disabled="isGenerating">
              <PhSparkle v-if="!isGenerating" :size="18" weight="fill" />
              <div v-else class="spinner-mini"></div>
              {{ isGenerating ? 'Generujem...' : 'Generovať cez AI' }}
            </button>
          </div>
        </div>

        <div class="result-box glass mt-1 reveal" v-if="output || generatedImageUrl">
          <div class="result-header">
            <span>AI Výsledok:</span>
            <div class="header-actions">
               <button v-if="output" class="copy-small clickable" @click="copy(output)">Kopírovať Text</button>
               <a v-if="generatedImageUrl" :href="generatedImageUrl" download="aiwai-image.png" class="copy-small clickable">Stiahnuť Obrázok</a>
            </div>
          </div>
          <div v-if="generatedImageUrl" class="image-preview-wrap">
             <img :src="generatedImageUrl" alt="AI Generated" class="generated-img" />
          </div>
          <div v-if="output" class="output-content">{{ output }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PhCopy, PhSparkle } from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

const input = ref('')
const output = ref('')
const ar = ref('16:9')
const style = ref('photorealistic')
const sentimentText = ref('Neutrálne')
const sentimentEmoji = ref('😐')
const sentimentColor = ref('#ccc')
const isGenerating = ref(false)

const inputLabel = computed(() => {
  const labels = {
    'ai-chat': 'Povedzte niečo chatbotovi...',
    'ai-blog-gen': 'Téma blogu alebo kľúčové slová',
    'ai-email-writer': 'Komu a o čom má byť email?',
    'ai-product-desc': 'Názov produktu a jeho vlastnosti',
    'ai-translator': 'Text na preklad',
    'ai-grammar': 'Text na kontrolu a štylizáciu',
    'ai-cover-letter': 'Pozícia a vaše skúsenosti',
    'ai-resume-gen': 'Základné údaje pre CV',
    'ai-ad-copy': 'Čo promujeme? (Produkt/Služba)',
    'ai-prompt-lib': 'Hľadať v knižnici promptov...',
    'ai-text-smarter': 'Obsah pre AI vylepšenie'
  }
  return labels[props.tool.id] || 'Vaše zadanie'
})

const inputPlaceholder = computed(() => {
  const placeholders = {
    'ai-blog-gen': 'napr: Budúcnosť AI v roku 2026...',
    'ai-email-writer': 'napr: Žiadosť o dovolenku pre šéfa, formálne...',
    'ai-product-desc': 'napr: Bezdrôtové slúchadlá s potlačením hluku...',
    'ai-cover-letter': 'napr: Junior Frontend Developer v tech firme...',
  }
  return placeholders[props.tool.id] || 'Sem napíšte vaše zadanie...'
})

import { gemini } from '../../lib/ai'

const isImageTool = computed(() => props.tool.id === 'ai-prompt-mid')
const generatedImageUrl = ref('')

const generateAI = async () => {
  if (!input.value) return
  isGenerating.value = true
  output.value = ''
  generatedImageUrl.value = ''
  
  try {
    if (isImageTool.value) {
      // Image Generation
      generatedImageUrl.value = await gemini.generateImage(input.value, ar.value)
    } else {
      // Text Generation
      const prompt = `Task: ${props.tool.name}\nDescription: ${props.tool.description}\nUser INPUT: "${input.value}"\n\nPlease fulfill this task precisely and in the language of the input.`
      output.value = await gemini.generateText(prompt)
    }
  } catch (err) {
    output.value = `CHYBA AI: ${err.message}. Skúste to znova neskôr.`
  } finally {
    isGenerating.value = false
  }
}

const enhancePrompt = () => {
  if (!input.value) { output.value = ''; return }
  let base = input.value
  const styles = {
    photorealistic: "highly detailed, 8k resolution, cinematic lighting, shot on 35mm lens",
    "digital-art": "concept art, vibrant colors, intricate details, trending on artstation",
    "oil-painting": "textured oil on canvas, expressive brushstrokes, classical masterpiece",
    cyberpunk: "neon lights, high-tech low-life, rainy aesthetic, futuristic synthwave",
    minimalist: "clean lines, vast negative space, geometric balance, monochrome"
  }
  
  output.value = `${base}, ${styles[style.value]}, aspect ratio ${ar.value}`
  if (props.tool.id === 'ai-prompt-mid') output.value += ' --v 6.0'
}

const analyzeSentiment = () => {
  const positive = ['skvelé', 'super', 'dobré', 'milujem', 'výborné', 'happy', 'love', 'good', 'awesome']
  const negative = ['zlé', 'neznášam', 'hrozné', 'error', 'nepáči', 'bad', 'hate', 'terrible', 'sad']
  
  const text = input.value.toLowerCase()
  let score = 0
  positive.forEach(w => { if (text.includes(w)) score++ })
  negative.forEach(w => { if (text.includes(w)) score-- })
  
  if (score > 0) {
    sentimentText.value = 'Pozitívne'
    sentimentEmoji.value = '😊'
    sentimentColor.value = '#2ed573'
  } else if (score < 0) {
    sentimentText.value = 'Negatívne'
    sentimentEmoji.value = '☹️'
    sentimentColor.value = '#ff4757'
  } else {
    sentimentText.value = 'Neutrálne'
    sentimentEmoji.value = '😐'
    sentimentColor.value = '#ccc'
  }
}

const processText = (mode) => {
  if (!input.value) return
  if (mode === 'context') output.value = `Analyze the following text and provide deep insights: \n\n"${input.value}"`
  if (mode === 'simplify') output.value = `Explain this to a 5-year old: \n\n"${input.value}"`
  if (mode === 'bullets') output.value = `Convert this text into clear bullet points: \n\n"${input.value}"`
}

const copy = (t) => { navigator.clipboard.writeText(t) }
</script>

<style scoped>
.ai-engine { width: 100%; }
textarea { 
  width: 100%; min-height: 150px; background: var(--bg-deep); border: 1px solid var(--border-dim);
  padding: 1.5rem; color: var(--text-primary); border-radius: 12px; outline: none; font-size: 1.1rem;
}
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; padding: 1.5rem; margin: 1.5rem 0; }
.setting { display: flex; flex-direction: column; gap: 0.5rem; }
.setting label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
select { background: var(--bg-deep); border: 1px solid var(--border-dim); padding: 0.8rem; border-radius: 8px; color: var(--text-primary); }

.input-header { margin-bottom: 0.75rem; }
.label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; }

.ai-actions { margin-top: 1.5rem; display: flex; justify-content: flex-end; }

.btn-primary { 
  background: var(--accent-gold); color: var(--bg-deep); padding: 1rem 2rem; border-radius: 12px;
  font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.75rem;
  transition: all 0.3s ease;
}
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(197, 169, 106, 0.3); }
.btn-primary:disabled { opacity: 0.6; cursor: wait; }

.result-box { margin-top: 2rem; padding: 2rem; border: 1px dashed var(--accent-gold); border-radius: 16px; background: rgba(197, 169, 106, 0.03); }
.copy-small { font-size: 0.7rem; font-weight: 800; color: var(--accent-gold); text-transform: uppercase; background: rgba(197, 169, 106, 0.1); padding: 0.4rem 0.8rem; border-radius: 6px; }

.output-content { margin-top: 1rem; color: var(--text-primary); line-height: 1.8; white-space: pre-wrap; font-size: 1.05rem; }

.image-preview-wrap {
  margin-top: 1.5rem; border-radius: 12px; overflow: hidden;
  background: var(--bg-deep); border: 1px solid var(--border-dim);
  display: flex; align-items: center; justify-content: center;
  min-height: 300px;
}
.generated-img { max-width: 100%; height: auto; display: block; }
.header-actions { display: flex; gap: 0.5rem; }
.copy-small { text-decoration: none; display: inline-block; }

.spinner-mini {
  width: 18px; height: 18px; border: 2px solid var(--bg-deep); border-top-color: transparent; border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.mt-1 { margin-top: 1.5rem; }
.copy-btn { background: var(--accent-gold); color: var(--bg-deep); border: none; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
</style>
