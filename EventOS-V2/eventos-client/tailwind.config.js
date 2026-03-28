/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Core Dark Palette
          bg:        '#0C0C0F',      // deepest background
          surface:   '#13131A',      // card/section bg
          card:      '#1A1A25',      // elevated card
          border:    '#2A2A3A',      // subtle borders
          muted:     '#3A3A50',      // muted borders/dividers

          // Text Scale
          white:     '#F4F4F6',
          light:     '#B8B8CA',
          mid:       '#767690',
          dim:       '#4A4A65',

          // Accent — warm amber/gold, not AI purple
          accent:    '#D4A853',      // premium gold
          accentLow: '#261E0E',      // gold tint bg
          accentHov: '#E8BF71',

          // Semantic
          success:   '#22C55E',
          warn:      '#F59E0B',
          error:     '#EF4444',
          info:      '#60A5FA',

          // Legacy aliases
          black:     '#0C0C0F',
          dark:      '#F4F4F6',
          tag:       '#1A1A25',
          tagText:   '#B8B8CA',
          accentHov2:'#E8BF71',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in-up':   'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':      'fadeIn 0.4s ease-out forwards',
        'slide-up':     'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in':     'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'shimmer':      'shimmer 2s linear infinite',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite',
        'float':        'float 5s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,168,83,0.15)' },
          '50%':      { boxShadow: '0 0 40px rgba(212,168,83,0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-gold': '0 0 30px rgba(212,168,83,0.2)',
        'glow-sm':   '0 0 15px rgba(212,168,83,0.12)',
        'card':      '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':'0 8px 40px rgba(0,0,0,0.6)',
        'modal':     '0 24px 80px rgba(0,0,0,0.7)',
      },
    },
  },
  plugins: [],
}
