/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",       // for app directory
      "./pages/**/*.{js,ts,jsx,tsx}",     // pages directory
      "./components/**/*.{js,ts,jsx,tsx}" // components
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };