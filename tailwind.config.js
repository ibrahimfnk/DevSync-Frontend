// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
}