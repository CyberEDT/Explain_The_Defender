/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ETD Design System - Dark Theme
        brand: {
          defenderBlue: '#2563EB',
          deepCyberBlue: '#1D4ED8',
          electricBlue: '#3B82F6',
          cyberBlack: '#020617',
          darkNavy: '#0F172A',
          securitySlate: '#1E293B',
          securityGreen: '#10B981',
          emeraldGreen: '#22C55E',
          successGreen: '#16A34A',
          white: '#FFFFFF',
          softWhite: '#F8FAFC',
          gray: '#CBD5E1',
        },
        bg: {
          primary: '#020617', // Cyber Black
          secondary: '#0F172A', // Dark Navy
          tertiary: '#1E293B', // Security Slate
          card: 'rgba(15, 23, 42, 0.6)',
          glass: 'rgba(2, 6, 23, 0.7)',
        },
        border: {
          subtle: 'rgba(59, 130, 246, 0.15)', // Card Border from specs
          DEFAULT: 'rgba(59, 130, 246, 0.3)',
          bright: 'rgba(59, 130, 246, 0.6)', 
        },
        // Defense Chain Stage Colors (Keeping legacy for compatibility, mapping to brand)
        detect: { DEFAULT: '#3B82F6', glow: 'rgba(59, 130, 246, 0.25)' },
        triage: { DEFAULT: '#2563EB', glow: 'rgba(37, 99, 235, 0.25)' },
        investigate: { DEFAULT: '#1D4ED8', glow: 'rgba(29, 78, 216, 0.25)' },
        contain: { DEFAULT: '#F59E0B', glow: 'rgba(245, 158, 11, 0.25)' }, // Accent from specs
        eradicate: { DEFAULT: '#EF4444', glow: 'rgba(239, 68, 68, 0.25)' }, // Accent from specs
        recover: { DEFAULT: '#10B981', glow: 'rgba(16, 185, 129, 0.25)' },
        improve: { DEFAULT: '#22C55E', glow: 'rgba(34, 197, 94, 0.25)' },
        // Severity Colors
        severity: {
          info: '#3B82F6',
          low: '#22C55E',
          medium: '#F59E0B',
          high: '#EF4444',
          critical: '#991B1B',
        },
        // Text
        text: {
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
          accent: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'primary-gradient': 'linear-gradient(to right, #2563EB, #06B6D4)',
        'success-gradient': 'linear-gradient(to right, #10B981, #22C55E)',
        'dark-gradient': 'linear-gradient(to bottom right, #020617, #0F172A)',
      },
      boxShadow: {
        'card-glow': '0 0 20px rgba(37, 99, 235, 0.20)',
        'success-glow': '0 0 20px rgba(16, 185, 129, 0.20)',
        'glass': '0 8px 32px rgba(2, 6, 23, 0.4)',
        'card': '0 4px 24px rgba(2, 6, 23, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'flow': 'flow 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        flow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
