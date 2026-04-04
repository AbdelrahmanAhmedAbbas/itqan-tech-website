/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        Void: '#09090B',
        Ink: '#18181B',
        Steel: '#272A33',
        Muted: '#5A5F6E',
        'Muted-Light': '#8B91A0',
        Border: '#CCD5E3',
        Surface: '#F3F5F8',
        Snow: '#F8FAFC',
        White: '#FFFFFF',
        Accent: '#185ADB',
        'Accent-Hover': '#3B75E5',
        'Accent-Light': '#5D8CE6',
        'Accent-Deep': '#1348AF',
        'Accent-Muted': '#185ADB1A',
        Sand: '#B88A5A',
        'Sand-Soft': '#F3E4D2',
        Mint: '#2F7D68',
        'Mint-Soft': '#DCEFE8',
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans Arabic', 'sans-serif'],
        serif: ['Playfair Display', 'Noto Naskh Arabic', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Fluid display type scale — use clamp() for smooth scaling on marketing/content pages.
        // display-xl  → hero editorial serif word (~56px → 160px)
        // display-lg  → hero headline, philosophy h2 (~36px → 72px)
        // display-md  → section headings: CTA, Process, FAQ (~28px → 48px)
        // display-sm  → sub-headings: BuiltFor (~22px → 32px)
        'display-xl': ['clamp(3.5rem, 11vw, 10rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.25rem, 5vw, 4.5rem)',  { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 3rem)',  { lineHeight: '1.1',  letterSpacing: '-0.015em' }],
        'display-sm': ['clamp(1.375rem, 2.5vw, 2rem)', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
      },
    },
  },
  plugins: [],
}
