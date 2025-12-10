/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Golden color scheme from the logo
        primary: {
          DEFAULT: '#D4AF37', // Main golden color from the logo
          50: '#faf7f0',
          100: '#f5edd8',
          200: '#ebd8b1',
          300: '#e1c38a',
          400: '#d7ae63',
          500: '#D4AF37', // Main color
          600: '#a98c2c',
          700: '#7e6921',
          800: '#544616',
          900: '#2a230b',
          950: '#151105',
        },
        // Secondary colors that complement the golden primary
        secondary: {
          DEFAULT: '#1a1a1a', // Dark color for text and backgrounds
          50: '#f5f5f5',
          100: '#ebebeb',
          200: '#cccccc',
          300: '#adadad',
          400: '#8f8f8f',
          500: '#707070',
          600: '#525252',
          700: '#333333',
          800: '#1a1a1a',
          900: '#0d0d0d',
        },
        // Accent colors
        accent: {
          DEFAULT: '#1a1a1a', // Dark accent
          light: '#2d2d2d',
          dark: '#0d0d0d',
        },
        // Success, warning, and error colors
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
          dark: '#065f46',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
          dark: '#92400e',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
          dark: '#991b1b',
        },
        // Background colors
        background: {
          light: '#ffffff',
          dark: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
