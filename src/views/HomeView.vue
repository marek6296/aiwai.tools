<template>
  <div class="home">

    <!-- ══════════════════════════════════════════════
         HERO
    ══════════════════════════════════════════════ -->
    <section class="hero">
      <div class="hero-grid-bg"></div>
      <div class="container hero-layout">

        <!-- LEFT -->
        <div class="hero-left">
          <div class="hero-badge">
            <PhLightning :size="12" weight="fill" />
            Platforma pre AI automatizáciu
          </div>

          <h1 class="hero-h1">
            Automatizuj prácu.<br>
            <span class="h1-gradient">Ušetri hodiny</span><br>
            každý deň.
          </h1>

          <p class="hero-p">
            Návody, nástroje a workflow pre <strong>n8n</strong>, <strong>Make</strong>
            a <strong>Zapier</strong>. Od nuly k automatizácii — bez kódovania.
          </p>

          <div class="hero-actions">
            <router-link to="/ai" class="btn-primary">
              Začni zadarmo
              <PhArrowRight :size="15" weight="bold" />
            </router-link>
            <button class="btn-outline" @click="store.openSearch()">
              <PhMagnifyingGlass :size="15" />
              Hľadať nástroje
            </button>
          </div>

          <div class="hero-proof">
            <div class="proof-faces">
              <div class="face f1"></div>
              <div class="face f2"></div>
              <div class="face f3"></div>
              <div class="face f4"></div>
            </div>
            <p class="proof-text">
              Už <strong>10 000+</strong> profesionálov automatizuje s AIWai
            </p>
          </div>
        </div>

        <!-- RIGHT — workflow mockup -->
        <div class="hero-right">
          <div class="workflow-mockup">

            <div class="wf-node wf-trigger">
              <div class="wf-node-icon" style="background:#FFF7ED;color:#EA580C">
                <PhGlobe :size="17" weight="duotone" />
              </div>
              <div class="wf-node-text">
                <span class="wf-node-type">Trigger</span>
                <span class="wf-node-name">Nový formulár</span>
              </div>
              <span class="wf-badge wf-badge--live">
                <span class="live-dot"></span>
                Live
              </span>
            </div>

            <div class="wf-connector">
              <div class="wf-line-v"></div>
              <div class="wf-step-pill">
                <PhArrowsClockwise :size="11" weight="bold" />
                Spracovanie
              </div>
              <div class="wf-line-v"></div>
            </div>

            <div class="wf-node wf-ai-node">
              <div class="wf-node-icon" style="background:#EEF2FF;color:#4F46E5">
                <PhRobot :size="17" weight="duotone" />
              </div>
              <div class="wf-node-text">
                <span class="wf-node-type">ChatGPT 4o</span>
                <span class="wf-node-name">Generuj odpoveď</span>
              </div>
              <span class="wf-badge wf-badge--run">
                <PhArrowsClockwise :size="9" weight="bold" class="spin" />
                Beží
              </span>
            </div>

            <div class="wf-connector">
              <div class="wf-line-v"></div>
              <div class="wf-step-pill wf-step-pill--green">
                <PhCheckCircle :size="11" weight="fill" />
                Dokončené
              </div>
              <div class="wf-line-v"></div>
            </div>

            <div class="wf-node wf-action">
              <div class="wf-node-icon" style="background:#F0FDF4;color:#16A34A">
                <PhPaperPlaneTilt :size="17" weight="duotone" />
              </div>
              <div class="wf-node-text">
                <span class="wf-node-type">Email</span>
                <span class="wf-node-name">Odoslať zákazníkovi</span>
              </div>
              <span class="wf-badge wf-badge--done">
                <PhCheck :size="9" weight="bold" />
                Hotovo
              </span>
            </div>

            <!-- floating stats -->
            <div class="wf-float-card float-left">
              <PhClock :size="18" weight="duotone" style="color:#4F46E5" />
              <div>
                <div class="float-val">4.2h</div>
                <div class="float-lbl">ušetrené/deň</div>
              </div>
            </div>
            <div class="wf-float-card float-right">
              <PhArrowsCounterClockwise :size="18" weight="duotone" style="color:#16A34A" />
              <div>
                <div class="float-val">1 247</div>
                <div class="float-lbl">spustení dnes</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- platform strip -->
      <div class="plat-strip">
        <div class="container plat-strip-inner">
          <span class="plat-strip-label">Integruje sa s</span>
          <div class="plat-chips">
            <span class="plat-chip" v-for="p in platforms" :key="p.name">
              <span class="plat-dot" :style="{background: p.color}"></span>
              {{ p.name }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         STATS
    ══════════════════════════════════════════════ -->
    <section class="stats-bar">
      <div class="container">
        <div class="stats-row">
          <div class="stat-item" v-for="s in stats" :key="s.label">
            <div class="stat-icon" :style="{background: s.bg, color: s.color}">
              <component :is="s.icon" :size="18" weight="duotone" />
            </div>
            <div>
              <div class="stat-value">{{ s.value }}</div>
              <div class="stat-label">{{ s.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         GUIDES
    ══════════════════════════════════════════════ -->
    <section class="section-white">
      <div class="container">
        <div class="sec-head">
          <div class="sec-eyebrow">
            <PhBookOpen :size="13" weight="duotone" />
            Návody & Tutoriály
          </div>
          <h2 class="sec-title">Nauč sa automatizovať krok za krokom</h2>
          <p class="sec-sub">Praktické návody od nuly k produkčnému workflow</p>
        </div>

        <div class="guides-grid">
          <article class="guide-card" v-for="g in guides" :key="g.id">
            <div class="guide-top" :style="{background: g.topBg}">
              <div class="guide-icon-wrap" :style="{background: g.iconBg, color: g.iconColor}">
                <component :is="g.icon" :size="24" weight="duotone" />
              </div>
              <div class="guide-tag-wrap">
                <span class="guide-platform-tag" :style="{background: g.tagBg, color: g.tagColor}">
                  {{ g.platform }}
                </span>
              </div>
            </div>
            <div class="guide-bottom">
              <div class="guide-meta">
                <PhClock :size="11" style="color:#94A3B8" />
                <span>{{ g.minutes }} min čítania</span>
                <span class="guide-dot">·</span>
                <span>{{ g.level }}</span>
              </div>
              <h3 class="guide-h3">{{ g.title }}</h3>
              <p class="guide-p">{{ g.desc }}</p>
              <a href="#" class="guide-link">
                Prečítať návod
                <PhArrowRight :size="13" weight="bold" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         PLATFORMS
    ══════════════════════════════════════════════ -->
    <section class="section-gray">
      <div class="container">
        <div class="sec-head">
          <div class="sec-eyebrow">
            <PhGear :size="13" weight="duotone" />
            Automatizačné platformy
          </div>
          <h2 class="sec-title">Vyber si svoju platformu</h2>
          <p class="sec-sub">Porovnanie n8n, Make, Zapier a AI agentov</p>
        </div>

        <div class="plat-grid">
          <div class="plat-card" v-for="p in autoPlatforms" :key="p.name">
            <div class="plat-card-head">
              <div class="plat-abbr" :style="{background: p.logoBg, color: p.logoColor}">
                {{ p.abbr }}
              </div>
              <div>
                <div class="plat-name">{{ p.name }}</div>
                <span class="plat-level" :class="'level-' + p.levelKey">{{ p.level }}</span>
              </div>
            </div>
            <p class="plat-desc">{{ p.desc }}</p>
            <ul class="plat-feats">
              <li v-for="f in p.feats" :key="f">
                <PhCheckCircle :size="13" weight="fill" :style="{color: p.logoColor}" />
                {{ f }}
              </li>
            </ul>
            <a href="#" class="plat-link">
              Zobraziť návody
              <PhArrowRight :size="13" weight="bold" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         TOOLS
    ══════════════════════════════════════════════ -->
    <section class="section-white">
      <div class="container">
        <div class="sec-head">
          <div class="sec-eyebrow">
            <PhWrench :size="13" weight="duotone" />
            Bezplatné nástroje
          </div>
          <h2 class="sec-title">100+ nástrojov okamžite pripravených</h2>
          <p class="sec-sub">Bez registrácie, bez platenia — hneď k dispozícii</p>
        </div>

        <div class="tools-grid">
          <router-link v-for="cat in categories" :key="cat.id" :to="`/${cat.id}`" class="tool-tile">
            <div class="tile-icon" :style="{background: getCatColor(cat.id).bg, color: getCatColor(cat.id).color}">
              <component :is="getIcon(cat.id)" :size="19" weight="duotone" />
            </div>
            <div class="tile-info">
              <span class="tile-name">{{ cat.title }}</span>
              <span class="tile-cnt">{{ cat.tools?.length || 0 }} nástrojov</span>
            </div>
            <PhArrowRight :size="14" class="tile-arr" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         CTA
    ══════════════════════════════════════════════ -->
    <section class="section-gray cta-section">
      <div class="container">
        <div class="cta-box">
          <div class="cta-glow-1"></div>
          <div class="cta-glow-2"></div>
          <div class="cta-inner">
            <div class="sec-eyebrow" style="color:rgba(255,255,255,0.55);border-color:rgba(255,255,255,0.12);background:rgba(255,255,255,0.06)">
              <PhRocketLaunch :size="13" weight="duotone" />
              Začni zadarmo dnes
            </div>
            <h2 class="cta-h2">Priprav sa na budúcnosť práce</h2>
            <p class="cta-p">Pridaj sa k tisícom profesionálov, ktorí šetria hodiny každý deň pomocou AI automatizácií.</p>
            <div class="cta-btns">
              <router-link to="/register" class="cta-btn-main">
                Vytvoriť účet zadarmo
                <PhArrowRight :size="15" weight="bold" />
              </router-link>
              <router-link to="/ai" class="cta-btn-ghost">
                Prezrieť návody
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  PhArrowRight, PhArrowsClockwise, PhArrowsCounterClockwise,
  PhLightning, PhMagnifyingGlass, PhGlobe, PhRobot,
  PhCheck, PhCheckCircle, PhPaperPlaneTilt, PhClock,
  PhBookOpen, PhGear, PhWrench, PhRocketLaunch,
  PhFilePdf, PhImage, PhTextT, PhCode,
  PhMegaphone, PhTrendUp, PhFirstAid, PhGameController,
  PhAirplaneTilt, PhGraduationCap, PhUsersThree,
} from '@phosphor-icons/vue'
import { store } from '../store/toolStore'

const categories = computed(() => store.categories || [])

/* ── platforms strip ── */
const platforms = [
  { name: 'n8n',        color: '#EA580C' },
  { name: 'Make',       color: '#16A34A' },
  { name: 'Zapier',     color: '#FF4A00' },
  { name: 'ChatGPT',    color: '#10A37F' },
  { name: 'Claude AI',  color: '#C76B36' },
  { name: 'Midjourney', color: '#3B82F6' },
  { name: 'Notion',     color: '#000000' },
  { name: 'Airtable',   color: '#F03E3E' },
]

/* ── stats ── */
const stats = [
  { value: '50+',    label: 'Návodov',       icon: PhBookOpen,            bg: '#EEF2FF', color: '#4F46E5' },
  { value: '100+',   label: 'Nástrojov',     icon: PhWrench,              bg: '#F0FDF4', color: '#16A34A' },
  { value: '10 000+', label: 'Používateľov', icon: PhUsersThree,          bg: '#FFF7ED', color: '#EA580C' },
  { value: '4',      label: 'Platformy',     icon: PhArrowsCounterClockwise, bg: '#F5F3FF', color: '#7C3AED' },
]

/* ── guides ── */
const guides = [
  {
    id: 1,
    topBg:     'linear-gradient(135deg,#FFF7ED 0%,#FFEDD5 100%)',
    iconBg:    '#FED7AA', iconColor: '#C2410C',
    icon:      PhArrowsClockwise,
    platform:  'n8n',
    tagBg:     '#FFF7ED', tagColor: '#EA580C',
    minutes:   8, level: 'Začiatočník',
    title:     'Automatizuj email marketing s n8n a ChatGPT',
    desc:      'Postav plne automatizovaný email funnel — od zberu leadov po AI-personalizovanú správu.',
  },
  {
    id: 2,
    topBg:     'linear-gradient(135deg,#F0FDF4 0%,#DCFCE7 100%)',
    iconBg:    '#BBF7D0', iconColor: '#15803D',
    icon:      PhMegaphone,
    platform:  'Make',
    tagBg:     '#F0FDF4', tagColor: '#16A34A',
    minutes:   6, level: 'Mierne pokročilý',
    title:     'Make + Notion: automatický content calendar',
    desc:      'Prepoj Notion, Make a Canva API do jedného workflow, ktorý každý týždeň naplánuje tvoj obsah.',
  },
  {
    id: 3,
    topBg:     'linear-gradient(135deg,#F5F3FF 0%,#EDE9FE 100%)',
    iconBg:    '#DDD6FE', iconColor: '#6D28D9',
    icon:      PhRobot,
    platform:  'AI Agenti',
    tagBg:     '#F5F3FF', tagColor: '#7C3AED',
    minutes:   12, level: 'Pokročilý',
    title:     'Vlastný AI agent pre zákaznícku podporu',
    desc:      'Postav AI chatbota na báze Claude, ktorý odpovedá na otázky zákazníkov a eskaluje zložité prípady.',
  },
]

/* ── automation platforms ── */
const autoPlatforms = [
  {
    name: 'n8n',
    abbr: 'n8n',
    logoBg: '#FFF7ED', logoColor: '#EA580C',
    level: 'Stredne náročné', levelKey: 'medium',
    desc: 'Open-source platforma s vizuálnym editorom. Možnosť self-hostingu, neobmedzené workflow.',
    feats: ['Open source & self-host', '500+ integrácií', 'JavaScript funkcie', 'API prístup'],
  },
  {
    name: 'Make (Integromat)',
    abbr: 'Make',
    logoBg: '#F0FDF4', logoColor: '#16A34A',
    level: 'Začiatočníci',  levelKey: 'easy',
    desc: 'Najpriateľnejšia platforma pre začiatočníkov. Drag & drop, bezplatný plán s 1 000 operáciami.',
    feats: ['Drag & drop rozhranie', '1 500+ aplikácií', 'Bezplatný plán', 'Vizuálny debugger'],
  },
  {
    name: 'Zapier',
    abbr: 'Zap',
    logoBg: '#FFF7ED', logoColor: '#FF4A00',
    level: 'Začiatočníci',  levelKey: 'easy',
    desc: 'Najväčší ekosystém integrácií na svete. Jednoduché "ak X, urob Y" pravidlá za pár minút.',
    feats: ['6 000+ aplikácií', 'Multi-step Zaps', 'AI Actions', 'Zap šablóny'],
  },
  {
    name: 'Vlastní AI agenti',
    abbr: 'AI',
    logoBg: '#F5F3FF', logoColor: '#7C3AED',
    level: 'Pokročilé',     levelKey: 'hard',
    desc: 'Agenti postavení na OpenAI, Claude alebo lokálnych modeloch. Maximálna flexibilita.',
    feats: ['LangChain / CrewAI', 'RAG systémy', 'Custom LLM', 'Lokálne modely'],
  },
]

/* ── helpers ── */
const iconMap = {
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

const colorMap = {
  media:     { bg: '#FFF7ED', color: '#EA580C' },
  design:    { bg: '#FDF4FF', color: '#9333EA' },
  text:      { bg: '#EEF2FF', color: '#4F46E5' },
  ai:        { bg: '#F0FDF4', color: '#16A34A' },
  dev:       { bg: '#F0F9FF', color: '#0284C7' },
  marketing: { bg: '#FFF1F2', color: '#E11D48' },
  finance:   { bg: '#F0FDF4', color: '#15803D' },
  lifestyle: { bg: '#FFF7ED', color: '#D97706' },
  fun:       { bg: '#FDF4FF', color: '#A21CAF' },
  travel:    { bg: '#F0F9FF', color: '#0369A1' },
  edu:       { bg: '#FFFBEB', color: '#D97706' },
}

const getIcon = (id) => iconMap[id] || PhTextT
const getCatColor = (id) => colorMap[id] || { bg: '#EEF2FF', color: '#4F46E5' }
</script>

<style scoped>
/* ═══════════════ BASE ═══════════════ */
.home {
  background: #fff;
  min-height: 100vh;
  padding-top: var(--nav-height);
}

/* ═══════════════ HERO ═══════════════ */
.hero {
  position: relative;
  background: #fff;
  overflow: hidden;
}

/* subtle dot grid */
.hero-grid-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, #E2E8F0 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.6;
  pointer-events: none;
}

.hero-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding-top: 5rem;
  padding-bottom: 4rem;
  position: relative;
  z-index: 1;
}

/* LEFT */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #EEF2FF;
  color: #4F46E5;
  border-radius: 100px;
  padding: 0.3rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  margin-bottom: 1.6rem;
}

.hero-h1 {
  font-family: var(--font-heading);
  font-size: clamp(2.4rem, 4.5vw, 3.6rem);
  font-weight: 800;
  line-height: 1.13;
  letter-spacing: -0.035em;
  color: #0F172A;
  margin-bottom: 1.4rem;
}

.h1-gradient {
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 55%, #A855F7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-p {
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.72;
  margin-bottom: 2rem;
  max-width: 440px;
}
.hero-p strong { color: #1E293B; font-weight: 600; }

.hero-actions {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #4F46E5;
  color: #fff;
  padding: 0.75rem 1.6rem;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background .2s, transform .2s, box-shadow .2s;
  box-shadow: 0 4px 14px rgba(79,70,229,.3);
}
.btn-primary:hover {
  background: #4338CA;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79,70,229,.4);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #fff;
  color: #374151;
  padding: 0.75rem 1.4rem;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  border: 1.5px solid #E2E8F0;
  cursor: pointer;
  transition: all .2s;
  box-shadow: 0 1px 4px rgba(15,23,42,.05);
}
.btn-outline:hover { border-color: #4F46E5; color: #4F46E5; transform: translateY(-1px); }

.hero-proof {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.proof-faces { display: flex; }
.face {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-right: -8px;
}
.f1 { background: linear-gradient(135deg,#FCA5A5,#EF4444); }
.f2 { background: linear-gradient(135deg,#6EE7B7,#059669); }
.f3 { background: linear-gradient(135deg,#93C5FD,#3B82F6); }
.f4 { background: linear-gradient(135deg,#C4B5FD,#7C3AED); }
.proof-text { font-size: 0.8rem; color: #64748B; }
.proof-text strong { color: #0F172A; }

/* ── workflow mockup ── */
.hero-right {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
}

.workflow-mockup {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  width: 340px;
}

.wf-node {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: #fff;
  border: 1.5px solid #E2E8F0;
  border-radius: 14px;
  padding: 0.9rem 1.1rem;
  box-shadow: 0 4px 16px rgba(15,23,42,.07), 0 1px 4px rgba(15,23,42,.04);
  position: relative;
  z-index: 2;
}

.wf-node-icon {
  width: 36px; height: 36px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.wf-node-text {
  flex: 1;
  display: flex; flex-direction: column; gap: 1px;
}
.wf-node-type { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #94A3B8; }
.wf-node-name { font-size: 0.88rem; font-weight: 600; color: #1E293B; }

.wf-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 100px;
}
.wf-badge--live  { background: #F0FDF4; color: #16A34A; }
.wf-badge--run   { background: #EEF2FF; color: #4F46E5; }
.wf-badge--done  { background: #F0FDF4; color: #15803D; }

.live-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #22C55E;
  animation: livepulse 1.8s infinite;
}
@keyframes livepulse {
  0%,100% { opacity: 1; } 50% { opacity: .3; }
}

.spin { animation: rotatespn 1.2s linear infinite; }
@keyframes rotatespn { to { transform: rotate(360deg); } }

.wf-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  position: relative;
  z-index: 1;
}
.wf-line-v {
  width: 2px; height: 18px;
  background: linear-gradient(to bottom, #E2E8F0, #CBD5E1);
}
.wf-step-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: #EEF2FF;
  color: #4F46E5;
  border: 1px solid #C7D2FE;
  border-radius: 100px;
  padding: 0.22rem 0.7rem;
  font-size: 0.65rem;
  font-weight: 700;
}
.wf-step-pill--green {
  background: #F0FDF4; color: #16A34A; border-color: #BBF7D0;
}

/* floating badges */
.wf-float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #fff;
  border: 1.5px solid #E2E8F0;
  border-radius: 12px;
  padding: 0.6rem 0.85rem;
  box-shadow: 0 8px 24px rgba(15,23,42,.1);
  z-index: 10;
}
.float-left  { left: -110px; top: 45px; }
.float-right { right: -110px; bottom: 80px; }

.float-val  { font-size: 0.95rem; font-weight: 800; color: #0F172A; line-height: 1; }
.float-lbl  { font-size: 0.65rem; color: #94A3B8; margin-top: 1px; }

/* ── platform strip ── */
.plat-strip {
  background: #F8FAFC;
  border-top: 1px solid #F1F5F9;
  padding: 1.25rem 0;
}
.plat-strip-inner {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.plat-strip-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: #94A3B8;
  white-space: nowrap;
}
.plat-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
.plat-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #fff;
  border: 1px solid #E2E8F0;
  color: #374151;
  padding: 0.3rem 0.8rem;
  border-radius: 100px;
  font-size: 0.78rem;
  font-weight: 600;
  transition: all .2s;
}
.plat-chip:hover { border-color: #4F46E5; color: #4F46E5; }
.plat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

/* ═══════════════ STATS ═══════════════ */
.stats-bar {
  background: #fff;
  border-top: 1px solid #F1F5F9;
  border-bottom: 1px solid #F1F5F9;
  padding: 2.5rem 0;
}
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.stat-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-value {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 2px;
}
.stat-label {
  font-size: 0.78rem;
  color: #64748B;
  font-weight: 500;
}

/* ═══════════════ SECTION COMMONS ═══════════════ */
.section-white { background: #fff; padding: 5rem 0; }
.section-gray  { background: #F8FAFC; padding: 5rem 0; }

.sec-head {
  text-align: center;
  margin-bottom: 3rem;
}
.sec-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #EEF2FF;
  color: #4F46E5;
  border: 1px solid #C7D2FE;
  border-radius: 100px;
  padding: 0.28rem 0.85rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
  margin-bottom: 1rem;
}
.sec-title {
  font-family: var(--font-heading);
  font-size: clamp(1.7rem, 2.8vw, 2.3rem);
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.025em;
  line-height: 1.2;
  margin-bottom: 0.6rem;
}
.sec-sub {
  font-size: 1rem;
  color: #64748B;
  line-height: 1.65;
  max-width: 460px;
  margin: 0 auto;
}

/* ═══════════════ GUIDES ═══════════════ */
.guides-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.guide-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  overflow: hidden;
  transition: transform .25s, box-shadow .25s;
  display: flex;
  flex-direction: column;
}
.guide-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 40px rgba(15,23,42,.1);
}

.guide-top {
  height: 130px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1.1rem 1.25rem;
  position: relative;
}
.guide-icon-wrap {
  width: 46px; height: 46px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
}
.guide-tag-wrap { align-self: flex-start; }
.guide-platform-tag {
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .07em;
  padding: 0.22rem 0.6rem;
  border-radius: 100px;
}

.guide-bottom { padding: 1.25rem 1.4rem 1.4rem; flex: 1; display: flex; flex-direction: column; }
.guide-meta {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: #94A3B8;
  margin-bottom: 0.75rem;
}
.guide-dot { color: #CBD5E1; }
.guide-h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.4;
  letter-spacing: -0.01em;
  margin-bottom: 0.55rem;
}
.guide-p {
  font-size: 0.85rem;
  color: #64748B;
  line-height: 1.65;
  flex: 1;
  margin-bottom: 1rem;
}
.guide-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #4F46E5;
  text-decoration: none;
  transition: gap .2s;
}
.guide-link:hover { gap: 0.55rem; }

/* ═══════════════ PLATFORMS ═══════════════ */
.plat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.plat-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 1.4rem;
  transition: transform .2s, box-shadow .2s;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.plat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(15,23,42,.08);
}

.plat-card-head {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 0.85rem;
}
.plat-abbr {
  width: 44px; height: 44px;
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .04em;
  flex-shrink: 0;
}
.plat-name { font-size: 0.92rem; font-weight: 700; color: #0F172A; }
.plat-level {
  font-size: 0.64rem; font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 100px;
  display: inline-block;
  margin-top: 2px;
}
.level-easy   { background: #F0FDF4; color: #15803D; }
.level-medium { background: #FFFBEB; color: #B45309; }
.level-hard   { background: #FFF1F2; color: #BE123C; }

.plat-desc {
  font-size: 0.82rem;
  color: #64748B;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.plat-feats {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.1rem;
  flex: 1;
}
.plat-feats li {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  color: #374151;
}
.check-icon { flex-shrink: 0; }

.plat-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #4F46E5;
  text-decoration: none;
  transition: gap .2s;
}
.plat-link:hover { gap: 0.55rem; }

/* ═══════════════ TOOLS ═══════════════ */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.tool-tile {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  text-decoration: none;
  color: inherit;
  transition: all .2s;
}
.tool-tile:hover {
  border-color: rgba(79,70,229,.3);
  box-shadow: 0 4px 12px rgba(79,70,229,.08);
  transform: translateY(-1px);
}
.tool-tile:hover .tile-icon {
  background: #EEF2FF !important;
  color: #4F46E5 !important;
}
.tile-icon {
  width: 36px; height: 36px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all .2s;
}
.tile-info { flex: 1; min-width: 0; }
.tile-name {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1E293B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tile-cnt {
  display: block;
  font-size: 0.7rem;
  color: #94A3B8;
  margin-top: 1px;
}
.tile-arr {
  color: #CBD5E1;
  flex-shrink: 0;
  transition: transform .2s, color .2s;
}
.tool-tile:hover .tile-arr { transform: translateX(3px); color: #4F46E5; }

/* ═══════════════ CTA ═══════════════ */
.cta-section { padding-bottom: 6rem; }
.cta-box {
  position: relative;
  background: linear-gradient(135deg, #1E1B4B 0%, #312E81 45%, #3730A3 100%);
  border-radius: 24px;
  overflow: hidden;
}
.cta-glow-1 {
  position: absolute;
  width: 500px; height: 500px;
  background: rgba(167,139,250,.15);
  border-radius: 50%;
  top: -200px; right: -100px;
  filter: blur(60px);
  pointer-events: none;
}
.cta-glow-2 {
  position: absolute;
  width: 300px; height: 300px;
  background: rgba(99,102,241,.2);
  border-radius: 50%;
  bottom: -100px; left: 50px;
  filter: blur(50px);
  pointer-events: none;
}
.cta-inner {
  position: relative;
  text-align: center;
  padding: 5rem 2rem;
  z-index: 1;
}
.cta-h2 {
  font-family: var(--font-heading);
  font-size: clamp(1.9rem, 3.5vw, 2.8rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.025em;
  line-height: 1.15;
  margin: 1rem 0 0.8rem;
}
.cta-p {
  font-size: 1rem;
  color: rgba(255,255,255,.6);
  max-width: 460px;
  margin: 0 auto 2.5rem;
  line-height: 1.65;
}
.cta-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  flex-wrap: wrap;
}
.cta-btn-main {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  color: #3730A3;
  padding: 0.85rem 2rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  transition: all .2s;
  box-shadow: 0 4px 16px rgba(0,0,0,.2);
}
.cta-btn-main:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.25); }
.cta-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  color: rgba(255,255,255,.8);
  padding: 0.85rem 2rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  border: 1.5px solid rgba(255,255,255,.2);
  text-decoration: none;
  transition: all .2s;
}
.cta-btn-ghost:hover { border-color: rgba(255,255,255,.5); color: #fff; background: rgba(255,255,255,.06); }

/* ═══════════════ RESPONSIVE ═══════════════ */
@media (max-width: 1200px) {
  .plat-grid   { grid-template-columns: repeat(2,1fr); }
  .tools-grid  { grid-template-columns: repeat(3,1fr); }
}

@media (max-width: 1024px) {
  .hero-layout { grid-template-columns: 1fr; gap: 2.5rem; }
  .hero-right  { display: none; }
  .stats-row   { grid-template-columns: repeat(2,1fr); }
  .guides-grid { grid-template-columns: repeat(2,1fr); }
}

@media (max-width: 768px) {
  .guides-grid { grid-template-columns: 1fr; }
  .plat-grid   { grid-template-columns: 1fr; }
  .tools-grid  { grid-template-columns: repeat(2,1fr); }
}

@media (max-width: 560px) {
  .hero-h1 { font-size: 2.2rem; }
  .stats-row { grid-template-columns: 1fr 1fr; }
  .tools-grid { grid-template-columns: 1fr; }
  .section-white, .section-gray { padding: 3.5rem 0; }
}
</style>
