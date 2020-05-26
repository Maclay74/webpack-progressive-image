const path = require('path');

export default ({
  test: [/\.progressive\.jpe?g$/, /\.progressive\.png$/],
  loader: path.resolve(__dirname, 'webp-loader.js'),
  options: {
    name: 'static/media/[name].[hash:8].[ext]',
  },
});
