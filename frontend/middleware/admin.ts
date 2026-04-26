export default defineNuxtRouteMiddleware((_to, _from) => {
  // Only run on client-side
  if (import.meta.server) return

  const auth = useAuthStore()
  const { $pb } = useNuxtApp()

  // Sync store with current PocketBase auth state
  auth.syncFromPb()

  if (!$pb.authStore.isValid || !auth.isAdmin) {
    return navigateTo('/admin/login', { replace: true })
  }
})
