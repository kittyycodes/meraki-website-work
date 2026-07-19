import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6EC',
        'cream-alt': '#F3ECDC',
        charcoal: '#211511',
        'charcoal-alt': '#2E1F18',
        espresso: '#2F1B12',
        ivory: '#F1E9D6',
        'ivory-soft': '#EFDCC4',
        'text-muted-light': '#5c5750',
        'text-muted-dark': '#c9bfae',
        amber: '#C98B52',
        'amber-cta': '#E0952F',
        'sofa-blue': '#7C93A8',
        'sofa-blue-dark': '#8FA8BA',
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        heading: ['var(--font-heading)'],
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        scroll: 'scroll 30s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
