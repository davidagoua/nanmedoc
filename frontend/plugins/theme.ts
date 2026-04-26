/**
 * Applique le thème (dark/light) le plus tôt possible pour éviter le FOUC.
 * N'utilise PAS Pinia ici (pas encore monté) — on lit localStorage directement
 * et on applique la classe sur <html>. Le store Pinia se synchronise depuis le DOM.
 */
export default defineNuxtPlugin({
  name: 'theme',
  enforce: 'pre',
  setup(nuxtApp) {
    // Côté serveur : ne rien faire (pas de window)
    if (import.meta.server) return

    // 1. Lire la préférence stockée, par défaut 'light'
    const stored = localStorage.getItem('rh-theme') as 'dark' | 'light' | null
    const theme = stored ?? 'light'

    // 2. Appliquer immédiatement sur <html> (sans Pinia)
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)

    // 3. Après que Pinia soit prêt, synchroniser le store
    nuxtApp.hook('app:created', () => {
      const themeStore = useThemeStore()
      themeStore.setTheme(theme)
    })
  },
})
