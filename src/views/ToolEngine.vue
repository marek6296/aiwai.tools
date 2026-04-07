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
  PhHourglass, PhFilePdf, PhImage, PhVideo, PhMusicNotes, 
  PhTextT, PhCalculator, PhCode, PhShareNetwork, PhTimer, 
  PhMegaphone, PhPalette, PhLockKey, PhRuler, PhRobot,
  PhFirstAid, PhFlask, PhGlobe, PhBriefcase, PhHouse,
  PhPencilLine, PhGameController, PhTrendUp, PhTerminalWindow
} from '@phosphor-icons/vue'

const route = useRoute()

const tool = computed(() => {
  const cat = store.categories.find(c => c.id === route.params.categoryId)
  return cat?.tools.find(t => t.id === route.params.toolId)
})

const toolIcon = computed(() => {
  const icons = {
    pdf: PhFilePdf,
    img: PhImage,
    video: PhVideo,
    audio: PhMusicNotes,
    text: PhTextT,
    calc: PhCalculator,
    unit: PhRuler,
    dev: PhCode,
    security: PhLockKey,
    marketing: PhMegaphone,
    ui: PhPalette,
    productivity: PhTimer,
    social: PhShareNetwork,
    ai: PhRobot,
    health: PhFirstAid,
    sci: PhFlask,
    net: PhGlobe,
    law: PhBriefcase,
    home: PhHouse,
    writing: PhPencilLine,
    fun: PhGameController,
    "finance-pro": PhTrendUp,
    "tech-adv": PhTerminalWindow
  }
  return icons[route.params.categoryId] || PhTextT
})

const isImplemented = computed(() => {
  return !!engineComponent.value
})

const engineComponent = computed(() => {
  if (!tool.value) return null
  
  const catId = route.params.categoryId
  
  // Specific High-Fidelity Tools
  if (tool.value.id === 'word-counter') return defineAsyncComponent(() => import('./tools/WordCounter.vue'))
  if (tool.value.id === 'bmi-calc') return defineAsyncComponent(() => import('../components/engines/HealthEngine.vue'))
  if (tool.value.id === 'json-format') return defineAsyncComponent(() => import('./tools/JSONFormatter.vue'))

  // Engine-based Tools
  if (tool.value.id.includes('-down')) return VideoDownloader
  if (catId === 'pdf') return defineAsyncComponent(() => import('../components/engines/PDFEngine.vue'))
  if (catId === 'text') return TextEngine
  if (catId === 'img') return MultimediaEngine
  if (catId === 'unit') return defineAsyncComponent(() => import('../components/engines/UnitEngine.vue'))
  if (catId === 'security' || catId === 'dev') return defineAsyncComponent(() => import('../components/engines/SecurityEngine.vue'))
  if (catId === 'productivity') return defineAsyncComponent(() => import('../components/engines/ProductivityEngine.vue'))
  if (catId === 'audio') return defineAsyncComponent(() => import('../components/engines/AudioEngine.vue'))
  if (catId === 'calc' || catId === 'finance') return defineAsyncComponent(() => import('../components/engines/CalcEngine.vue'))
  if (catId === 'ui') return defineAsyncComponent(() => import('../components/engines/CreativeEngine.vue'))
  if (catId === 'marketing' || catId === 'social' || tool.value.id === 'yt-thumb') return defineAsyncComponent(() => import('../components/engines/MarketingEngine.vue'))
  if (catId === 'ai') return defineAsyncComponent(() => import('../components/engines/AIEngine.vue'))
  if (catId === 'health') return defineAsyncComponent(() => import('../components/engines/HealthEngine.vue'))
  if (catId === 'sci') return defineAsyncComponent(() => import('../components/engines/ScienceEngine.vue'))
  if (catId === 'net') return defineAsyncComponent(() => import('../components/engines/NetworkEngine.vue'))
  if (catId === 'law') return defineAsyncComponent(() => import('../components/engines/BusinessEngine.vue'))
  if (catId === 'home') return defineAsyncComponent(() => import('../components/engines/HomeEngine.vue'))
  if (catId === 'writing') return defineAsyncComponent(() => import('../components/engines/WritingEngine.vue'))
  if (catId === 'fun') return defineAsyncComponent(() => import('../components/engines/GamingEngine.vue'))
  if (catId === 'finance-pro') return defineAsyncComponent(() => import('../components/engines/FinanceEngine.vue'))
  if (catId === 'tech-adv') return defineAsyncComponent(() => import('../components/engines/TechEngine.vue'))
  if (['data', 'seo'].includes(catId)) return TextEngine
  
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
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
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
