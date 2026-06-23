/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#05050A",
        "accent-pink": "#FF2D78",
        "accent-orange": "#FF6B35",
        "accent-gold": "#FFB800",
        "accent-cyan": "#00D4FF",
        "text-primary": "#F5F0FF",
        "text-muted": "rgba(245, 240, 255, 0.4)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
    },
  },
  plugins: [],
};
