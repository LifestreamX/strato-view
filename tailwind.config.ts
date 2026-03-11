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
        aviation: {
          dark: '#0a1929',
          blue: '#1976d2',
          light: '#42a5f5',
          accent: '#ff6b35',
        },
      },
    },
  },
  plugins: [],
}
export default config
