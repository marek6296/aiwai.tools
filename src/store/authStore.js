import { reactive } from 'vue'
import { supabase } from '../lib/supabase'

export const authStore = reactive({
  user: null,
  session: null,
  loading: true,
  error: null,

  get isLoggedIn() {
    return !!authStore.user
  },

  get displayName() {
    if (!authStore.user) return null
    return (
      authStore.user.user_metadata?.full_name ||
      authStore.user.user_metadata?.name ||
      authStore.user.email?.split('@')[0] ||
      'Používateľ'
    )
  },

  get avatarUrl() {
    return authStore.user?.user_metadata?.avatar_url || null
  },

  async init() {
    authStore.loading = true
    try {
      const { data: { session } } = await supabase.auth.getSession()
      authStore.session = session
      authStore.user = session?.user ?? null
    } catch (e) {
      console.error('Auth init error:', e)
    } finally {
      authStore.loading = false
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      authStore.session = session
      authStore.user = session?.user ?? null
    })
  },

  async register(email, password, fullName) {
    authStore.error = null
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    if (error) {
      authStore.error = error.message
      return { success: false, error: error.message }
    }
    return { success: true, data }
  },

  async loginWithGoogle() {
    authStore.error = null
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    if (error) {
      authStore.error = error.message
      return { success: false, error: error.message }
    }
    return { success: true }
  },

  async login(email, password) {
    authStore.error = null
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      authStore.error = error.message
      return { success: false, error: error.message }
    }
    authStore.user = data.user
    authStore.session = data.session
    return { success: true, data }
  },

  async logout() {
    authStore.error = null
    const { error } = await supabase.auth.signOut()
    if (error) {
      authStore.error = error.message
      return { success: false }
    }
    authStore.user = null
    authStore.session = null
    return { success: true }
  },

  clearError() {
    authStore.error = null
  }
})
