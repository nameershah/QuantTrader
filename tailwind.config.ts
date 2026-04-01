import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slatebg: '#0b1220',
        slatepanel: '#111827',
        neon: '#22d3ee',
        neonAccent: '#a78bfa',
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(34, 211, 238, 0.25), 0 0 24px rgba(34, 211, 238, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
