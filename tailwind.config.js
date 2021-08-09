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
        blue: {
          DEFAULT: '#3B82F6',
        },
        green: {
          DEFAULT: '#10B981',
        },
        gray: colors.blueGray,
        page:'#F3F5Fd',
        red: {
          DEFAULT: '#FF9D33'
        },
        yellow: {
          DEFAULT: '#FFDF85'
        },
        orange: colors.orange,
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
