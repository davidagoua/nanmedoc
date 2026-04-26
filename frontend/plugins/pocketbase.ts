import PocketBase from 'pocketbase'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const pb = new PocketBase(config.public.pocketbaseUrl as string)

  // Restore auth from cookie/localStorage on page load (client-side only)
  if (import.meta.client) {
    pb.authStore.loadFromCookie(document.cookie)
    pb.authStore.onChange(() => {
      document.cookie = pb.authStore.exportToCookie({ httpOnly: false, secure: false })
    })
  }

  return {
    provide: { pb },
  }
})
