/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0f172a',
        panel: '#111827',
      },
      boxShadow: {
        glow: '0 0 25px rgba(34,211,238,0.2)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(34,211,238,0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(34,211,238,0.35)' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
