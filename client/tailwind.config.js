/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FEFDFB',
          100: '#FAF9F6',
          200: '#F5F4F0',
          300: '#EDE9E3',
          400: '#DDD9D0',
        },
        ink: {
          DEFAULT: '#2A2724',
          light: '#5C5750',
          muted: '#9C9690',
          faint: '#C4C0BA',
        },
        rose: {
          dust: '#C08088',
          'dust-light': '#F2E8EA',
          'dust-border': '#E0C4C8',
        },
        sage: {
          DEFAULT: '#7A9E82',
          light: '#EAF2EB',
          border: '#C4DCC8',
        },
        slate: {
          warm: '#7A8FA6',
          light: '#EAEEf2',
          border: '#C4CED8',
        },
        amber: {
          warm: '#C49640',
          light: '#F5EDD8',
          border: '#DEC898',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(42,39,36,0.04), 0 4px 12px rgba(42,39,36,0.06)',
        'soft-md': '0 2px 8px rgba(42,39,36,0.05), 0 8px 24px rgba(42,39,36,0.07)',
        'soft-sm': '0 1px 2px rgba(42,39,36,0.04), 0 2px 6px rgba(42,39,36,0.04)',
      },
    },
  },
  plugins: [],
};
