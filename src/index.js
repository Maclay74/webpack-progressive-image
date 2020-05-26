const path = require('path');

export default class WebpImagePlugin {

  apply(compiler) {
    compiler.hooks.afterPlugins.tap('WebpImagePlugin', (compiler) => {

      compiler.options.module.rules[1].oneOf.unshift({
        test: [/\.progressive\.jpe?g$/, /\.progressive\.png$/],
        loader: path.resolve(__dirname, 'webp-loader.js'),
        include: [path.resolve(compiler.context, 'src')],
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      });
    });
  }
}
