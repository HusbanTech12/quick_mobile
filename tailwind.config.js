/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: '#0066ff',
        accent: '#00a86b',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        background: '#09090b',
        card: '#18181b',
        foreground: '#fafafa',
        muted: '#71717a',
        border: '#27272a',
      },
    },
  },
  plugins: [],
};
