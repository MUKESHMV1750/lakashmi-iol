/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#F9F9F4',
        'bg-secondary': '#F5F5ED',
        'sage-green': '#A3B18B',
        'forest-green': '#2C3E2D',
        'dark-olive': '#3A5A40',
        'warm-brown': '#A66E38',
        'terracotta': '#8D5B4C',
        'text-dark': '#2D2D2D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(30px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { '0%': { transform: 'translateY(-10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        bounceSoft: { '0%': { transform: 'scale(0.95)' }, '60%': { transform: 'scale(1.02)' }, '100%': { transform: 'scale(1)' } },
      },
      boxShadow: {
        'card': '0 4px 20px rgba(44, 62, 45, 0.08)',
        'card-hover': '0 8px 30px rgba(44, 62, 45, 0.15)',
        'nav': '0 2px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
