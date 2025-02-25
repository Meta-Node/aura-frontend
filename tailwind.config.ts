/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,css,scss}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
      },
      transitionProperty: {
        'font-weight': 'font-weight',
        size: 'width, height',
      },
      colors: {
        "background-light": "#e9e9e9",
        'dark-primary': '#18181b',
        gray00: '#393939',
        gray10: '#343434',
        gray20: '#585858',
        gray30: '#D9D9D9',
        gray40: '#ECECEC',
        gray50: '#848484',
        gray60: '#727272',
        gray70: '#E3E3E3',
        gray90: '#D9D9D9',
        gray100: '#999999',
        purple00: '#C9A2FF',
        error: '#EB5E55',
        purple: '#8341DE',
        purple2: '#D3B2FF',
        purple3: '#A982DF',
        orange: '#F4712F',
        blue: '#39AFC9',
        blue50: '#39AFC980',
        'light-orange': '#F09F77',
        green: '#398A4C',
        green10: '#5B9969',
        green20: '#B4E6C0',
        green30: '#D5ECDA',
        'dark-bright': '#ffa131',
        'pastel-purple': '#C9A2FF',
        'pastel-purple-25': '#C9A2FF40',
        'pastel-green': '#81CC91',
        'pastel-orange': '#FFAD8C',
        'pastel-blue': '#A5C4FF',
        'green-card': '#C0E6C9',
        'red-card': '#E6C0C0',
        'soft-bright': '#FFEAD1',
        'button-primary': '#292534',
        'bright-l1': '#F09F77',
        'overlay-bg': '#4f4f4f',
        black2: '#2C2C2C',
        black3: '#181818',
        pl1: '#D5ECDA',
        pl2: '#72BF83',
        pl3: '#5B9969',
        pl4: '#257036',
        'pl1-dark': '#738b78',
        'pl3-dark': '#257036',
        'pl4-dark': '#024711',
        nl1: '#F5BFBF',
        nl2: '#EE9D9D',
        nl3: '#DA6A6A',
        nl4: '#924848',
        'primary-l1': '#E3D0FE',
        'primary-d1': '#A982DF',
        'primary-d2': '#7E61A6',
        'white-90-card': '#FFFFFFE6',
        delete: '#D39090',
        'natural-black': '#292534',
        'neutral-l2': '#D7CEF2',
        'neutral-l3': '#C9C3D9',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  darkMode: ['class'],
  plugins: [
    require('tailwindcss-animation-delay'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};

export default tailwindConfig;
