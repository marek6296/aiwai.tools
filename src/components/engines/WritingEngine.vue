<template>
  <div class="writing-engine glass">
    <div class="engine-ui">
      <!-- IG Caption Master -->
      <div v-if="tool.id === 'ig-caption'" class="writing-tool">
        <label>O čom je váš príspevok?</label>
        <div class="input-panel glass">
          <input type="text" v-model="input" @input="generateCaptions" placeholder="napr. káva v office, nový projekt..." />
        </div>
        <div class="captions-grid mt-2" v-if="captions.length">
          <div v-for="c in captions" :key="c" class="caption-card glass clickable reveal" @click="copy(c)">
            <div class="caption-text">{{ c }}</div>
            <PhCopy :size="18" class="copy-icon gold" />
          </div>
        </div>
      </div>

      <!-- Reel Ideas -->
      <div v-else-if="tool.id === 'reel-ideas'" class="writing-tool">
        <div class="category-selector glass">
          <button v-for="cat in reelCats" :key="cat" class="cat-btn clickable" :class="{ active: selectedCat === cat }" @click="selectedCat = cat">
            {{ cat }}
          </button>
        </div>
        <div class="ideas-panel glass mt-2 reveal" v-if="reelIdeas[selectedCat]">
          <div v-for="idea in reelIdeas[selectedCat]" :key="idea" class="idea-item">
            <PhSparkle :size="20" class="gold" />
            <p>{{ idea }}</p>
          </div>
        </div>
      </div>

      <!-- Bio Link Builder -->
      <div v-else-if="tool.id === 'bio-link'" class="bio-tool">
        <div class="bio-settings">
          <label>Meno / @Handle</label>
          <input type="text" v-model="bioName" placeholder="@moje-meno" />
          <label>Odkazy (Text | URL)</label>
          <textarea v-model="bioLinks" placeholder="Webstránka | aiwai.sk&#10;Instagram | ig.com..."></textarea>
        </div>
        <div class="bio-preview-container glass mt-1">
          <div class="phone-frame glass">
            <div class="phone-content">
              <div class="avatar glass">AI</div>
              <div class="name-tag">{{ bioName || '@vas-handle' }}</div>
              <div class="links-stack">
                <a v-for="l in parsedLinks" :key="l.url" :href="l.url" target="_blank" class="bio-btn glass reveal">{{ l.text }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Passive/Active Voice Changer -->
      <div v-else-if="tool.id === 'passive-active'" class="writing-tool">
        <label>Vložte text pre analýzu</label>
        <textarea v-model="input" placeholder="Napíšte vetu v pasívnom hlase (napr. 'Kniha bola napísaná autorom.')..."></textarea>
        <div class="voice-results glass mt-2" v-if="input">
          <div class="voice-tip">
            <strong>Tip na zlepšenie:</strong>
            <p>Hľadajte spojenia ako "<em>bol/bola + príčastie</em>" a preformulujte vetu tak, aby podmiet vykonával činnosť.</p>
          </div>
          <div class="voice-stats">
            <div class="stat-item">
              <span>Počet slov:</span>
              <strong>{{ input.trim().split(/\s+/).length }}</strong>
            </div>
            <div class="stat-item">
              <span>Možné pasívne tvary:</span>
              <strong :style="{ color: passiveCount > 0 ? '#ff4757' : '#2ed573' }">{{ passiveCount }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Text Expander -->
      <div v-else-if="tool.id === 'text-expander'" class="writing-tool">
        <div class="expander-grid">
          <div class="field">
            <label>Skratka</label>
            <input type="text" v-model="val1" placeholder="napr. @@" />
          </div>
          <div class="field">
            <label>Výsledný text</label>
            <input type="text" v-model="val2" placeholder="napr. moj@email.sk" />
          </div>
        </div>
        <div class="test-area glass mt-2">
          <label>Vyskúšajte (napíšte skratku):</label>
          <textarea v-model="input" @input="expandText" placeholder="Píšte sem..."></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { PhCopy, PhSparkle } from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

const input = ref('')
const val1 = ref('')
const val2 = ref('')
const captions = ref([])
const selectedCat = ref('Tech')
const bioName = ref('')
const bioLinks = ref('')

const passiveCount = computed(() => {
  const passivePatterns = /\b(bol|bola|bolo|boli|je|sú|bude|budú)\s+(napísaný|napísaná|urobený|urobená|vytvorený|vytvorená|odoslaný|odoslaná|prijatý|prijatá|hotový|hotová|daný|daná|spracovaný|spracovaná|zobrazený|zobrazená|vymazaný|vymazaná)\b/gi
  const matches = input.value.match(passivePatterns)
  return matches ? matches.length : 0
})

const reelCats = ['Tech', 'Lifestyle', 'Business']
const reelIdeas = reactive({
  Tech: ['Unboxing novinky z AI sveta.', '5 Lifehackov v MacBooku.', 'Ako vyzerá setup pre Dev.'],
  Lifestyle: ['Moja ranná káva a rutina.', 'Tipy na víkendový výlet.', 'Čo mám dnes v taške.'],
  Business: ['Ako začať podnikať s nulou.', '3 knihy ktoré mi zmenili život.', 'Deň v živote CEO.']
})

const parsedLinks = computed(() => {
  return bioLinks.value.split('\n').filter(l => l.includes('|')).map(l => {
    const [text, url] = l.split('|')
    return { text: text.trim(), url: url.trim().startsWith('http') ? url.trim() : 'https://' + url.trim() }
  })
})

const generateCaptions = () => {
  if (!input.value) { captions.value = []; return }
  const base = input.value
  captions.value = [
    `✨ ${base}. Nikdy nebol lepší čas začať! #aiwai #goals`,
    `Monday mood s ${base}. ☕️ Čo hovoríte vy?`,
    `Nový update: ${base}. Sledujte link v bio pre viac informácií! 🚀`,
    `Víkendový vibe a ${base}. ⚡️`
  ]
}

const expandText = () => {
  if (val1.value && val2.value && input.value.includes(val1.value)) {
    input.value = input.value.replace(val1.value, val2.value)
  }
}

const copy = (t) => { navigator.clipboard.writeText(t) }
</script>

<style scoped>
.writing-engine { padding: 4rem; border-radius: 40px; width: 100%; min-height: 100%; }
input, textarea { 
  width: 100%; background: var(--bg-deep); border: 1px solid var(--border-dim);
  padding: 1.25rem; color: var(--text-primary); border-radius: 12px; outline: none; font-size: 1.1rem;
}
textarea { min-height: 120px; resize: none; }

.captions-grid { display: grid; gap: 1rem; }
.caption-card { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border-dim); transition: all 0.3s; }
.caption-card:hover { border-color: var(--accent-gold); transform: scale(1.02); }
.caption-text { flex: 1; font-size: 0.95rem; line-height: 1.5; color: var(--text-secondary); }

.category-selector { display: flex; gap: 1rem; padding: 1rem; justify-content: center; margin-bottom: 1.5rem; }
.cat-btn { padding: 0.6rem 1.5rem; border-radius: 8px; background: var(--bg-soft); border: 1px solid var(--border-dim); color: var(--text-muted); font-weight: 700; transition: all 0.3s; }
.cat-btn.active { color: var(--accent-gold); border-color: var(--accent-gold); }

.idea-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--border-dim); }
.idea-item:last-child { border: none; }

.bio-tool { display: grid; grid-template-columns: 1fr 300px; gap: 3rem; }
.phone-frame { width: 100%; border-radius: 40px; padding: 1.5rem; border: 6px solid var(--border-dim); background: var(--bg-deep); }
.phone-content { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; min-height: 400px; }
.avatar { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.5rem; border: 2px solid var(--accent-gold); color: var(--accent-gold); }
.name-tag { font-weight: 800; font-size: 1.1rem; }
.links-stack { width: 100%; display: flex; flex-direction: column; gap: 0.8rem; }
.bio-btn { padding: 1rem; text-align: center; border-radius: 12px; font-weight: 700; font-size: 0.9rem; text-decoration: none; color: var(--text-primary); transition: all 0.3s; }
.bio-btn:hover { background: var(--accent-gold); color: var(--bg-deep); }

.expander-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; }
label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 0.5rem; display: block; }
.gold { color: var(--accent-gold); }

.voice-results { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
.voice-tip { padding: 1.5rem; background: rgba(197, 169, 106, 0.05); border-left: 3px solid var(--accent-gold); border-radius: 0 8px 8px 0; }
.voice-tip strong { color: var(--accent-gold); display: block; margin-bottom: 0.5rem; }
.voice-tip p { color: var(--text-secondary); line-height: 1.6; }
.voice-stats { display: flex; gap: 2rem; }
.stat-item { display: flex; flex-direction: column; gap: 0.3rem; }
.stat-item span { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; }
.stat-item strong { font-size: 1.5rem; font-weight: 900; }
.mt-2 { margin-top: 1.5rem; }

@media (max-width: 768px) { .bio-tool { grid-template-columns: 1fr; } }
</style>
