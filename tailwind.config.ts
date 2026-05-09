import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 6px 18px rgba(0, 0, 0, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
