const postcss = require('postcss');

const DEFAULT_OPTIONS = {
  modules: true,
  noWebpClass: 'no-webp',
  webpClass: 'webp',
};

module.exports = postcss.plugin('webp-in-css/plugin', () => {
  const { modules, noWebpClass, webpClass } = DEFAULT_OPTIONS;

  function addClass(selector, className) {
    let newClassName = className;
    if (modules) {
      newClassName = `:global(.${className})`;
    } else {
      newClassName = `.${className}`;
    }
    if (selector.includes('html')) {
      return selector.replace(/html[^ ]*/, `$& body${className}`);
    }
    return `body${newClassName} ${selector}`;
  }

  return (root) => {
    root.walkDecls((decl) => {
      if (/\.progressive\.(jp?g|png)/i.test(decl.value) && !decl.value.match(/webp/)) {
        const rule = decl.parent;
        if (rule.selector.indexOf(`.${noWebpClass}`) !== -1) return;
        const webp = rule.cloneAfter();
        webp.each((i) => {
          if (i.prop !== decl.prop && i.value !== decl.value) i.remove();
        });
        webp.selectors = webp.selectors.map(i => addClass(i, webpClass));
        webp.each((i) => {
          i.value = i.value.replace(/\.(jp?g|png)/, value => `${value}?webp=true&css`);
        });
        const noWebp = rule.cloneAfter();
        noWebp.each((i) => {
          if (i.prop !== decl.prop && i.value !== decl.value) i.remove();
        });
        noWebp.selectors = noWebp.selectors.map(i => addClass(i, noWebpClass));
        noWebp.each((i) => {
          i.value = i.value.replace(/\.(jp?g|png)/, value => `${value}?webp=false&css`);
        });
        decl.remove();
        if (rule.nodes.length === 0) rule.remove();
      }
    });
  };
});
