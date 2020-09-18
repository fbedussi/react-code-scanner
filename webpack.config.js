var path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/CodeScanner.jsx',
    output: {
        path: path.resolve('lib'),
        filename: 'CodeScanner.js',
        libraryTarget: 'commonjs2'
    },
   module: {
        rules: [
          {
            test: /\.wasm(.bin)?$/,
            use: ['wasm-loader']
          },
          {
              test: /\.jsx?$/,
              exclude: /(node_modules)/,
              use: 'babel-loader'
          }
        ]
    }
}
