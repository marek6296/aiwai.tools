<template>
  <div class="auth-page">

    <!-- ══ LEFT PANEL ══ -->
    <div class="auth-left">
      <div class="left-glow-1"></div>
      <div class="left-glow-2"></div>

      <router-link to="/" class="auth-logo">
        <span class="logo-aiwai">AIWai</span>
        <img src="/aiwai-logo.png" alt="AIWai" class="logo-img" />
        <span class="logo-tools">Tools</span>
      </router-link>

      <div class="left-content">
        <p class="left-eyebrow">Platforma nástrojov</p>
        <h1 class="left-heading">Vitajte<br />späť.</h1>
        <p class="left-sub">Prihláste sa do svojho účtu<br />a pokračujte v práci.</p>

        <div class="left-badges">
          <span class="badge">100+ nástrojov</span>
          <span class="badge">Zadarmo</span>
          <span class="badge">Zdieľaný účet</span>
        </div>
      </div>

      <p class="left-note">
        Rovnaký účet funguje na
        <a href="https://aiwai.news" target="_blank" rel="noopener">AIWai.news</a>
        a <a href="https://aiwai.app" target="_blank" rel="noopener">AIWai.app</a>
      </p>
    </div>

    <!-- ══ RIGHT PANEL ══ -->
    <div class="auth-right">
      <div class="auth-form-wrap">

        <div class="form-header">
          <h2 class="form-title">Prihlásenie</h2>
          <p class="form-sub">Zadajte údaje pre prístup k nástrojom.</p>
        </div>

        <!-- Google -->
        <button type="button" class="google-btn" @click="handleGoogle" :disabled="googleLoading">
          <span v-if="googleLoading" class="spinner spinner-light"></span>
          <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none">
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

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="form-fields">
          <div class="field-group">
            <label class="field-label">Email</label>
            <input
              type="email"
              v-model="email"
              placeholder="vas@email.sk"
              class="field-input"
              :class="{ focused: emailFocused }"
              autocomplete="email"
              required
              @focus="emailFocused = true"
              @blur="emailFocused = false"
            />
          </div>

          <div class="field-group">
            <label class="field-label">Heslo</label>
            <div class="pass-wrap" :class="{ focused: passFocused }">
              <input
                :type="showPass ? 'text' : 'password'"
                v-model="password"
                placeholder="Vaše heslo"
                class="field-input pass-input"
                autocomplete="current-password"
                required
                @focus="passFocused = true"
                @blur="passFocused = false"
              />
              <button type="button" class="eye-btn" @click="showPass = !showPass">
                <PhEye v-if="!showPass" :size="15" />
                <PhEyeSlash v-else :size="15" />
              </button>
            </div>
          </div>

          <div v-if="error" class="auth-error">
            <PhWarning :size="15" />
            {{ error }}
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Prihlasovanie...' : 'Prihlásiť sa' }}
          </button>
        </form>

        <p class="switch-link">
          Nemáte účet?
          <router-link to="/register">Zaregistrujte sa →</router-link>
        </p>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhEye, PhEyeSlash, PhWarning } from '@phosphor-icons/vue'
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
/* ── Page ── */
.auth-page {
  display: flex;
  min-height: 100vh;
  background: var(--bg-deep);
}

/* ══ LEFT ══ */
.auth-left {
  position: relative;
  width: 46%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.5rem 3rem;
  overflow: hidden;
  background: linear-gradient(160deg, #0c0b10 0%, #050508 100%);
  border-right: 1px solid var(--border-dim);
}

.left-glow-1 {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: var(--accent-gold);
  opacity: 0.07;
  filter: blur(100px);
  top: -150px;
  left: -150px;
  pointer-events: none;
}

.left-glow-2 {
  position: absolute;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: #6a5acd;
  opacity: 0.08;
  filter: blur(90px);
  bottom: -100px;
  right: -80px;
  pointer-events: none;
}

/* Logo */
.auth-logo {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  position: relative;
  z-index: 1;
}

.logo-aiwai {
  font-family: var(--font-syne);
  font-weight: 900;
  font-size: 1.5rem;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  background: linear-gradient(135deg, var(--text-primary) 0%, rgba(247,244,238,0.55) 50%, var(--text-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-img {
  height: 1.7rem;
  width: auto;
  object-fit: contain;
}

.logo-tools {
  font-size: 0.55rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.28em;
  color: var(--accent-gold);
  margin-top: 3px;
}

/* Left content */
.left-content {
  position: relative;
  z-index: 1;
}

.left-eyebrow {
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent-gold);
  margin-bottom: 1.25rem;
}

.left-heading {
  font-family: var(--font-syne);
  font-size: clamp(2.8rem, 4.5vw, 4rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.18;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.left-sub {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.left-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badge {
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.35rem 0.75rem;
  border-radius: 100px;
  border: 1px solid var(--border-soft);
  color: var(--text-dim);
  background: rgba(255,255,255,0.02);
}

/* Left footer note */
.left-note {
  font-size: 0.72rem;
  color: var(--text-dim);
  position: relative;
  z-index: 1;
}

.left-note a {
  color: var(--accent-gold);
  text-decoration: none;
}

.left-note a:hover {
  text-decoration: underline;
}

/* ══ RIGHT ══ */
.auth-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 2rem;
  overflow-y: auto;
}

.auth-form-wrap {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 0.5rem;
}

.form-header {
  margin-bottom: 1.75rem;
}

.form-title {
  font-family: var(--font-syne);
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin-bottom: 0.35rem;
  overflow: visible;
  line-height: 1.2;
  padding-top: 0.1rem;
}

.form-sub {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Google */
.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--border-soft);
  background: rgba(255,255,255,0.03);
  color: var(--text-primary);
  font-family: var(--font-main);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1.25rem;
}

.google-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.07);
  border-color: var(--border-bright);
}

.google-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Or divider */
.or-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.or-line {
  flex: 1;
  height: 1px;
  background: var(--border-dim);
}

.or-text {
  font-size: 0.62rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  white-space: nowrap;
}

/* Form fields */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-size: 0.62rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text-muted);
}

.field-input {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border-dim);
  outline: none;
  font-size: 0.88rem;
  font-family: var(--font-main);
  color: var(--text-primary);
  transition: border-color 0.2s, background 0.2s;
  box-sizing: border-box;
}

.field-input::placeholder {
  color: var(--text-dim);
}

.field-input:focus,
.field-input.focused {
  border-color: rgba(197,169,106,0.5);
  background: rgba(255,255,255,0.05);
}

/* Password wrap */
.pass-wrap {
  position: relative;
}

.pass-wrap .pass-input {
  padding-right: 2.75rem;
}

.pass-wrap.focused .pass-input {
  border-color: rgba(197,169,106,0.5);
  background: rgba(255,255,255,0.05);
}

.eye-btn {
  position: absolute;
  right: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-dim);
  padding: 0;
  transition: color 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
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
  border: 1px solid rgba(255, 80, 80, 0.18);
  border-radius: 12px;
  padding: 0.7rem 1rem;
  font-size: 0.8rem;
  color: #ff8080;
}

/* Submit */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.9rem;
  border-radius: 14px;
  border: none;
  background: var(--accent-gold);
  color: var(--bg-deep);
  font-family: var(--font-main);
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.25rem;
}

.submit-btn:hover:not(:disabled) {
  background: var(--accent-gold-light);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(197,169,106,0.25);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(5,5,8,0.25);
  border-top-color: var(--bg-deep);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

.spinner-light {
  border-color: rgba(255,255,255,0.15);
  border-top-color: var(--text-primary);
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Switch link */
.switch-link {
  text-align: center;
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 1.5rem;
}

.switch-link a {
  color: var(--accent-gold);
  font-weight: 700;
  text-decoration: none;
  margin-left: 0.25rem;
}

.switch-link a:hover {
  text-decoration: underline;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .auth-page {
    flex-direction: column;
  }

  .auth-left {
    width: 100%;
    min-height: auto;
    padding: 2rem 1.5rem 1.75rem;
    border-right: none;
    border-bottom: 1px solid var(--border-dim);
  }

  .left-heading {
    font-size: 2.4rem;
  }

  .left-sub,
  .left-note {
    display: none;
  }

  .auth-right {
    padding: 2rem 1.25rem 3rem;
  }
}
</style>
