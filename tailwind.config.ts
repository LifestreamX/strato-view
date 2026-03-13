import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: '#0a0a1e',
          purple: '#9333ea',
          pink: '#ec4899',
          cyan: '#22d3ee',
        },
      },
    },
  },
  plugins: [],
}
export default config
