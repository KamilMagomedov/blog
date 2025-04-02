import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "custom-text": "url('/bg_1.jpg')",
      },
      keyframes: {
        likeBounce: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "30%": { transform: "translateY(30px)", opacity: "0" },
          "60%": { transform: "translateY(-30px)", opacity: "1" },
          "80%": { transform: "translateY(10px)" },
          "100%": { transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        like: "likeBounce 0.8s ease-in-out",
        fadeOut: "fadeOut 3s ease-in-out forwards",
      },
    },
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
  },
  variants: {
    extend: {
      scale: ["after", "before"],
    },
  },
} satisfies Config;
