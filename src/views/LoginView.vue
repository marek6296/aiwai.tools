<template>
  <div class="auth-page">
    <!-- Background atmosphere -->
    <div class="auth-bg">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
    </div>

    <div class="auth-container">
      <!-- Logo -->
      <router-link to="/" class="auth-logo">
        <span class="logo-aiwai">AIWai</span>
        <img src="/aiwai-logo.png" alt="AIWai Logo" class="logo-img" />
        <span class="logo-tools">Tools</span>
      </router-link>

      <div class="auth-card glass">
        <div class="auth-header">
          <h1 class="auth-title">Vitaj späť</h1>
          <p class="auth-subtitle">Prihlás sa do svojho účtu</p>
        </div>

        <!-- Google OAuth -->
        <button type="button" class="google-btn" @click="handleGoogle" :disabled="googleLoading">
          <span v-if="googleLoading" class="spinner spinner-dark"></span>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {{ googleLoading ? 'Presmerovanie...' : 'Pokračovať cez Google' }}
        </button>

        <div class="or-divider">
          <span class="or-line"></span>
          <span class="or-text">alebo e-mailom</span>
          <span class="or-line"></span>
        </div>

        <form class="auth-form" @submit.prevent="handleLogin">
          <div class="field-group">
            <label class="field-label">E-mail</label>
            <div class="field-wrap" :class="{ focused: emailFocused }">
              <PhEnvelope :size="16" class="field-icon" />
              <input
                type="email"
                v-model="email"
                placeholder="tvoj@email.com"
                class="field-input"
                autocomplete="email"
                required
                @focus="emailFocused = true"
                @blur="emailFocused = false"
              />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Heslo</label>
            <div class="field-wrap" :class="{ focused: passFocused }">
              <PhLock :size="16" class="field-icon" />
              <input
                :type="showPass ? 'text' : 'password'"
                v-model="password"
                placeholder="••••••••"
                class="field-input"
                autocomplete="current-password"
                required
                @focus="passFocused = true"
                @blur="passFocused = false"
              />
              <button type="button" class="eye-btn" @click="showPass = !showPass">
                <PhEye v-if="!showPass" :size="16" />
                <PhEyeSlash v-else :size="16" />
              </button>
            </div>
          </div>

          <div v-if="error" class="auth-error">
            <PhWarning :size="16" />
            {{ error }}
          </div>

          <button type="submit" class="auth-submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <PhSignIn v-else :size="18" />
            {{ loading ? 'Prihlasovanie...' : 'Prihlásiť sa' }}
          </button>
        </form>

        <div class="auth-divider">
          <span>Nemáš účet?</span>
        </div>

        <router-link to="/register" class="auth-alt-btn">
          Zaregistrovať sa
        </router-link>
      </div>

      <p class="auth-note">
        Rovnaký účet funguje na <a href="https://aiwai.news" target="_blank" rel="noopener">AIWai.news</a>
        a <a href="https://aiwai.app" target="_blank" rel="noopener">AIWai.app</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhEnvelope, PhLock, PhEye, PhEyeSlash, PhWarning, PhSignIn } from '@phosphor-icons/vue'
import { authStore } from '../store/authStore'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPass = ref(false)
const loading = ref(false)
const googleLoading = ref(false)
const error = ref('')
const emailFocused = ref(false)
const passFocused = ref(false)

const handleGoogle = async () => {
  googleLoading.value = true
  error.value = ''
  const result = await authStore.loginWithGoogle()
  if (!result.success) {
    error.value = result.error || 'Google prihlásenie zlyhalo'
    googleLoading.value = false
  }
  // On success Supabase redirects — no need to reset loading
}

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    const result = await authStore.login(email.value, password.value)
    if (result.success) {
      router.push('/')
    } else {
      error.value = translateError(result.error)
    }
  } finally {
    loading.value = false
  }
}

const translateError = (msg) => {
  if (!msg) return 'Nastala chyba'
  if (msg.includes('Invalid login credentials')) return 'Nesprávny e-mail alebo heslo'
  if (msg.includes('Email not confirmed')) return 'Potvrď svoju e-mailovú adresu'
  if (msg.includes('Too many requests')) return 'Príliš veľa pokusov, skús neskôr'
  return msg
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: var(--bg-deep);
  padding: 2rem 1rem;
}

.auth-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.12;
}

.glow-1 {
  width: 600px;
  height: 600px;
  background: var(--accent-gold);
  top: -200px;
  left: -200px;
}

.glow-2 {
  width: 400px;
  height: 400px;
  background: #6a5acd;
  bottom: -100px;
  right: -100px;
}

.auth-container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

/* Logo */
.auth-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  margin-bottom: 0.5rem;
}

.logo-aiwai {
  font-family: var(--font-syne);
  font-weight: 900;
  font-size: 2rem;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--text-primary) 0%, rgba(247,244,238,0.5) 50%, var(--text-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
}

.logo-img {
  height: 2.2rem;
  width: auto;
  object-fit: contain;
}

.logo-tools {
  font-weight: 900;
  font-size: 0.65rem;
  color: var(--accent-gold);
  text-transform: uppercase;
  letter-spacing: 0.28em;
  margin-top: 4px;
}

/* Card */
.auth-card {
  width: 100%;
  border-radius: var(--radius-lg);
  padding: 2.5rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-family: var(--font-syne);
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.auth-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 0.4rem;
}

/* Google button */
.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-soft);
  background: rgba(255,255,255,0.04);
  color: var(--text-primary);
  font-family: var(--font-main);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.5rem;
}

.google-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.08);
  border-color: var(--border-bright);
  transform: translateY(-1px);
}

.google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Or divider */
.or-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.25rem 0;
}

.or-line {
  flex: 1;
  height: 1px;
  background: var(--border-dim);
}

.or-text {
  font-size: 0.7rem;
  color: var(--text-dim);
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.spinner-dark {
  border-color: rgba(255,255,255,0.2);
  border-top-color: var(--text-primary);
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.field-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border-dim);
  border-radius: var(--radius-md);
  padding: 0.85rem 1rem;
  transition: border-color 0.2s, background 0.2s;
}

.field-wrap.focused {
  border-color: var(--border-bright);
  background: rgba(255,255,255,0.05);
}

.field-icon {
  color: var(--text-dim);
  flex-shrink: 0;
  transition: color 0.2s;
}

.field-wrap.focused .field-icon {
  color: var(--accent-gold);
}

.field-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.95rem;
  font-family: var(--font-main);
  color: var(--text-primary);
}

.field-input::placeholder {
  color: var(--text-dim);
}

.eye-btn {
  color: var(--text-dim);
  padding: 0;
  transition: color 0.2s;
}

.eye-btn:hover {
  color: var(--text-muted);
}

/* Error */
.auth-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 80, 80, 0.08);
  border: 1px solid rgba(255, 80, 80, 0.2);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #ff8080;
}

/* Submit */
.auth-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: var(--accent-gold);
  color: var(--bg-deep);
  font-family: var(--font-main);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 1rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.auth-submit:hover:not(:disabled) {
  background: var(--accent-gold-light);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(197, 169, 106, 0.3);
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(5,5,8,0.3);
  border-top-color: var(--bg-deep);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Divider */
.auth-divider {
  text-align: center;
  margin: 1.5rem 0 0.75rem;
  font-size: 0.8rem;
  color: var(--text-dim);
}

/* Alt button */
.auth-alt-btn {
  display: block;
  text-align: center;
  padding: 0.9rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-soft);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.2s;
  text-decoration: none;
}

.auth-alt-btn:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  background: rgba(197, 169, 106, 0.06);
}

/* Note */
.auth-note {
  font-size: 0.75rem;
  color: var(--text-dim);
  text-align: center;
}

.auth-note a {
  color: var(--accent-gold);
  text-decoration: none;
}

.auth-note a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.75rem 1.25rem;
  }
}
</style>
