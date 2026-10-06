/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: "#FAF8F5",
          subtle: "#F4F0E8",
          card: "#FFFFFF",
          border: "#EBE6DC",
          "border-strong": "#DBD4C5",
        },
        terracotta: {
          50: "#FDF6F3",
          100: "#FCEBE5",
          200: "#F7D3C6",
          300: "#EEB29E",
          400: "#DC8970",
          500: "#C36449",
          600: "#A94E35",
          700: "#8B3C27",
        },
        sage: {
          50: "#F3F7F4",
          100: "#E5EFE8",
          200: "#C9DED0",
          300: "#A3C4AE",
          400: "#75A285",
          500: "#4B735F",
          600: "#3C5D4D",
          700: "#2E483B",
        },
        clay: {
          50: "#FBF7F4",
          100: "#F5ECE5",
          200: "#EBDACF",
          500: "#8E6E5D",
          600: "#745849",
        },
        stone: {
          850: "#201D1A",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        warm: "0 1px 3px rgba(44, 39, 36, 0.04), 0 4px 14px rgba(44, 39, 36, 0.03)",
        "warm-hover": "0 2px 6px rgba(44, 39, 36, 0.06), 0 8px 24px rgba(44, 39, 36, 0.05)",
        "warm-modal": "0 12px 36px rgba(44, 39, 36, 0.09), 0 4px 12px rgba(44, 39, 36, 0.05)",
      },
    },
  },
  plugins: [],
};
