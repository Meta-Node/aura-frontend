/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,css,scss}'],
  theme: {
    extend: {
      colors: {
        gray00: '#393939',
        gray10: '#343434',
        gray20: '#585858',
        gray30: '#D9D9D9',
        gray40: '#ECECEC',
        gray50: '#CDCDCD',
        gray60: '#727272',
        gray70: '#E3E3E3',
        gray90: '#D9D9D9',
        purple00: '#C9A2FF',
        error: '#EB5E55',
        purple: '#8341DE',
        purple2: '#D3B2FF',
        orange: '#F4712F',
        'light-orange': '#F09F77',
        green: '#398A4C',
        green10: '#5B9969',
        green20: '#B4E6C0',
        green30: '#D5ECDA',
        'pastel-purple': '#C9A2FF',
        'pastel-purple-25': '#C9A2FF40',
        'pastel-green': '#81CC91',
        'pastel-orange': '#FFAD8C',
        'pastel-blue': '#A5C4FF',
        'green-card': '#C0E6C9',
        'red-card': '#E6C0C0',
        'soft-bright': '#FFEAD1',
        'button-primary': '#A982DF',
        black2: '#2C2C2C',
        black3: '#181818',
        pl1: '#D5ECDA',
        pl2: '#B4E6C0',
        pl3: '#72BF83',
        pl4: '#5B9969',
        nl1: '#F5BFBF',
        nl2: '#EE9D9D',
        nl3: '#DA6A6A',
        nl4: '#924848',
        'primary-l1': '#E3D0FE',
        'white-90-card': '#FFFFFFE6',
      },
    },
  },
  plugins: [],
};
