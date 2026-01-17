/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'], // Define Poppins como padrão
      },
      colors: {
        // Cores do Sistema
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Temas Personalizados (Opcional, mas bom ter configurado)
        ocean: {
          light: '#e0f2fe',
          DEFAULT: '#0ea5e9',
          dark: '#0369a1',
        },
        sunset: {
          light: '#ffedd5',
          DEFAULT: '#f97316',
          dark: '#c2410c',
        },
        // Adicionando cores semânticas para facilitar troca de tema futuro
        'theme-bg': 'var(--theme-bg)',
        'theme-text': 'var(--theme-text)',
      },
    },
  },
  plugins: [],
};