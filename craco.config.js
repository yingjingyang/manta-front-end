module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  babel: {
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-private-methods',
      '@babel/plugin-proposal-private-property-in-object',
    ]
  },
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.js$/,
            loader: require.resolve('@open-wc/webpack-import-meta-loader'),
          }
        ]
      }
    }
  }
}


