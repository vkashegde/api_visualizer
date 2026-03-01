/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dns: '#FF6B35',
        tcp: '#FFD23F',
        tls: '#A78BFA',
        req: '#60A5FA',
        res: '#34D399',
        render: '#F472B6',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px currentColor' },
          '50%': { opacity: 0.8, boxShadow: '0 0 30px currentColor' },
        },
      },
    },
  },
  plugins: [],
}
