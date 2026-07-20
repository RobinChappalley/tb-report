module.exports = {
  content: [
    './src/components/**/*.{jsx,js}',
    './src/components/blocks/**/*.{jsx,js}',
    './src/pages/**/*.{jsx,js}',
    './src/pages/*.{jsx,js}',
  ],
  theme: {
    container: {
      center: true,
    },
    colors: {
      transparent: 'rgba(0, 0, 0, 0)',
      white: '#fff',
      black: '#000',
      orange: '#F24237',
      darkOrange: '#E1392F',
      red: '#DB3328',
      gold: '#BA9A6A',
      purple: '#73004F',
      blue: '#172D76',
      green: '#005640',
      sand: {
        100: '#FBF4EB',
        200: '#F5ECE1',
        300: '#EDE6DE',
        500: '#DCD5CD',
        700: '#D1C9C6',
      },
      brown: {
        300: '#9A8E8E',
        500: '#726464',
        800: '#281D1D',
      },
    },
    spacing: {
      0: '0',
      1.25: '0.125rem',
      5: '0.5rem',
      10: '1rem',
      12.5: '1.25rem',
      15: '1.5rem',
      20: '2rem',
      25: '2.5rem',
      30: '3rem',
      40: '4rem',
      50: '5rem',
      60: '6rem',
      80: '8rem',
      100: '10rem',
      content: '68rem',
      spacer: '1.5rem',
    },
    fontSize: {
      46: '4.6rem',
      30: '3rem',
      28: '2.8rem',
      25: '2.5rem',
      22: '2.2rem',
      21: '2.1rem',
      19: '1.9rem',
      18: '1.8rem',
      16: '1.6rem',
      15: '1.5rem',
      13: '1.3rem',
      12: '1.2rem',
      11: '1.1rem',
      10: '1rem',
    },
    letterSpacing: {
      tightest: '-.8px',
      tighter: '-.3px',
      tight: '-.2px',
      tightish: '-.15px',
      normal: '-.1px',
      wide: '0.06em',
      wider: '0.07em',
    },
    lineHeight: {
      none: 1,
      10: '1rem',
      16: '1.6rem', // 1
      17: '1.7rem', // 2
      20: '2rem', // 3
      22: '2.2rem', // 4
      24: '2.4rem',
      26: '2.6rem',
      28: '2.8rem', // 5
      31: '3.1rem', // 6
      35: '3.5rem', // 7
      37: '3.7rem', // 9
      40: '4rem', // 9
      56: '5.6rem', // 10
    },
    fontFamily: {
      soehneKraftig: [
        'Soehne Kraftig',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ],
      soehneLeicht: [
        'Soehne Leicht',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ],
      cambon: ['Cambon', 'Georgia', 'serif'],
      miloSerif: ['Milo Serif', 'Georgia', 'serif'],
    },
    extend: {
      screens: {
        xxl: '1440px',
        xl: '1231px',
        lg: '1025px',
        md: '769px',
        sm: '376px',
      },
      opacity: {
        90: '0.9',
      },
      maxWidth: {
        '2/5': '40%',
        '30em': '30em',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.container': {
          maxWidth: '1230px',
          margin: '0 auto',
        },
        '.content-container': {
          maxWidth: '680px',
          margin: '0 auto',
        },
        '.figure-large': {
          maxWidth: '1020px',
          margin: '0 auto',
        },
        '.figure-default': {
          maxWidth: '680px',
          margin: '0 auto',
        },
        '.figure-full': {
          maxWidth: '100%',
        },
      });
    },
  ],
};
