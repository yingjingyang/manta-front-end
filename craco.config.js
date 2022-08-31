const { addBeforeLoader, loaderByName } = require('@craco/craco');
const webpack = require('webpack');

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
      ],
    },
  },
  // Required while we are on webpack v4;
  // see https://github.com/LedgerHQ/ledger-live/issues/763
  webpack: {
    plugins: {add: [
      new webpack.NormalModuleReplacementPlugin(
        /@ledgerhq\/devices\/hid-framing/,
        '@ledgerhq/devices/lib/hid-framing'
      )
    ]},
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push(
        {
          test:/\.(js|ts)$/,
          loader: require.resolve('@open-wc/webpack-import-meta-loader'),
        }
      )
      webpackConfig.module.rules.push(
        {
          test: /\.(js|ts)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env']
            }
          }
        }
      )

      const wasmExtensionRegExp = /\.wasm$/;
      webpackConfig.resolve.extensions.push('.wasm');

      webpackConfig.module.rules.forEach((rule) => {
        (rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
            oneOf.exclude.push(wasmExtensionRegExp);
          }
        });
      });

      const wasmLoader = {
        test: /\.wasm$/,
        exclude: /node_modules/,
        loaders: ['wasm-loader'],
      };

      addBeforeLoader(webpackConfig, loaderByName('file-loader'), wasmLoader);

      return webpackConfig;
    },
  },
}


