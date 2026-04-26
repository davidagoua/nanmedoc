import { defineStore } from 'pinia'

type Theme = 'dark' | 'light'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light' as Theme,
  }),

  getters: {
    isDark: (state) => state.theme === 'dark',
  },

  actions: {
    setTheme(theme: Theme) {
      this.theme = theme
    },

    toggle() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      this._apply()
      if (import.meta.client) {
        localStorage.setItem('rh-theme', this.theme)
      }
    },

    _apply() {
      if (!import.meta.client) return
      const root = document.documentElement
      if (this.theme === 'dark') {
        root.classList.add('dark')
        root.classList.remove('light')
      } else {
        root.classList.add('light')
        root.classList.remove('dark')
      }
    },
  },
})
