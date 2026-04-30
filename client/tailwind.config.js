/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft:    '0 1px 3px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
        'soft-md': '0 4px 16px rgba(0,0,0,0.4)',
        'soft-sm': '0 1px 2px rgba(0,0,0,0.4)',
        card:    '0 1px 3px rgba(0,0,0,0.5)',
      },
      colors: {
        // Legacy tokens remapped to dark equivalents so History/Compare don't break
        cream: {
          50:  '#1E293B',
          100: '#0F172A',
          200: '#1E293B',
          300: '#334155',
          400: '#475569',
        },
        ink: {
          DEFAULT: '#F1F5F9',
          light:   '#CBD5E1',
          muted:   '#94A3B8',
          faint:   '#64748B',
        },
        'rose-dust':   '#F87171',
        'slate-warm':  '#38BDF8',
        'amber-warm':  '#FCD34D',
        sage: {
          DEFAULT: '#4ADE80',
          light:   'rgba(74,222,128,0.1)',
          border:  'rgba(74,222,128,0.25)',
        },
      },
    },
  },
  plugins: [],
};
