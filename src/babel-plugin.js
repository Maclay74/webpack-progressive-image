function WebpackProgressiveImagePlugin({ types: t }) {

  return {
    visitor: {
      JSXElement(path) {
        if (path.node.openingElement.name.name === 'img') {
          // If we deal with image inside picture tag
          if (path.parentPath && path.parentPath.isJSXElement()) {
            if (path.parentPath.node.openingElement.name.name === 'picture') {
              return;
            }
          }

          let expression = null;
          let alt = "";

          path.node.openingElement.attributes.map((attribute) => {
            if (attribute.name.name === 'src') {
              expression = attribute.value.expression;
            }

            if (attribute.name.name === 'alt') {
              alt = attribute.value;
            }
          });

          const openingElement = t.jsxOpeningElement(t.jsxIdentifier('picture'), [], false);
          const closingElement = t.jsxClosingElement(t.jsxIdentifier('picture'));

          const webpElement = t.jsxElement(
            t.jsxOpeningElement(t.jsxIdentifier('source'), [
              t.jsxAttribute(
                t.jsxIdentifier('srcSet'),
                t.jsxExpressionContainer(
                  t.memberExpression(
                    expression,
                    t.identifier('webp'),
                  ),
                ),
              ),
              t.jsxAttribute(
                t.jsxIdentifier('type'),
                t.StringLiteral('image/webp'),
              ),
            ], true),
            null,
            [],
          );

          const fallbackElement = t.jsxElement(
            t.jsxOpeningElement(t.jsxIdentifier('source'), [
              t.jsxAttribute(
                t.jsxIdentifier('srcSet'),
                t.jsxExpressionContainer(
                  t.memberExpression(
                    expression,
                    t.identifier('original'),
                  ),
                ),
              ),
              t.jsxAttribute(
                t.jsxIdentifier('type'),
                t.jsxExpressionContainer(
                  t.memberExpression(
                    expression,
                    t.identifier('originalMimeType'),
                  ),
                ),
              ),

            ], true),
            null,
            [],
          );

          const imgElement = t.jsxElement(
            t.jsxOpeningElement(t.jsxIdentifier('img'), [
              t.jsxAttribute(
                t.jsxIdentifier('src'),
                t.jsxExpressionContainer(
                  t.memberExpression(
                    expression,
                    t.identifier('original'),
                  ),
                ),
              ),
              t.jsxAttribute(
                t.jsxIdentifier('alt'),
                alt,
              ),
            ], true),
            null,
            [],
          );

          const picture = t.jsxElement(
            openingElement,
            closingElement,
            [
              webpElement,
              fallbackElement,
              imgElement,
            ],
            false,
          );

          path.replaceWith(picture);
        }
      },
    },
  };
}

module.exports = WebpackProgressiveImagePlugin;
