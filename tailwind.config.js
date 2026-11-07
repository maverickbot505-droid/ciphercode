/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for CipherCode brand
        cipher: {
          bg: '#0f172a',       // Dark slate
          card: '#1e293b',     // Lighter slate
          primary: '#3b82f6',  // Blue
          secondary: '#8b5cf6', // Purple
          success: '#22c55e',  // Green
          warning: '#f59e0b',  // Amber
          danger: '#ef4444',   // Red
          text: {
            primary: '#f8fafc',
            secondary: '#94a3b8',
            muted: '#64748b',
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
