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

      <!-- Text Enhancer -->
      <div v-else-if="tool.id === 'ai-text-smarter'" class="text-enhancer">
        <div class="io-grid">
          <textarea v-model="input" placeholder="Vložte text, ktorý chcete upraviť pre AI..."></textarea>
          <div class="actions">
            <button class="btn-main clickable" @click="processText('context')">Pridať Kontext</button>
            <button class="btn-main clickable" @click="processText('simplify')">Zjednodušiť</button>
            <button class="btn-main clickable" @click="processText('bullets')">Na body</button>
          </div>
        </div>
        <textarea v-model="output" readonly class="glass mt-1" placeholder="Výsledok..."></textarea>
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
.ai-engine { padding: 3rem; border-radius: var(--radius-lg); width: 100%; max-width: 800px; }
textarea { 
  width: 100%; min-height: 150px; background: var(--bg-deep); border: 1px solid var(--border-dim);
  padding: 1.5rem; color: var(--text-primary); border-radius: 12px; outline: none; font-size: 1.1rem;
}
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; padding: 1.5rem; margin: 1.5rem 0; }
.setting { display: flex; flex-direction: column; gap: 0.5rem; }
.setting label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
select { background: var(--bg-deep); border: 1px solid var(--border-dim); padding: 0.8rem; border-radius: 8px; color: var(--text-primary); }

.result-area { margin-top: 1.5rem; padding: 2rem; border: 1px solid var(--accent-gold); position: relative; }
.result-header { display: flex; justify-content: space-between; margin-bottom: 1rem; color: var(--text-muted); font-size: 0.9rem; }
.prompt-text { font-family: monospace; font-size: 1.2rem; color: var(--accent-gold); line-height: 1.6; }

.sentiment-meter { margin-top: 2rem; padding: 2rem; text-align: center; }
.emoji-display { font-size: 4rem; margin-bottom: 1rem; }
.sentiment-label { font-size: 1.5rem; font-weight: 800; text-transform: uppercase; }

.io-grid { display: flex; flex-direction: column; gap: 1rem; }
.actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.btn-main { background: var(--bg-soft); border: 1px solid var(--border-dim); padding: 1rem; border-radius: 8px; color: var(--text-primary); font-weight: 700; }
.btn-main:hover { border-color: var(--accent-gold); color: var(--accent-gold); }
.mt-1 { margin-top: 1.5rem; }
.copy-btn { background: var(--accent-gold); color: var(--bg-deep); border: none; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
</style>
