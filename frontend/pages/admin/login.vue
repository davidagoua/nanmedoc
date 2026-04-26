<template>
  <div class="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
    <Head>
      <Title>Administration – Connexion</Title>
    </Head>

    <div class="w-full max-w-sm animate-slide-up">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-2xl bg-gold-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span class="text-navy-950 font-bold text-2xl">♪</span>
        </div>
        <h1 class="font-display text-2xl font-bold text-white">RepertoryHub</h1>
        <p class="text-slate-400 text-sm mt-1">Espace d'administration</p>
      </div>

      <!-- Form -->
      <div class="card p-6 space-y-4">
        <div>
          <label class="label" for="email">Email administrateur</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="input"
            placeholder="admin@example.com"
            autocomplete="username"
            required
            @keydown.enter="login"
          />
        </div>
        <div>
          <label class="label" for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="input"
            placeholder="••••••••"
            autocomplete="current-password"
            required
            @keydown.enter="login"
          />
        </div>

        <p v-if="errorMsg" class="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
          {{ errorMsg }}
        </p>

        <button
          :disabled="loading || !email || !password"
          class="btn-primary w-full"
          @click="login"
        >
          <AppIcon :name="loading ? 'loader' : 'check'" />
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </div>

      <p class="text-center text-slate-600 text-xs mt-6">
        Accès réservé aux administrateurs
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, ssr: false })

const auth    = useAuthStore()
const email   = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

// Already logged in → redirect
onMounted(() => {
  const { $pb } = useNuxtApp()
  if ($pb.authStore.isValid) navigateTo('/admin/dashboard', { replace: true })
})

const login = async () => {
  if (!email.value || !password.value) return
  loading.value  = true
  errorMsg.value = ''
  try {
    await auth.login(email.value, password.value)
    navigateTo('/admin/dashboard', { replace: true })
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'Identifiants incorrects'
  } finally {
    loading.value = false
  }
}
</script>
