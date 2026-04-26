import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#f0f4ff',
          100: '#dde6f9',
          200: '#c3d1f5',
          300: '#9ab3ed',
          400: '#6b8de3',
          500: '#4a6bd6',
          600: '#3551c5',
          700: '#2d42ae',
          800: '#29398d',
          900: '#263370',
          950: '#0f172a',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        'fluid-sm': 'clamp(0.875rem, 2vw, 1rem)',
        'fluid-base': 'clamp(1rem, 2.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 3vw, 1.5rem)',
        'fluid-xl': 'clamp(1.5rem, 4vw, 2.25rem)',
        'fluid-2xl': 'clamp(2rem, 5vw, 3rem)',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
      boxShadow: {
        'card': '0 2px 8px 0 rgba(15, 23, 42, 0.15)',
        'card-hover': '0 8px 24px 0 rgba(15, 23, 42, 0.2)',
      },
    },
  },
  plugins: [],
} satisfies Config
