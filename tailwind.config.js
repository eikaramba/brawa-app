const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontSize: {
      xs: ['12', '3'],
      sm: ['14', '4'],
      md: ['16', '5'],
      lg: ['18', '6'],
      xl: ['22', '6'],
      '2xl': ['24', '10'],
      '3xl': ['26', '10']
    },

    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        gray: colors.blueGray,
        page:'#F3F5Fd',
        yellow: {
          '200': '#FDE68A',
          '300': '#FCD34D',
          '400': '#FBBF24',
          DEFAULT: '#FFDF85',
          '600': '#D97706',
          '700': '#B45309',
          '800': '#92400E',
          '900': '#78350F'
        },
        orange: {DEFAULT:'#FF9D33'},
        dark: '#3F3F3F'
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['highlighted'],
      textColor: ['highlighted'],
    },
  },
  plugins: [
    plugin(function({ addVariant, e }) {
      addVariant('highlighted', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`highlighted${separator}${className}`)}:highlighted`
        })
      })
    })
  ]
}
