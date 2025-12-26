// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 1. Adicionamos a fonte Poppins como padrão
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        'theme-bg': 'var(--color-bg)',
        'theme-text': 'var(--color-text)',
        'theme-text-muted': 'var(--color-text-muted)',
        'theme-button-bg': 'var(--color-button-bg)',
        'theme-button-text': 'var(--color-button-text)',
        'theme-button-hover-bg': 'var(--color-button-hover-bg)',
        'theme-image-border': 'var(--color-image-border)',
        ocean: { start: '#1cb5e0', end: '#000046' },
        sunset: { start: '#ff7e5f', end: '#feb47b' },
        forest: { bg: '#1A4D2E', text: '#FAF3E0' },
        bubblegum: { bg: '#FFC0CB', textdark: '#333333', buttonText: '#D14A89' }
      },
      backgroundImage: {
        'gradient-ocean': 'linear-gradient(to right, var(--color-ocean-start, #1cb5e0), var(--color-ocean-end, #000046))',
        'gradient-sunset': 'linear-gradient(to right, var(--color-sunset-start, #ff7e5f), var(--color-sunset-end, #feb47b))',
      }
    },
  },
  plugins: [],
};

export default config;