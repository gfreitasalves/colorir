/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563eb',
          orange: '#f97316',
        },
      },
      keyframes: {
        confettiFall: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0.9' },
        },
      },
      animation: {
        'confetti-fall': 'confettiFall 2s linear forwards',
      },
    },
  },
  plugins: [],
}
