/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        navy: {
          50:  '#eef1f8',
          100: '#d5ddf0',
          200: '#aabae0',
          300: '#7a91cc',
          400: '#5470bc',
          500: '#3a57ad',
          600: '#2c4494',
          700: '#1e2f6e',
          800: '#152051',
          900: '#0d1535',
          950: '#080d22',
        },
        gold: {
          300: '#f5d98a',
          400: '#f0c948',
          500: '#e8b318',
          600: '#c99510',
          700: '#a37409',
        },
      },
      backgroundImage: {
        'portal-gradient': 'linear-gradient(135deg, #080d22 0%, #0d1535 40%, #1e2f6e 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        'gold-gradient': 'linear-gradient(90deg, #e8b318 0%, #f5d98a 50%, #e8b318 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glass-hover': '0 16px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
        'gold': '0 4px 20px rgba(232, 179, 24, 0.3)',
        'result-card': '0 20px 60px rgba(0,0,0,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 4px 20px rgba(232, 179, 24, 0.2)' },
          '50%': { boxShadow: '0 4px 32px rgba(232, 179, 24, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
