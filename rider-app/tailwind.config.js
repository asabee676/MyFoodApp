/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E53935',
          black: '#1A1A1A',
          gray: '#2D2D2D',
          lightGray: '#F5F5F5',
        }
      }
    },
  },
  plugins: [],
}
