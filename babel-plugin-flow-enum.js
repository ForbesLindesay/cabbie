module.exports = ({types: t}) => {
  return {
    visitor: {
      VariableDeclaration(path) {
        if (path.node.kind !== 'const' || path.node.declarations.length !== 1) {
          return;
        }
        const declaration = path.get('declarations.0');
        if (!t.isIdentifier(declaration.node.id) || !/Enum$/.test(declaration.node.id.name)) {
          return;
        }
        const init = declaration.get('init');
        if (!t.isObjectExpression(init.node)) {
          throw init.buildCodeFrameError('Enums must be object literals.', SyntaxError);
        }
        if (!init.node.properties.length) {
          throw init.buildCodeFrameError('Enums must have at least one value.', SyntaxError);
        }
        const values = [];
        init.node.properties.forEach((p, i) => {
          const property = init.get('properties.' + i);
          if (!t.isProperty(property.node)) {
            throw property.buildCodeFrameError('Enums values must be ordinary properties.', SyntaxError);
          }
          const value = property.get('value');
          if (!t.isNumericLiteral(value.node) && !t.isStringLiteral(value.node)) {
            throw value.buildCodeFrameError('Enums values must be numberic literals or string literals.', SyntaxError);
          }
          const typeAnnotation = (
            t.isNumericLiteral(value.node)
            ? t.numericLiteralTypeAnnotation()
            : t.stringLiteralTypeAnnotation()
          );
          typeAnnotation.value = value.node.value;
          typeAnnotation.rawValue = value.node.rawValue;
          typeAnnotation.raw = value.node.raw;
          values.push(typeAnnotation);
          value.replaceWith(t.typeCastExpression(
            value.node,
            t.typeAnnotation(typeAnnotation)
          ));
        });
        const exportType = t.exportNamedDeclaration(
          t.typeAlias( // declaration
            t.identifier(declaration.node.id.name.replace(/s?Enum$/, '')),
            null, // type parameters
            t.unionTypeAnnotation( // right
              values // types
            )
          ),
          [] // specifiers
        );
        exportType.exportKind = 'type';
        path.insertBefore(exportType);
      },
    },
  };
};
