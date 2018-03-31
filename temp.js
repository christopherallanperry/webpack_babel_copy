// file-loader ./src/index.js

require('file-loader?name=index.html!../index.html');

// file-loader ./webpack.config.js

{
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'index.html'
            }
          }
        ]
      }

// CopyWebpackPlugin

