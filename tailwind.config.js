module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    fontSize: {
      xss: '.75rem',
      xs: '.825rem',
      sm: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem'
    },
    minWidth: {
      layout: 'var(--min-width-layout)',
      table: 'var(--min-width-table)',
      md: 'var(--min-width-md)',
      lg: 'var(--min-width-lg)'
    },
    extend: {
      backgroundImage: {
        primary: 'var(--gradient-bg-primary)',
        button: 'var(--gradient-button-primary)'
      },

      backgroundColor: {
        // primary: 'var(--color-bg-primary)',
        secondary: 'var(--color-bg-secondary)',
        thirdry: 'var(--color-bg-thirdry)',
        fourth: 'var(--color-bg-fourth)',
        overlay: 'var(--color-bg-overlay)',
        'table-row': 'var(--color-bg-table-row)',
        success: 'var(--color-bg-success)',
        danger: 'var(--color-bg-danger)',
        'manta-gray': 'var(--color-bg-manta-gray)'
      },
      textColor: {
        accent: 'var(--color-text-accent)',
        primary: 'var(--color-text-primary) !important',
        secondary: 'var(--color-text-secondary)',
        thirdry: 'var(--color-text-thirdry)',
        'gray-light': 'var(--color-text-gray)',
        'manta-gray': 'var(--color-bg-manta-gray)'
      },
      fill: {
        current: 'var(--color-text-secondary)',
        primary: 'var(--color-fill-primary)',
        secondary: 'var(--color-fill-secondary)',
        gray: 'var(--color-fill-gray)',
        black: '#000',
        white: '#fff'
      },
      borderColor: {
        'manta-gray': 'var(--color-bg-manta-gray)'
      }
    }
  },
  variants: {
    extend: {
      fill: ['group-hover', 'active', 'hover'],
      textColor: ['active']
    }
  },
  plugins: []
};
