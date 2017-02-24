import assert from 'assert';
import {inspect} from 'util';
import createCodeFrame from 'babel-code-frame';

function toJson(inference) {
  function getError(node, message, data) {
    const codeFrame = node.loc
      ? createCodeFrame(inference.getModuleSource(node.loc.filename), node.loc.start.line, node.loc.start.column, {
          highlightCode: true,
        })
      : '';

    return new Error(
      message +
        (data ? '\n\n' + inspect(data, {depth: 2, colors: true}) : '') +
        (node.loc ? '\n\n' + node.loc.filename : '') +
        (codeFrame ? '\n\n' + codeFrame : ''),
    );
  }
  const processed = new Map();
  const output = {modules: [], classes: [], enums: []};
  function onModule(mod, name) {
    const methods = [];
    Object.keys(mod).forEach(key => {
      const value = mod[key];
      if (value.type === 'function') {
        const fun = {
          id: value.id,
          leadingComments: value.leadingComments,
          params: value.params.map(onValue),
          returnType: onValue(value.returnType),
        };
        methods.push({key, fun});
      }
    });
    output.modules.push({name, methods});
    return {type: 'module', name};
  }
  function getClassName(baseName) {
    let name = baseName;
    let index = 1;
    while (output.classes.some(c => c.name === name)) {
      name = name + ++index;
    }
    return name;
  }
  function onClass(cls) {
    if (processed.has(cls)) {
      return {...processed.get(cls)};
    }
    const name = getClassName(cls.name);
    const clsReference = {type: 'class', name, leadingComments: cls.leadingComments};
    processed.set(cls, clsReference);
    const properties = [];
    const methods = [];
    const staticProperties = [];
    const staticMethods = [];
    let body = cls.body;
    let superClass = cls.superClass;
    while (superClass) {
      body = body.concat(superClass.body);
      superClass = superClass.superClass;
    }

    body.forEach(entry => {
      if (entry.key[0] === '_') {
        return;
      }
      if (entry.leadingComments && entry.leadingComments.some(comment => comment.raw.indexOf('@private') !== -1)) {
        return;
      }
      if (entry.type === 'property') {
        (entry.static ? staticProperties : properties).push({
          key: entry.key,
          leadingComments: entry.leadingComments,
          typeAnnotation: onValue(entry.typeAnnotation),
        });
      }
      if (entry.type === 'method') {
        (entry.static ? staticMethods : methods).push({
          key: entry.key,
          leadingComments: entry.leadingComments,
          params: entry.params.map(onValue),
          returnType: entry.returnType && onValue(entry.returnType),
        });
      }
    });
    properties.sort((a, b) => {
      return a.key > b.key ? 1 : -1;
    });
    methods.sort((a, b) => {
      return a.key > b.key ? 1 : -1;
    });
    staticProperties.sort((a, b) => {
      return a.key > b.key ? 1 : -1;
    });
    staticMethods.sort((a, b) => {
      return a.key > b.key ? 1 : -1;
    });
    // TOOD: constructor
    output.classes.push({
      type: 'class',
      leadingComments: cls.leadingComments,
      name,
      properties,
      methods,
      staticProperties,
      staticMethods,
    });
    return clsReference;
  }
  function onTypeAlias(alias) {
    switch (alias.value.type) {
      case 'object-type': {
        assert.equal(alias.value.type, 'object-type');
        if (processed.has(alias.value)) {
          return {...processed.get(alias.value)};
        }
        const name = getClassName(alias.id);
        const clsReference = {type: 'class', name};
        processed.set(alias.value, clsReference);
        const properties = [];
        alias.value.properties.forEach(entry => {
          properties.push({
            key: entry.key,
            leadingComments: entry.leadingComments,
            optional: entry.optional,
            typeAnnotation: onValue(entry.typeAnnotation),
          });
        });
        output.classes.push({type: 'class', name, properties, methods: [], staticProperties: [], staticMethods: []});
        return clsReference;
      }
      case 'union':
        return onValue(alias.value);
      case 'builtin-type':
        // TODO: don't loose the info about what this object actually represents
        return {type: 'builtin-type', name: alias.id};
      default:
        throw getError(alias.value, 'Unexpected type alias type:', alias.value);
    }
  }
  function onEnum(enumObject) {
    if (!processed.has(enumObject)) {
      output.enums.push(enumObject);
      processed.set(enumObject, {type: 'enum', name: enumObject.name, valueName: enumObject.valueName});
    }
    return {...processed.get(enumObject)};
  }
  function onValue(value) {
    switch (value.type) {
      case 'param':
        return {...value, typeAnnotation: onValue(value.typeAnnotation)};
      case 'generic-type':
        return {type: 'generic-type', id: onValue(value.id), typeParameters: value.typeParameters.map(onValue)};
      case 'string-literal':
      case 'builtin-type':
        return {...value};
      case 'class':
        return onClass(value);
      case 'type-alias':
        return onTypeAlias(value);
      case 'object-type':
        return {type: 'object-type', properties: value.properties.map(onValue), indexers: value.indexers.map(onValue)};
      case 'object-type-indexer':
        return {...value, keyType: onValue(value.keyType), typeAnnotation: onValue(value.typeAnnotation)};
      case 'function':
        return {...value, params: value.params.map(onValue), returnType: onValue(value.returnType)};
      case 'enum-value-type':
        return {type: 'enum-value-type', enum: onEnum(value.enum)};
      case 'object-type-property':
        return {...value, typeAnnotation: onValue(value.typeAnnotation)};
      case 'union':
        return {...value, types: value.types.map(onValue)};
      default:
        throw getError(value, 'Unexpected type:', value);
    }
  }
  onModule(inference.entry, 'cabbie');
  output.classes.sort((a, b) => {
    return a.name < b.name ? -1 : 1;
  });
  output.enums.sort((a, b) => {
    return a.name < b.name ? -1 : 1;
  });
  return output;
}
export default toJson;
