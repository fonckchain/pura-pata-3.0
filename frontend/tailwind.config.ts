import type { Config } from "tailwindcss";

const config: Config = {
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
        primary: {
          50: '#fef3f2',
          100: '#fee5e2',
          200: '#fecfca',
          300: '#fdada5',
          400: '#fa7d71',
          500: '#f15a48',
          600: '#de3b26',
          700: '#bb2f1c',
          800: '#9a291b',
          900: '#80281d',
          950: '#461109',
        },
      },
    },
  },
  plugins: [],
};
export default config;
