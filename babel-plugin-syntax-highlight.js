const hljs = require('highlight.js');

module.exports = function (babel) {
  const { types: t } = babel;

  return {
    name: "ast-transform", // not required
    visitor: {
      TaggedTemplateExpression(path) {
        if (
          path.node.tag.type !== 'Identifier' ||
          path.node.tag.name !== 'javascript'
        ) {
          return;
        }
        const src = path.node.quasi.quasis[0].value.raw;
        let minimumIndent = Infinity;
        const lines = src.split('\n');
        lines.forEach(line => {
          if (line.trim()) {
            minimumIndent = Math.min(
              minimumIndent,
              /^(\s*)/.exec(line)[1].length
            );
          }
        });
        const rawText = lines.map(line => {
          if (line.trim()) {
            return line.substr(minimumIndent);
          } else {
            return '';
          }
        }).join('\n').trim();
        const highlightedText = hljs.highlight('javascript', rawText).value;
        path.replaceWith(t.jSXElement(
          t.jSXOpeningElement(
            t.jSXIdentifier('CodeBlock'),
            [
              t.jSXAttribute(
                t.jSXIdentifier('dangerouslySetInnerHTML'),
                t.jSXExpressionContainer(
                  t.objectExpression([
                    t.objectProperty(
                      t.identifier('__html'),
                      t.stringLiteral(highlightedText)
                    ),
                  ])
                )
              ),
            ]
          ),
          null,
          [],
          false // self slcoing
        ));
      }
    }
  };
}
