# Webpack Progressive Image Plugin

Converts you images to progressive formats in a plug-and-play way.


## Table of Contents
- [Motivation](#motivation)
- [Usage](#usage)
- [What about css?](#what-about-css)
- [Installation](#installation)
- [Support](#support)

## Motivation

Chrome-based browsers can take the advantage of progressive image formats, such as `webp`.

- __smaller__: `webp` images are significantly smaller than regular (usually by around 25%)
- __faster__: since they smaller we take less time to download them
- __better__: Google will give you higher score for performance which can affect your search positions!


## Usage

> I use this solution with **react-create-app**, but it doesn't depend on any of its configs

When you use images in your code, add `progressive` before their extension to make them processed by plugin's loader

**It's very important to import your image before using, otherwise Webpack will not process it with loader**

So, `<img>` in yours
```jsx harmony
import mainImageUrl from './main-image.progressive.jpg';

const AboutComponent = props => {

  return <div>
       <img src={mainImageUrl} alt={'About us'} />
    </div>
  };
}

export default AboutComponent;
```

will be replaced by
```html
<picture>
    <source srcset="/static/media/main-image.progressive.36272843.webp" type="image/webp">
    <source srcset="/static/media/main-image.progressive.36272843.jpg" type="image/jpeg">
    <img src="/static/media/main-image.progressive.36272843.jpg" alt="О нас">
</picture>
```

during the building process.

## What about css?
Well, the same result we can achieve in our css by using **postcss-plugin**

Let's imagine that we have following sass code with **background-image** declaration

```css
.hero {
  height: 700px;
  background: {
    image: url('./background.progressive.jpg');
  }
}
```

By the end we will have something like that

```css
.styles_hero__1g47g {
  height: 700px;
}

body.no-webp .styles_hero__1g47g {
  background-image: url(/static/media/background.progressive.b759c5d7.jpg);
}

body.webp .styles_hero__1g47g {
  background-image: url(/static/media/background.progressive.b759c5d7.webp);
}
```

I stole this solution [here](https://github.com/ai/webp-in-css) and modified a little to work with webpack loader.

## Installation

1. Install this plugin by your favorite package manager

    ```bash
    yarn add webpack-progressive-image
    ```

2. This plugin consists of three parts - **webpack-loader**, **babel-plugin** and **postcss-plugin**.
You need to add them all to your webpack configuration. I suggest using **customrize-cra** for this purpose.

    ```javascript
    const { override, addBabelPlugin, addPostcssPlugins, addWebpackModuleRule} = require("customize-cra");

    const BabelPlugin = require("webpack-progressive-image/dist/babel-plugin");
    const PostCssPlugin = require("webpack-progressive-image/dist/postcss-plugin");
    const WebpackLoader = require("webpack-progressive-image");

    module.exports = override(
        addBabelPlugin(BabelPlugin),
        addPostcssPlugins([PostCssPlugin()]),
        addWebpackModuleRule(WebpackLoader)
    );
    ```

3. In order to make our postcss-plugin work, we have to check whether webp is available or not. To do this, just include
this very tiny checker in your `index.js`

    ```jsx harmony
    import React from 'react';
    import ReactDOM from 'react-dom';
    import App from './App';
    import 'webpack-progressive-image/dist/webp-checker'

    ReactDOM.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>,
        document.getElementById('root')
    );
    ```


## Support

If you find any problems or bugs, please open a new issue.
