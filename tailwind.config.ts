import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        'wii-blue': '#00a0dc',
        'wii-light-blue': '#e8f4fc',
        'wii-white': '#ffffff',
        'wii-gray': '#f0f0f0',
        'wii-text': '#333333',
      },
    },
  },
  plugins: [],
};

export default config;
