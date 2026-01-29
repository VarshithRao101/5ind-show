/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New Yellow + Gray Theme
        'app-bg': '#0f0f0f',
        'app-bg-secondary': '#181818',
        'card-bg': '#1f1f1f',
        'card-border': '#333333',

        'primary-yellow': '#f5c518',
        'primary-yellow-hover': '#e3b616',
        'primary-yellow-dark': '#d4a815',

        'text-primary': '#f5f5f5',
        'text-secondary': '#b3b3b3',
        'text-muted': '#8a8a8a',

        // Legacy Mappings (converting Red -> Yellow)
        'primary-red': '#f5c518',
        'primary-red-hover': '#e3b616',
        'primary-red-dark': '#d4a815',
        'muted-text': '#8a8a8a',        // Map old muted text
        'muted-text-dark': '#8a8a8a',
        'muted-text-light': '#b3b3b3',

        // Light theme placeholders (forcing dark mode aesthetic mostly, but keeping keys)
        'app-bg-light': '#f5f5f5',
        'card-bg-light': '#ffffff',
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 8px 30px rgba(0,0,0,0.6)',
        'card-hover': '0 12px 45px rgba(245,197,24,0.15)',
        'yellow-glow': '0 0 20px rgba(245, 197, 24, 0.3)',
        'yellow-glow-lg': '0 0 40px rgba(245, 197, 24, 0.4)',

        // Legacy Mappings
        'red-glow': '0 0 20px rgba(245, 197, 24, 0.3)',
        'red-glow-lg': '0 0 40px rgba(245, 197, 24, 0.4)',
        'card-light': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        'glass': '12px',
      },
      borderRadius: {
        'card': '1rem', // 16px
        'button': '0.75rem', // 12px
      },
    },
  },
  plugins: [],
}