module.exports = ({types: t}) => {
  return {
    visitor: {
      StringLiteral(path) {
        if (path.node.value === 'then-request') {
          path.replaceWith(t.stringLiteral('sync-request'));
        }
        if (path.node.value === './utils/then-sleep') {
          path.replaceWith(t.stringLiteral('thread-sleep'));
        }
        if (path.node.value === 'cabbie-async') {
          path.replaceWith(t.stringLiteral('cabbie-sync'));
        }
      },
      Function(path) {
        if (path.node.async) {
          const newFn = {};
          for (var key in path.node) {
            newFn[key] =path.node[key];
          }
          newFn.async = false;
          path.replaceWith(newFn);
        }
      },
      AwaitExpression(path) {
        path.replaceWith(path.node.argument);
      },
      GenericTypeAnnotation(path) {
        if (t.isIdentifier(path.node.id, {name: 'Promise'})) {
          if (!path.node.typeParameters) {
            throw path.buildCodeFrameError('Promise must specify a type.', SyntaxError);
          }
          if (path.node.typeParameters.params.length === 0) {
            throw path.get('typeParameters').buildCodeFrameError('Promise must specify a type.', SyntaxError);
          }
          path.replaceWith(path.node.typeParameters.params[0]);
        }
      },
      CallExpression(path) {
        if (
          t.isMemberExpression(path.node.callee) &&
          t.isIdentifier(path.node.callee.object, {name: 'Promise'}) &&
          t.isIdentifier(path.node.callee.property, {name: 'all'}) &&
          path.node.arguments.length === 1
        ) {
          path.replaceWith(path.node.arguments[0]);
        }
      },
    },
  };
};
