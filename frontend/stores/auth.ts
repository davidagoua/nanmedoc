import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    adminModel: null as Record<string, any> | null,
  }),

  getters: {
    isAdmin: (state): boolean => !!state.token,
  },

  actions: {
    async login(email: string, password: string) {
      const { $pb } = useNuxtApp()
      try {
        const authData = await $pb.collection('_superusers').authWithPassword(email, password)
        this.token = authData.token
        this.adminModel = authData.record
      } catch (err: any) {
        throw new Error(err?.message ?? 'Identifiants invalides')
      }
    },

    logout() {
      const { $pb } = useNuxtApp()
      $pb.authStore.clear()
      this.token = ''
      this.adminModel = null
      navigateTo('/admin/login')
    },

    /** Sync store from $pb.authStore (e.g. after cookie restore on SSR) */
    syncFromPb() {
      const { $pb } = useNuxtApp()
      if ($pb.authStore.isValid) {
        this.token = $pb.authStore.token
        this.adminModel = $pb.authStore.record as Record<string, any>
      } else {
        this.token = ''
        this.adminModel = null
      }
    },
  },
})
