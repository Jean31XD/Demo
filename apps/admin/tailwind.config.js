/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Command-center palette
        cmd:    '#0a0a0c',
        panel:  '#111318',
        surface:'#161b22',
        border: '#21262d',
        // Brand accent
        amber: {
          DEFAULT: '#f97316',
          dim:     '#c2440e',
          glow:    'rgba(249,115,22,0.15)',
        },
        // Data accent
        cyan: {
          DEFAULT: '#06b6d4',
          dim:     '#0891b2',
        },
        // Text
        chalk: '#e6edf3',
        muted: '#8b949e',
        // Status
        ok:   '#3fb950',
        warn: '#d29922',
        fail: '#f85149',
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
        sans:    ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        amber: '0 0 20px rgba(249,115,22,0.2)',
        panel: '0 1px 0 rgba(255,255,255,0.04)',
      },
    },
  },
  plugins: [],
};
