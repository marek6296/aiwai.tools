<template>
  <div class="home">

    <!-- ═══════════════════════════════════════
         HERO
    ═══════════════════════════════════════ -->
    <section class="hero">
      <div class="hero-bg-orb orb-1"></div>
      <div class="hero-bg-orb orb-2"></div>
      <div class="container hero-container">
        <div class="hero-badge">
          <span class="badge-pulse"></span>
          AI Automatizácia Platform
        </div>
        <h1 class="hero-title">
          Automatizuj svoju prácu.<br>
          <span class="gradient-text">Ušetri hodiny každý deň.</span>
        </h1>
        <p class="hero-subtitle">
          Návody, nástroje a hotové workflow pre <strong>n8n</strong>, <strong>Make</strong>,
          <strong>Zapier</strong> a AI agentov. Pre marketérov, freelancerov a podnikateľov.
        </p>
        <div class="hero-actions">
          <router-link to="/ai" class="btn-primary">
            Začni sa učiť
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </router-link>
          <button class="btn-ghost" @click="store.openSearch()">
            Prezri nástroje
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">50+</span>
            <span class="stat-label">Návodov</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat-item">
            <span class="stat-number">100+</span>
            <span class="stat-label">Nástrojov</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat-item">
            <span class="stat-number">10k+</span>
            <span class="stat-label">Používateľov</span>
          </div>
        </div>
      </div>

      <!-- Platforms strip -->
      <div class="platforms-strip">
        <div class="container">
          <p class="strip-label">Automatizuj s populárnymi platformami</p>
          <div class="platforms-row">
            <span class="platform-chip" v-for="p in platforms" :key="p">{{ p }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         FEATURED GUIDES
    ═══════════════════════════════════════ -->
    <section class="guides-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">📚 Návody</span>
          <h2 class="section-title">Najpopulárnejšie tutoriály</h2>
          <p class="section-sub">Krok za krokom — od nuly k automatizovaným workflow</p>
        </div>
        <div class="guides-grid">
          <article class="guide-card" v-for="guide in featuredGuides" :key="guide.id">
            <div class="guide-visual" :style="{ background: guide.gradient }">
              <span class="guide-emoji">{{ guide.icon }}</span>
            </div>
            <div class="guide-body">
              <div class="guide-meta">
                <span class="guide-tag-pill" :style="{ background: guide.tagBg, color: guide.tagColor }">{{ guide.tag }}</span>
                <span class="guide-time">{{ guide.readTime }} min čítania</span>
              </div>
              <h3 class="guide-title">{{ guide.title }}</h3>
              <p class="guide-desc">{{ guide.description }}</p>
              <a href="#" class="guide-link">
                Prečítať návod
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         AUTOMATION PLATFORMS
    ═══════════════════════════════════════ -->
    <section class="autos-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">🔧 Platformy</span>
          <h2 class="section-title">Vyber si platformu a začni</h2>
          <p class="section-sub">Porovnanie najpopulárnejších automation platforiem</p>
        </div>
        <div class="autos-grid">
          <div class="auto-card" v-for="auto in automationPlatforms" :key="auto.name">
            <div class="auto-logo" :style="{ background: auto.bg, color: auto.color }">{{ auto.abbr }}</div>
            <div class="auto-info">
              <div class="auto-name-row">
                <span class="auto-name">{{ auto.name }}</span>
                <span class="auto-level" :class="'level-' + auto.level">{{ auto.levelLabel }}</span>
              </div>
              <p class="auto-desc">{{ auto.description }}</p>
              <div class="auto-tags">
                <span class="auto-tag" v-for="t in auto.tags" :key="t">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         TOOLS CATEGORIES
    ═══════════════════════════════════════ -->
    <section class="tools-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">⚡ Nástroje</span>
          <h2 class="section-title">Bezplatné online nástroje</h2>
          <p class="section-sub">Okamžite pripravené — bez registrácie, bez platenia</p>
        </div>
        <div class="cats-grid">
          <router-link
            v-for="cat in categories"
            :key="cat.id"
            :to="`/${cat.id}`"
            class="cat-tile"
          >
            <div class="cat-icon-wrap">
              <component :is="getIconForCategory(cat.id)" :size="20" weight="duotone" />
            </div>
            <div class="cat-info">
              <span class="cat-name">{{ cat.title }}</span>
              <span class="cat-count">{{ cat.tools?.length || 0 }} nástrojov</span>
            </div>
            <svg class="cat-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════
         BOTTOM CTA
    ═══════════════════════════════════════ -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-card">
          <div class="cta-orb"></div>
          <span class="cta-badge">🚀 Začni zadarmo</span>
          <h2 class="cta-title">Priprav sa na budúcnosť práce</h2>
          <p class="cta-sub">Pridaj sa k tisícom profesionálov, ktorí už automatizujú s AI. Žiadna kreditná karta, žiadne záväzky.</p>
          <div class="cta-actions">
            <router-link to="/register" class="btn-primary btn-lg">
              Vytvoriť bezplatný účet
            </router-link>
            <router-link to="/ai" class="btn-outline-light">
              Prezrieť návody
            </router-link>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  PhFilePdf, PhImage, PhTextT, PhCode,
  PhMegaphone, PhTrendUp, PhFirstAid, PhGameController, PhRobot,
  PhAirplaneTilt, PhGraduationCap
} from '@phosphor-icons/vue'
import { store } from '../store/toolStore'

const categories = computed(() => store.categories || [])

const platforms = ['n8n', 'Make', 'Zapier', 'ChatGPT', 'Claude AI', 'Midjourney', 'Airtable', 'Notion', 'Slack', 'HubSpot']

const featuredGuides = [
  {
    id: 1,
    icon: '🔄',
    gradient: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
    tag: 'n8n',
    tagBg: '#EEF2FF',
    tagColor: '#4F46E5',
    readTime: 8,
    title: 'Ako automatizovať email marketing s n8n a ChatGPT',
    description: 'Vytvor plne automatizovaný email funnel, ktorý personalizuje obsah pomocou AI — krok za krokom od inštalácie po prvú kampaň.'
  },
  {
    id: 2,
    icon: '⚡',
    gradient: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
    tag: 'Make',
    tagBg: '#F0FDF4',
    tagColor: '#16A34A',
    readTime: 6,
    title: 'Make + Notion: Automatický content calendar pre social media',
    description: 'Prepoj Notion, Make a Canva API do jedného workflow, ktorý ti každý týždeň vygeneruje a naplánuje obsah na všetky siete.'
  },
  {
    id: 3,
    icon: '🤖',
    gradient: 'linear-gradient(135deg, #FDF4FF 0%, #FAE8FF 100%)',
    tag: 'AI Agenti',
    tagBg: '#FDF4FF',
    tagColor: '#9333EA',
    readTime: 12,
    title: 'Vlastný AI agent pre zákaznícku podporu za 1 hodinu',
    description: 'Postav AI chatbota na báze Claude, ktorý odpovedá na otázky zákazníkov, vie pracovať s databázou a eskaluje zložité prípady.'
  }
]

const automationPlatforms = [
  {
    name: 'n8n',
    abbr: 'n8n',
    bg: '#FFF7ED',
    color: '#EA580C',
    level: 'medium',
    levelLabel: '🟡 Stredne náročné',
    description: 'Open-source automation platforma s vizuálnym editorom. Ideálna pre technicky zdatnejších používateľov. Možnosť self-hostingu.',
    tags: ['Open source', 'Self-host', 'API integrácie', '500+ konektorov']
  },
  {
    name: 'Make (Integromat)',
    abbr: 'Make',
    bg: '#F0FDF4',
    color: '#16A34A',
    level: 'easy',
    levelLabel: '🟢 Začiatočníci',
    description: 'Najpriateľnejšia platforma pre začiatočníkov. Drag & drop rozhranie, výkonné scenáre a bezplatný plán s 1000 operáciami.',
    tags: ['Drag & drop', 'Bezplatný plán', '1500+ aplikácií', 'Vizuálny editor']
  },
  {
    name: 'Zapier',
    abbr: 'Zap',
    bg: '#FFF7ED',
    color: '#FF4A00',
    level: 'easy',
    levelLabel: '🟢 Začiatočníci',
    description: 'Najväčší ekosystém integrácií. Jednoduché "ak sa stane X, urob Y" pravidlá. Skvelý štart pred prechodom na pokročilé nástroje.',
    tags: ['6000+ aplikácií', 'Zaps', 'Multi-step', 'AI Actions']
  },
  {
    name: 'AI Agenti (Custom)',
    abbr: 'AI',
    bg: '#F5F3FF',
    color: '#7C3AED',
    level: 'hard',
    levelLabel: '🔴 Pokročilé',
    description: 'Vlastní AI agenti postavení na OpenAI, Claude alebo lokálnych modeloch. Maximálna flexibilita, neobmedzené možnosti.',
    tags: ['LangChain', 'CrewAI', 'AutoGen', 'RAG systémy']
  }
]

const getIconForCategory = (id) => {
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
  }
  return icons[id] || PhTextT
}
</script>

<style scoped>
/* ── Base ── */
.home {
  background: var(--lt-bg);
  min-height: 100vh;
  padding-top: var(--nav-height);
}

/* ════════════════════════════════
   HERO
════════════════════════════════ */
.hero {
  position: relative;
  background: linear-gradient(160deg, #F8FAFF 0%, #F3F4FF 40%, #FAF5FF 100%);
  overflow: hidden;
  padding-bottom: 0;
}

.hero-bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.orb-1 {
  width: 600px; height: 600px;
  background: rgba(79, 70, 229, 0.07);
  top: -200px; right: -100px;
}
.orb-2 {
  width: 400px; height: 400px;
  background: rgba(124, 58, 237, 0.05);
  bottom: 0; left: -100px;
}

.hero-container {
  padding-top: 5rem;
  padding-bottom: 5rem;
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid var(--lt-border);
  border-radius: 100px;
  padding: 0.35rem 1rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--lt-text-secondary);
  margin-bottom: 2rem;
  box-shadow: var(--lt-shadow-sm);
}
.badge-pulse {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #22C55E;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2); }
  50% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.05); }
}

.hero-title {
  font-family: var(--font-heading);
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  font-weight: 800;
  line-height: 1.15;
  color: var(--lt-text);
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
}
.gradient-text {
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #A855F7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  max-width: 600px;
  margin: 0 auto 2.5rem;
  font-size: 1.1rem;
  color: var(--lt-text-muted);
  line-height: 1.7;
}
.hero-subtitle strong {
  color: var(--lt-text-secondary);
  font-weight: 600;
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

/* Primary button */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--lt-accent);
  color: white;
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
}
.btn-primary:hover {
  background: var(--lt-accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
}
.btn-primary.btn-lg {
  padding: 0.9rem 2.25rem;
  font-size: 1rem;
}

/* Ghost button */
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: var(--lt-text-secondary);
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  border: 1px solid var(--lt-border);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--lt-shadow-sm);
}
.btn-ghost:hover {
  border-color: var(--lt-accent);
  color: var(--lt-accent);
  transform: translateY(-1px);
}

/* Outline light button */
.btn-outline-light {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  color: rgba(255,255,255,0.85);
  padding: 0.9rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,0.2);
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}
.btn-outline-light:hover {
  background: rgba(255,255,255,0.1);
  color: white;
  border-color: rgba(255,255,255,0.4);
}

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 2rem;
  background: white;
  border: 1px solid var(--lt-border);
  border-radius: 16px;
  padding: 1rem 2.5rem;
  box-shadow: var(--lt-shadow-sm);
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
}
.stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--lt-accent);
  font-family: var(--font-heading);
  letter-spacing: -0.03em;
}
.stat-label {
  font-size: 0.72rem;
  color: var(--lt-text-faint);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.stat-sep {
  width: 1px;
  height: 36px;
  background: var(--lt-border);
}

/* Platforms strip */
.platforms-strip {
  background: white;
  border-top: 1px solid var(--lt-border);
  padding: 1.5rem 0;
}
.strip-label {
  text-align: center;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--lt-text-faint);
  font-weight: 600;
  margin-bottom: 1rem;
}
.platforms-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.platform-chip {
  background: var(--lt-bg-section);
  border: 1px solid var(--lt-border);
  color: var(--lt-text-secondary);
  padding: 0.35rem 1rem;
  border-radius: 100px;
  font-size: 0.78rem;
  font-weight: 600;
  transition: all 0.2s;
}
.platform-chip:hover {
  background: var(--lt-accent-light);
  border-color: rgba(79, 70, 229, 0.2);
  color: var(--lt-accent);
}

/* ════════════════════════════════
   SECTION COMMONS
════════════════════════════════ */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}
.section-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--lt-accent);
  background: var(--lt-accent-light);
  padding: 0.3rem 0.85rem;
  border-radius: 100px;
  margin-bottom: 0.85rem;
}
.section-title {
  font-family: var(--font-heading);
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  font-weight: 800;
  color: var(--lt-text);
  letter-spacing: -0.025em;
  margin-bottom: 0.6rem;
  line-height: 1.2;
}
.section-sub {
  font-size: 1rem;
  color: var(--lt-text-muted);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ════════════════════════════════
   GUIDES
════════════════════════════════ */
.guides-section {
  background: var(--lt-bg-white);
  padding: 5rem 0;
}
.guides-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
@media (max-width: 1024px) { .guides-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 640px) { .guides-grid { grid-template-columns: 1fr; } }

.guide-card {
  background: white;
  border: 1px solid var(--lt-border);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
}
.guide-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--lt-shadow-lg);
}
.guide-visual {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.guide-emoji {
  font-size: 3rem;
  line-height: 1;
}
.guide-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.guide-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.85rem;
}
.guide-tag-pill {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
}
.guide-time {
  font-size: 0.75rem;
  color: var(--lt-text-faint);
}
.guide-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--lt-text);
  line-height: 1.4;
  margin-bottom: 0.6rem;
  letter-spacing: -0.01em;
}
.guide-desc {
  font-size: 0.88rem;
  color: var(--lt-text-muted);
  line-height: 1.65;
  flex: 1;
  margin-bottom: 1.25rem;
}
.guide-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--lt-accent);
  text-decoration: none;
  transition: gap 0.2s;
}
.guide-link:hover { gap: 0.6rem; }

/* ════════════════════════════════
   AUTOMATION PLATFORMS
════════════════════════════════ */
.autos-section {
  background: var(--lt-bg);
  padding: 5rem 0;
}
.autos-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}
@media (max-width: 768px) { .autos-grid { grid-template-columns: 1fr; } }

.auto-card {
  background: white;
  border: 1px solid var(--lt-border);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  transition: transform 0.2s, box-shadow 0.2s;
}
.auto-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--lt-shadow-md);
}
.auto-logo {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}
.auto-info { flex: 1; }
.auto-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}
.auto-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--lt-text);
}
.auto-level {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 100px;
}
.level-easy { background: #F0FDF4; color: #16A34A; }
.level-medium { background: #FFFBEB; color: #D97706; }
.level-hard { background: #FFF1F2; color: #E11D48; }
.auto-desc {
  font-size: 0.85rem;
  color: var(--lt-text-muted);
  line-height: 1.6;
  margin-bottom: 0.85rem;
}
.auto-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.auto-tag {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--lt-text-secondary);
  background: var(--lt-bg-section);
  border: 1px solid var(--lt-border);
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
}

/* ════════════════════════════════
   TOOLS CATEGORIES
════════════════════════════════ */
.tools-section {
  background: var(--lt-bg-white);
  padding: 5rem 0;
}
.cats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.85rem;
}
@media (max-width: 1100px) { .cats-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .cats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .cats-grid { grid-template-columns: 1fr; } }

.cat-tile {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: white;
  border: 1px solid var(--lt-border);
  border-radius: 12px;
  padding: 1rem 1.1rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  group: true;
}
.cat-tile:hover {
  border-color: rgba(79, 70, 229, 0.25);
  box-shadow: var(--lt-shadow);
  transform: translateY(-1px);
}
.cat-tile:hover .cat-icon-wrap {
  background: var(--lt-accent-light);
  color: var(--lt-accent);
}
.cat-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: var(--lt-bg-section);
  color: var(--lt-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}
.cat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}
.cat-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--lt-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cat-count {
  font-size: 0.72rem;
  color: var(--lt-text-faint);
}
.cat-arrow {
  color: var(--lt-text-faint);
  flex-shrink: 0;
  transition: transform 0.2s;
}
.cat-tile:hover .cat-arrow {
  transform: translateX(3px);
  color: var(--lt-accent);
}

/* ════════════════════════════════
   BOTTOM CTA
════════════════════════════════ */
.cta-section {
  background: var(--lt-bg);
  padding: 5rem 0 6rem;
}
.cta-card {
  position: relative;
  background: linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%);
  border-radius: 24px;
  padding: 4rem;
  text-align: center;
  overflow: hidden;
}
.cta-orb {
  position: absolute;
  width: 400px; height: 400px;
  background: rgba(167, 139, 250, 0.15);
  border-radius: 50%;
  top: -150px; right: -100px;
  filter: blur(60px);
  pointer-events: none;
}
.cta-badge {
  display: inline-block;
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.85);
  border: 1px solid rgba(255,255,255,0.15);
  padding: 0.3rem 0.85rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}
.cta-title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 800;
  color: white;
  letter-spacing: -0.025em;
  margin-bottom: 0.85rem;
  line-height: 1.2;
  position: relative;
}
.cta-sub {
  font-size: 1rem;
  color: rgba(255,255,255,0.65);
  max-width: 480px;
  margin: 0 auto 2.5rem;
  line-height: 1.65;
  position: relative;
}
.cta-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  flex-wrap: wrap;
  position: relative;
}

/* ── Responsive: hero ── */
@media (max-width: 640px) {
  .hero-container { padding-top: 3.5rem; padding-bottom: 3.5rem; }
  .hero-stats { padding: 0.85rem 1.5rem; gap: 1.25rem; flex-wrap: wrap; }
  .guides-section, .autos-section, .tools-section, .cta-section { padding: 3.5rem 0; }
  .cta-card { padding: 2.5rem 1.5rem; }
}
</style>
