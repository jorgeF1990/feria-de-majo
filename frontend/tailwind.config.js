/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        primary: {
          DEFAULT: '#7A5C3A',
          dark: '#5C4430',
          light: '#9B7B5A',
        },
        secondary: {
          DEFAULT: '#C4A88A',
          light: '#E8DDD0',
        },
        text: {
          primary: '#2D2A26',
          secondary: '#6B6258',
          light: '#9A9288',
        },
        background: '#F8F6F3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(45, 42, 38, 0.06)',
        'medium': '0 4px 20px rgba(45, 42, 38, 0.08)',
        'hard': '0 8px 40px rgba(45, 42, 38, 0.12)',
      },
      borderRadius: {
        'xl': '16px',
      }
    },
  },
  plugins: [],
}