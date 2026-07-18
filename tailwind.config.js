/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Palette pulled 1:1 from the prototype so nothing needs re-guessing later
      colors: {
        cream: "#FAF7F2",   // page background
        sand: "#F1ECE1",    // alternating section background
        terracotta: "#8B9AA5", // primary accent / CTA
        // CTA banner color for consistent usage via `bg-cta-banner`
        "cta-banner": "#5C6B52C1", // 76% opacity to match prototype
        sage: {
          light: "#A8C3A0",
          DEFAULT: "#7A9471",
          dark: "#3F5A38",
        },
        ink: "#2B2A25",     // headings
        charcoal: "#33312C",// nav text / body
        body: "#4E4B44",    // paragraph text
        muted: "#8A8677",   // captions / fine print
      },
      fontFamily: {
        serif: ["Lora", "serif"],   // headings
        sans: ["Work Sans", "sans-serif"], // body/UI
      },
      borderRadius: {
        xl2: "28px", // matches the dark CTA banner radius in the prototype
      },
    },
  },
  plugins: [],
};