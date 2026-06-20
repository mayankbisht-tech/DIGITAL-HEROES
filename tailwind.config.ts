import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Khata palette
        navy:    "#1C1A17",   // page background (warm charcoal)
        paper:   "#F4ECDA",   // card surface
        gold:    "#C9962B",   // headings, brand, CTA
        magenta: "#95275D",   // margin rule + final total ONLY
        stone:   "#7A7466",   // secondary text, hairlines, captions (inside card)
        ink:     "#2B2B2B",   // primary body text
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans:  ["-apple-system", "Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
