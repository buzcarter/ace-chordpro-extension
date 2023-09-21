const { resolve } = require('path');
const terser = require('terser');
const WebpackConcatPlugin = require('webpack-concat-files-plugin');

module.exports = [{
  entry: {
    'empty.js': './src/noop.js',
  },
  output: {
    filename: '[name]',
    path: resolve(__dirname, 'dist'),
  },
  plugins: [
    new WebpackConcatPlugin({
      bundles: [
        {
          src: [
            './src/ace/**/*.js',
            '.tmp/header.js',
          ],
          dest: './dist/ace-chordpro.min.js',
          transforms: {
            after: async (code) => {
              const minifiedCode = await terser.minify(code);
              return minifiedCode.code;
            },
          },
        },
      ],
    }),
  ],
}];
