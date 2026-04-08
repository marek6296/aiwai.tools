<template>
  <ToolWrapper 
    v-if="tool"
    :title="tool.name" 
    :description="tool.description"
    :icon="toolIcon"
    :related="relatedTools"
  >
    <div class="engine-container">
      <!-- Different engines based on tool type -->
      <component 
        v-if="isImplemented"
        :is="engineComponent" 
        :tool="tool" 
      />
      
      <!-- Placeholder for unimplemented tools -->
      <div v-else class="coming-soon glass">
        <PhHourglass :size="64" weight="duotone" class="pulsate" />
        <h2>Pracujeme na tom!</h2>
        <p>Nástroj <strong>{{ tool.name }}</strong> bude čoskoro dostupný v plnej kvalite.</p>
        <router-link to="/" class="btn-back clickable">Späť na domov</router-link>
      </div>
    </div>
  </ToolWrapper>
  
  <div v-else class="not-found container">
    <h1>Nástroj nenájdený</h1>
    <router-link to="/">Späť na domov</router-link>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '../store/toolStore'
import ToolWrapper from '../components/layout/ToolWrapper.vue'
import VideoDownloader from '../components/engines/VideoDownloader.vue'
import TextEngine from '../components/engines/TextEngine.vue'
import MultimediaEngine from '../components/engines/MultimediaEngine.vue'
import {
  PhHourglass, PhFilePdf, PhImage, PhCode, PhMegaphone,
  PhTextT, PhCalculator, PhRobot, PhFirstAid, PhGameController,
  PhTrendUp, PhAirplaneTilt, PhGraduationCap, PhWifiHigh
} from '@phosphor-icons/vue'

const route = useRoute()

const tool = computed(() => {
  const cat = store.categories.find(c => c.id === route.params.categoryId)
  return cat?.tools.find(t => t.id === route.params.toolId)
})

const toolIcon = computed(() => {
  const icons = {
    media:     PhFilePdf,
    design:    PhImage,
    text:      PhTextT,
    ai:        PhRobot,
    dev:       PhCode,
    marketing: PhMegaphone,
    finance:   PhTrendUp,
    lifestyle: PhFirstAid,
    fun:       PhGameController,
    travel:    PhAirplaneTilt,
    edu:       PhGraduationCap,
    internet:  PhWifiHigh,
  }
  return icons[route.params.categoryId] || PhTextT
})

const isImplemented = computed(() => !!engineComponent.value)

// Tool-ID sets per engine (for merged categories)
const PDF_TOOLS     = new Set(['pdf-word','pdf-merge','pdf-split','pdf-compress','pdf-lock'])
const AUDIO_TOOLS   = new Set(['mp3-wav','wav-mp3','audio-trim','audio-join','vol-boost'])
const VIDEO_TOOLS   = new Set(['mp4-avi','mov-mp4','video-gif','mp4-mp3','video-compress'])
const IMG_TOOLS     = new Set(['img-compress','img-upscale','img-remove-bg','png-jpg','img-to-webp','img-to-base64'])
const UI_TOOLS      = new Set(['color-conv','gradient-gen','glass-gen','shadow-gen','contrast-checker','palette-gen'])
const TEXT_TOOLS    = new Set(['word-counter','case-converter','lorem-ipsum','duplicate-remover','list-sorter','diff-checker'])
const WRITING_TOOLS = new Set(['ig-caption','reel-ideas','bio-link','text-expander','passive-active'])
const NET_TOOLS     = new Set(['ip-lookup','dns-lookup','port-scanner','subnet-calc','speed-test'])
const TECH_TOOLS    = new Set(['htaccess-gen','nginx-config','ssh-keygen','ssl-checker'])
const CALC_TOOLS    = new Set(['loan-calc','compound-interest','tip-calc','age-calc','vat-calc','percentage-calc'])
const FIN_TOOLS     = new Set(['retirement-calc','inflation-impact','roi-calc','margin-calc'])
const LAW_TOOLS     = new Set(['privacy-gen','tos-gen','invoice-mini'])
const HEALTH_TOOLS  = new Set(['bmr-calc','water-goal','ideal-weight','calorie-burn','bmi-calc'])
const HOME_TOOLS    = new Set(['kitchen-conv','washing-sym','bac-calc','oven-temp'])
const SCI_TOOLS     = new Set(['morse-code','binary-base','periodic-table','unit-pro'])
const TRAVEL_TOOLS  = new Set(['currency-conv','world-clock','flight-dist','foreign-phrases','travel-budget','baggage-size'])
const EDU_TOOLS     = new Set(['citation-gen','gpa-calc','flashcard-maker','equation-solver','flashcard-quiz'])
const FUN_TOOLS     = new Set(['wheel-fortune','spin-bottle','multi-dice','dice-roll','coin-flip','score-keeper','rps-game','truth-dare','card-picker','random-picker'])
const PROD_TOOLS    = new Set(['pomodoro','time-conv','binary-clock'])
const MKT_TOOLS     = new Set(['utm-builder','og-preview','li-post-gen','email-subject-test','qr-gen','meta-tags','sitemap-helper','robots-gen','keyword-research'])
const SEC_TOOLS     = new Set(['pass-gen','md5-hash','sha256-hash','uuid-gen','base64','html-entity','json-ts','url-parser','regex-tester','cron-helper','json-format','jwt-decoder','markdown-html','unix-timestamp','css-minify','js-minify','graphql-play'])

const engineComponent = computed(() => {
  if (!tool.value) return null
  const id = tool.value.id

  // High-fidelity standalone tools
  if (id === 'word-counter') return defineAsyncComponent(() => import('./tools/WordCounter.vue'))
  if (id === 'json-format')  return defineAsyncComponent(() => import('./tools/JSONFormatter.vue'))

  // Downloaders
  if (id.includes('-down'))  return VideoDownloader

  // media category
  if (PDF_TOOLS.has(id))     return defineAsyncComponent(() => import('../components/engines/PDFEngine.vue'))
  if (AUDIO_TOOLS.has(id))   return defineAsyncComponent(() => import('../components/engines/AudioEngine.vue'))
  if (VIDEO_TOOLS.has(id))   return MultimediaEngine

  // design category
  if (IMG_TOOLS.has(id))     return MultimediaEngine
  if (UI_TOOLS.has(id))      return defineAsyncComponent(() => import('../components/engines/CreativeEngine.vue'))

  // text category
  if (TEXT_TOOLS.has(id))    return TextEngine
  if (WRITING_TOOLS.has(id)) return defineAsyncComponent(() => import('../components/engines/WritingEngine.vue'))

  // ai category
  if (route.params.categoryId === 'ai') return defineAsyncComponent(() => import('../components/engines/AIEngine.vue'))

  // dev category
  if (NET_TOOLS.has(id))     return defineAsyncComponent(() => import('../components/engines/NetworkEngine.vue'))
  if (TECH_TOOLS.has(id))    return defineAsyncComponent(() => import('../components/engines/TechEngine.vue'))
  if (SEC_TOOLS.has(id))     return defineAsyncComponent(() => import('../components/engines/SecurityEngine.vue'))

  // marketing category
  if (MKT_TOOLS.has(id))     return defineAsyncComponent(() => import('../components/engines/MarketingEngine.vue'))

  // finance category
  if (CALC_TOOLS.has(id))    return defineAsyncComponent(() => import('../components/engines/CalcEngine.vue'))
  if (FIN_TOOLS.has(id))     return defineAsyncComponent(() => import('../components/engines/FinanceEngine.vue'))
  if (LAW_TOOLS.has(id))     return defineAsyncComponent(() => import('../components/engines/BusinessEngine.vue'))

  // lifestyle category
  if (HEALTH_TOOLS.has(id))  return defineAsyncComponent(() => import('../components/engines/HealthEngine.vue'))
  if (HOME_TOOLS.has(id))    return defineAsyncComponent(() => import('../components/engines/HomeEngine.vue'))
  if (SCI_TOOLS.has(id))     return defineAsyncComponent(() => import('../components/engines/ScienceEngine.vue'))

  // travel & edu categories
  if (TRAVEL_TOOLS.has(id))  return defineAsyncComponent(() => import('../components/engines/TravelEngine.vue'))
  if (EDU_TOOLS.has(id))     return defineAsyncComponent(() => import('../components/engines/ScienceEngine.vue'))

  // internet & web category
  if (route.params.categoryId === 'internet') return defineAsyncComponent(() => import('../components/engines/NetworkEngine.vue'))

  // fun category
  if (FUN_TOOLS.has(id))     return defineAsyncComponent(() => import('../components/engines/GamingEngine.vue'))
  if (PROD_TOOLS.has(id))    return defineAsyncComponent(() => import('../components/engines/ProductivityEngine.vue'))

  return null
})

const relatedTools = computed(() => {
  if (!tool.value) return []
  const cat = store.categories.find(c => c.id === route.params.categoryId)
  if (!cat) return []
  
  return cat.tools
    .filter(t => t.id !== tool.value.id)
    .slice(0, 3)
    .map(t => ({ 
      name: t.name, 
      icon: toolIcon.value,
      to: `/${cat.id}/${t.id}`
    }))
})
</script>

<style scoped>
.engine-container {
  min-height: 800px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 0;
  width: 100%;
}

.engine-container > :first-child {
  width: 1000px;
  min-height: 700px;
  flex-shrink: 0;
}

.coming-soon {
  text-align: center;
  padding: 4rem;
  border-radius: var(--radius-lg);
  max-width: 500px;
  border: 1px solid var(--border-soft);
}

.pulsate {
  color: var(--accent-gold);
  margin-bottom: 2rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

.btn-back {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.8rem 1.5rem;
  background: var(--accent-gold);
  color: var(--bg-deep);
  border-radius: var(--radius-md);
  font-weight: 700;
  text-decoration: none;
}

.not-found {
  padding-top: 20vh;
  text-align: center;
}
</style>
