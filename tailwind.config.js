const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    safelist: ['w-0','w-px','w-0.5','w-1','w-1.5','w-2','w-2.5','w-3','w-3.5','w-4','w-5','w-6','w-7','w-8','w-9','w-10','w-11','w-12','w-14','w-16','w-20','w-24','w-28','w-32','w-36','w-40','w-44','w-48','w-52','w-56','w-60','w-64','w-72','w-80','w-96','w-auto','w-1/2','w-1/3','w-2/3','w-1/4','w-2/4','w-3/4','w-1/5','w-2/5','w-3/5','w-4/5','w-1/6','w-2/6','w-3/6','w-4/6','w-5/6','w-1/12','w-2/12','w-3/12','w-4/12','w-5/12','w-6/12','w-7/12','w-8/12','w-9/12','w-10/12','w-11/12','w-full','w-screen','w-min','w-max']
  },
  darkMode: 'class',
  theme: {
    extend: {
      
      colors: {
        primary: colors.blueGray
      },
      fontFamily: {
        sans: ["'Inter'", 'sans-serif']
      },
      fontSize: {
        xs: ['0.6rem', { lineHeight: '1rem' }],
        sm: ['0.75rem', { lineHeight: '1rem' }],
        base: ['0.875rem', { lineHeight: '1.25rem' }],
        lg: ['1rem', { lineHeight: '1.5rem' }],
        xl: ['1.125rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '3xl': ['1.5rem', { lineHeight: '2rem' }],
        '4xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '5xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '6xl': ['3rem', { lineHeight: '1' }],
        '7xl': ['3.75rem', { lineHeight: '1' }],
        '8xl': ['4.5rem', { lineHeight: '1' }],
        '9xl': ['6rem', { lineHeight: '1' }]
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      hidden: ['disabled'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
