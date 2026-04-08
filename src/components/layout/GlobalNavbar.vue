<template>
  <header class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="navbar-inner container">

      <!-- LEFT: Menu dropdown + Search (desktop) -->
      <div class="nav-left">
        <!-- Dropdown Menu -->
        <div class="dropdown-wrap" :class="{ 'open': menuOpen }" @mouseenter="menuOpen = true" @mouseleave="menuOpen = false">
          <button class="menu-trigger clickable" @click="menuOpen = !menuOpen">
            Menu
            <PhCaretDown :size="12" class="caret" />
          </button>
          <div class="dropdown-panel glass">
            <template v-for="cat in categories" :key="cat.name">
              <router-link
                v-if="cat.internal"
                :to="cat.href"
                class="dropdown-item clickable"
                :class="{ active: $route.path === cat.href }"
                @click="menuOpen = false"
              >
                {{ cat.name }}
              </router-link>
              <a
                v-else
                :href="cat.href"
                target="_blank"
                rel="noopener"
                class="dropdown-item clickable"
                @click="menuOpen = false"
              >
                {{ cat.name }}
              </a>
            </template>
          </div>
        </div>

        <!-- Search -->
        <form class="search-form" @submit.prevent="handleSearch">
          <button type="submit" class="search-icon clickable">
            <PhMagnifyingGlass :size="14" />
          </button>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Hľadať..."
            class="search-input"
          />
        </form>
      </div>

      <!-- CENTER: Logo -->
      <router-link to="/" class="logo-area clickable" @click="closeMobile">
        <span class="logo-aiwai">AIWai</span>
        <img src="/aiwai-logo.png" alt="AIWai Logo" class="logo-img" />
        <span class="logo-tools">Tools</span>
      </router-link>

      <!-- RIGHT: Auth area + mobile toggle -->
      <div class="nav-right">
        <!-- Auth: Desktop -->
        <div class="auth-area desktop-only">
          <template v-if="authStore.isLoggedIn">
            <div class="user-menu-wrap" :class="{ 'open': userMenuOpen }" @mouseenter="userMenuOpen = true" @mouseleave="userMenuOpen = false">
              <button class="user-trigger clickable">
                <div class="user-avatar">
                  <img v-if="authStore.avatarUrl" :src="authStore.avatarUrl" :alt="authStore.displayName" />
                  <PhUser v-else :size="14" />
                </div>
                <span class="user-name">{{ authStore.displayName }}</span>
                <PhCaretDown :size="10" class="caret" />
              </button>
              <div class="user-dropdown glass">
                <button class="dropdown-item clickable logout-item" @click="handleLogout">
                  <PhSignOut :size="14" />
                  Odhlásiť sa
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="auth-btn login-btn clickable">
              Prihlásiť
            </router-link>
            <router-link to="/register" class="auth-btn register-btn clickable">
              Registrovať
            </router-link>
          </template>
        </div>

        <button class="mobile-toggle clickable" @click="mobileOpen = !mobileOpen" aria-label="Menu">
          <PhList v-if="!mobileOpen" :size="22" />
          <PhX v-else :size="22" />
        </button>
      </div>
    </div>

    <!-- MOBILE DROPDOWN -->
    <div class="mobile-menu" :class="{ 'is-open': mobileOpen }">
      <form class="mobile-search" @submit.prevent="handleSearch">
        <PhMagnifyingGlass :size="16" class="mobile-search-icon" />
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Hľadať nástroj..."
          class="mobile-search-input"
          @keyup.enter="handleSearch"
        />
      </form>
      <template v-for="cat in categories" :key="cat.name">
        <router-link
          v-if="cat.internal"
          :to="cat.href"
          class="mobile-link clickable"
          :class="{ active: $route.path === cat.href }"
          @click="closeMobile"
        >
          {{ cat.name }}
        </router-link>
        <a
          v-else
          :href="cat.href"
          target="_blank"
          rel="noopener"
          class="mobile-link clickable"
          @click="closeMobile"
        >
          {{ cat.name }}
        </a>
      </template>

      <!-- Mobile Auth -->
      <div class="mobile-auth-divider"></div>
      <template v-if="authStore.isLoggedIn">
        <div class="mobile-user-info">
          <div class="mobile-avatar">
            <img v-if="authStore.avatarUrl" :src="authStore.avatarUrl" :alt="authStore.displayName" />
            <PhUser v-else :size="14" />
          </div>
          <span class="mobile-user-name">{{ authStore.displayName }}</span>
        </div>
        <button class="mobile-link mobile-logout clickable" @click="handleLogout">
          <PhSignOut :size="14" />
          Odhlásiť sa
        </button>
      </template>
      <template v-else>
        <router-link to="/login" class="mobile-link clickable" @click="closeMobile">
          Prihlásiť sa
        </router-link>
        <router-link to="/register" class="mobile-link mobile-register clickable" @click="closeMobile">
          Zaregistrovať sa
        </router-link>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PhMagnifyingGlass, PhCaretDown, PhList, PhX, PhUser, PhSignOut } from '@phosphor-icons/vue'
import { store } from '../../store/toolStore'
import { authStore } from '../../store/authStore'

const router = useRouter()
const route = useRoute()

const isScrolled = ref(false)
const mobileOpen = ref(false)
const menuOpen = ref(false)
const userMenuOpen = ref(false)
const searchQuery = ref('')

const categories = [
  { name: 'Domov', href: '/', internal: true },
  { name: 'AI Nástroje', href: '/ai/ai-chat', internal: true },
  { name: 'Médiá & Konverzie', href: '/media/pdf-word', internal: true },
  { name: 'Foto & Dizajn', href: '/design/favicon-gen', internal: true },
  { name: 'Text & Písanie', href: '/text/word-counter', internal: true },
  { name: 'Kód & Technológie', href: '/dev/json-format', internal: true },
  { name: '🎓 Škola & Veda', href: '/edu/citation-gen', internal: true },
  { name: '✈️ Cestovanie', href: '/travel/currency-conv', internal: true },
  { name: 'Marketing & Sociálne', href: '/marketing/utm-builder', internal: true },
  { name: 'Financie & Biznis', href: '/finance/loan-calc', internal: true },
  { name: 'Zábava & Fun', href: '/fun/wheel-fortune', internal: true },
  { name: '—', href: '#', internal: true },
  { name: 'AIWai.news', href: 'https://aiwai.news', internal: false },
  { name: 'AIWai.app', href: 'https://aiwai.app', internal: false },
]

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    store.searchQuery = searchQuery.value.trim()
    store.openSearch()
    closeMobile()
    searchQuery.value = ''
  }
}

const closeMobile = () => {
  mobileOpen.value = false
}

const handleLogout = async () => {
  await authStore.logout()
  userMenuOpen.value = false
  closeMobile()
  router.push('/')
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
/* ── Base ── */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 56px;
  z-index: 1000;
  border-bottom: 1px solid var(--border-dim);
  background: var(--bg-deep);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  position: relative;
}

/* ── LEFT ── */
.nav-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Dropdown */
.dropdown-wrap {
  position: relative;
}

.menu-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.62rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  transition: color 0.2s;
  white-space: nowrap;
}

.menu-trigger:hover { color: var(--text-primary); }

.caret {
  transition: transform 0.3s ease;
}

.dropdown-wrap.open .caret {
  transform: rotate(180deg);
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: 200px;
  border-radius: 18px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  /* Hidden by default */
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
  pointer-events: none;
}

.dropdown-wrap.open .dropdown-panel,
.dropdown-wrap:hover .dropdown-panel {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  transition: all 0.2s;
}

.dropdown-item:hover {
  color: var(--text-primary);
  background: rgba(197, 169, 106, 0.08);
}

.dropdown-item.active {
  background: var(--accent-gold);
  color: var(--bg-deep);
}

/* Search */
.search-form {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 100px;
  padding: 0 0.75rem;
  transition: border-color 0.3s, background 0.3s;
  overflow: hidden;
}

.search-form:focus-within {
  border-color: rgba(197, 169, 106, 0.4);
  background: rgba(255,255,255,0.06);
}

.search-icon {
  color: var(--text-muted);
  padding: 0.5rem 0.35rem 0.5rem 0;
  transition: color 0.2s;
  flex-shrink: 0;
}

.search-form:focus-within .search-icon { color: var(--accent-gold); }

.search-input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.62rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-primary);
  width: 5rem;
  transition: width 0.4s ease;
  padding: 0.5rem 0;
}

.search-input:focus { width: 9rem; }
.search-input::placeholder { color: var(--text-dim); }

/* ── CENTER LOGO ── */
.logo-area {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  white-space: nowrap;
}

.logo-aiwai {
  font-family: var(--font-syne);
  font-weight: 900;
  font-size: 1.35rem;
  letter-spacing: -0.02em;
  line-height: 1;
  background: linear-gradient(135deg, var(--text-primary) 0%, rgba(247,244,238,0.5) 50%, var(--text-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
}

.logo-img {
  height: 1.85rem;
  width: auto;
  object-fit: contain;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-area:hover .logo-img {
  transform: scale(1.12) rotate(6deg);
}

.logo-tools {
  font-weight: 900;
  font-size: 0.55rem;
  color: var(--accent-gold);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-top: 2px;
}

/* ── RIGHT ── */
.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  min-width: 180px;
}

/* Auth area */
.auth-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.auth-btn {
  font-size: 0.62rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s;
  white-space: nowrap;
}

.login-btn {
  color: var(--text-muted);
}

.login-btn:hover {
  color: var(--text-primary);
}

.register-btn {
  background: var(--accent-gold);
  color: var(--bg-deep);
}

.register-btn:hover {
  background: var(--accent-gold-light);
}

/* User menu */
.user-menu-wrap {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.62rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
  transition: color 0.2s;
}

.user-trigger:hover { color: var(--text-primary); }

.user-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--bg-soft);
  border: 1px solid var(--border-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 160px;
  border-radius: 14px;
  padding: 0.4rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
  pointer-events: none;
}

.user-menu-wrap.open .user-dropdown,
.user-menu-wrap:hover .user-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}

.logout-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  transition: all 0.2s;
}

.logout-item:hover {
  color: #ff8080;
  background: rgba(255,80,80,0.08);
}

.mobile-toggle {
  display: none;
  color: var(--text-primary);
  padding: 0.5rem;
}

/* ── MOBILE MENU ── */
.mobile-menu {
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 1.25rem 1rem 1.5rem;
  background: rgba(5, 5, 8, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-dim);
  /* Animation */
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transform-origin: top;
  transition: max-height 0.35s ease, opacity 0.3s ease, padding 0.3s ease;
}

.mobile-menu.is-open {
  max-height: 400px;
  opacity: 1;
}

.mobile-search {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border-dim);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  width: 90%;
  margin-bottom: 0.5rem;
}

.mobile-search-icon { color: var(--text-muted); flex-shrink: 0; }

.mobile-search-input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 0.9rem;
  width: 100%;
}

.mobile-link {
  display: block;
  width: 90%;
  padding: 0.9rem 1.25rem;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-align: center;
  border-radius: 12px;
  transition: all 0.2s;
}

.mobile-link:hover {
  color: var(--text-primary);
  background: rgba(197, 169, 106, 0.07);
}

.mobile-link.active {
  color: var(--accent-gold);
  background: rgba(197, 169, 106, 0.1);
}

/* ── Mobile auth ── */
.mobile-auth-divider {
  width: 90%;
  height: 1px;
  background: var(--border-dim);
  margin: 0.5rem 0;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.mobile-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg-soft);
  border: 1px solid var(--border-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.mobile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-user-name {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #ff8080 !important;
}

.mobile-logout:hover {
  background: rgba(255,80,80,0.08) !important;
  color: #ff8080 !important;
}

.mobile-register {
  color: var(--accent-gold) !important;
  border: 1px solid rgba(197,169,106,0.2);
}

.mobile-register:hover {
  background: rgba(197,169,106,0.08) !important;
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .nav-left {
    display: none;
  }

  .desktop-only {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }

  .logo-area {
    position: static;
    transform: none;
  }

  .navbar-inner {
    justify-content: space-between;
  }

  .nav-right {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .logo-aiwai { font-size: 1.4rem; }
  .logo-img { height: 1.7rem; }
  .logo-tools { font-size: 0.5rem; }
}
</style>
