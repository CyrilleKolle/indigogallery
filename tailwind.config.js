/** @type {import('tailwindcss').Config} */
export const content = [
  "./app/**/*.{ts,tsx}",
  "./pages/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
];
export const theme = {
  extend: {
    fontFamily: {
      bytebounce: ["var(--font-bytebounce)", "sans-serif"],
    },
  },
};
export const plugins = [];
export const darkMode = "class"; // Enable dark mode support
