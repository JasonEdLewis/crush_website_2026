import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a0a0a',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#2a2a2a',
          800: '#171717',
          900: '#0a0a0a',
          950: '#050505',
        },
        crush: {
          DEFAULT: '#ff3b1f',
          50:  '#fff1ee',
          100: '#ffe1d9',
          200: '#ffbeae',
          300: '#ff9579',
          400: '#ff6644',
          500: '#ff3b1f',
          600: '#ed2105',
          700: '#c41804',
          800: '#9c170a',
          900: '#7e190d',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Inter Tight"', '"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
      },
      fontSize: {
        // big display sizes used in heros / section heads
        'display-1': ['clamp(2.5rem, 6.5vw, 6rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        'display-2': ['clamp(2rem, 5vw, 4rem)',     { lineHeight: '1.04', letterSpacing: '-0.03em'  }],
        'display-3': ['clamp(1.5rem, 3.5vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
      },
      maxWidth: {
        '8xl': '88rem',
      },
      transitionTimingFunction: {
        'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
