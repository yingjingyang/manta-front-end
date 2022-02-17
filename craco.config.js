module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
      ],
    },
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


