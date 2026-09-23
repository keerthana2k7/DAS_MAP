/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dev: {
          bg: '#0a0d14',
          card: '#111726',
          cardHover: '#161f33',
          border: '#1e293b',
          borderLight: '#334155',
          text: '#f1f5f9',
          muted: '#94a3b8',
          accent: '#8b5cf6',
          accentHover: '#7c3aed',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
