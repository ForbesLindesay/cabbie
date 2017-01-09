module.exports = ({types: t}) => {
  return {
    visitor: {
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
    },
  };
};
