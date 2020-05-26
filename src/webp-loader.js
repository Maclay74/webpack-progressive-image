import loaderUtils from 'loader-utils';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import mime from 'mime-types';



function processOriginal(outputPath, content) {
  return new Promise((resolve) => {
    const publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;
    this.emitFile(outputPath, content);
    resolve(publicPath);
  });
}

function procressWebp(outputPath, content) {
  return new Promise((resolve) => {
    outputPath = outputPath.replace(/.(jp?g|png)$/, '.webp');
    const publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

    imagemin
      .buffer(content, {
        plugins: [imageminWebp({})],
      })
      .then((data) => {
        this.emitFile(outputPath, data);
        resolve(publicPath);
      });
  });
}

export default async function (content) {
  const options = loaderUtils.getOptions(this);
  const context = options.context || this.rootContext;

  const callback = this.async();

  const url = loaderUtils.interpolateName(
    this,
    options.name || '[contenthash].[ext]',
    {
      context,
      content,
    },
  );

  const params = this.resourceQuery ? loaderUtils.parseQuery(this.resourceQuery) : { webp: false, css: false };

  const originalUrl = await processOriginal.call(this, url, content, options);
  const webpImage = await procressWebp.call(this, url, content, options);
  const originalMimeType = mime.lookup(url);

  const esModule =
    typeof options.esModule !== 'undefined' ? options.esModule : true;

  if (params.css) {
    callback(null, `${esModule ? 'export default' : 'module.exports ='} ${params.webp ? webpImage : originalUrl};`);
    return;
  }

  callback(null, `${esModule ? 'export default' : 'module.exports ='} { original: ${originalUrl}, webp: ${webpImage}, originalMimeType: "${originalMimeType}"};`);
}

module.exports.raw = true;
