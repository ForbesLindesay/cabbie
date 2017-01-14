import assert from 'assert';
import {inspect} from 'util';
import {readFileSync} from 'fs';
import {dirname, resolve as resolvePath} from 'path';
import createCodeFrame from 'babel-code-frame';
import {parse} from 'babylon';
import {sync as resolveImport} from 'resolve';
import pluralize from 'pluralize';

const builtInValues = new Map();
builtInValues.set('Array', {type: 'builtin-type', id: 'Array'});
builtInValues.set('Buffer', {type: 'builtin-type', id: 'Buffer'});
builtInValues.set('Error', {type: 'builtin-type', id: 'Error'});
builtInValues.set('Function', {type: 'builtin-type', id: 'Function'});
builtInValues.set('Promise', {type: 'builtin-type', id: 'Promise'});
builtInValues.set('Object', {type: 'builtin-type', id: 'Object'});

class SourceLocation {
  constructor(loc) {
    this.start = loc.start;
    this.end = loc.end;
    this.filename = loc.filename;
  }
  inspect(depth, options) {
    return 'Location(' + inspect(this.filename + ':' + this.start.line, options) + ')';
  }
}
function extractComment(comment) {
  return comment.value;
}
class ModuleGenerator {
  _filename: string;
  src: string;
  _values = new Map();
  exports = {};
  dependencies = new Set();

  constructor(filename: string) {
    this._filename = filename;
    this.src = readFileSync(filename, 'utf8');

    const result = parse(this.src, {
      sourceType: 'module',
      sourceFilename: filename,
      plugins: ['flow', 'objectRestSpread', 'classProperties'],
    });

    const statements = result.program.body;

    for (const statement of result.program.body) {
      this.onStatement(statement);
    }
  }

  getError(node, message, data) {
    const codeFrame = node.loc
      ? createCodeFrame(this.src, node.loc.start.line, node.loc.start.column, {highlightCode: true})
      : '';

    return new Error(
      message + (data ? '\n\n' + inspect(data, {depth: 2, colors: true}) : '') + (codeFrame ? '\n\n' + codeFrame : ''),
    );
  }

  onStatement(statement: Object) {
    switch (statement.type) {
      case 'ClassDeclaration':
        return this.onClassDeclaration(statement);
      case 'ImportDeclaration':
        return this.onImportDeclaration(statement);
      case 'ExportNamedDeclaration':
        return this.onExportNamedDeclaration(statement);
      case 'ExportDefaultDeclaration':
        return this.onExportDefaultDeclaration(statement);
      case 'FunctionDeclaration':
        return this.onFunctionDeclaration(statement);
      case 'TypeAlias':
        return this.onTypeAlias(statement);
      case 'VariableDeclaration':
        return this.onVariableDeclaration(statement);
      case 'ExpressionStatement':
        // skip these as they don't tend to declare anything and cannot export anything
        break;
      default:
        throw this.getError(statement, 'Unknown statement type:', statement);
    }
  }

  onClassDeclaration(statement) {
    const local = statement.id.name;
    let superClass = null;
    if (statement.superClass) {
      assert.equal(statement.superClass.type, 'Identifier');
      if (!this._values.has(statement.superClass.name)) {
        throw this.getError(statement.superClass, 'Unrecognised super class: ' + statement.superClass.name);
      }
      superClass = this._values.get(statement.superClass.name);
    }
    const cls = {type: 'class', name: local, loc: new SourceLocation(statement.loc), superClass};
    this._values.set(local, cls);
    let constructor = null;
    cls.body = statement.body.body
      .filter(property => {
        if (property.kind === 'constructor') {
          constructor = property;
          return false;
        }
        return true;
      })
      .map(property => {
        switch (property.type) {
          case 'ClassProperty': {
            assert(!property.computed, 'computed properties are not supported');
            return {
              loc: new SourceLocation(property.loc),
              type: 'property',
              key: property.key.name,
              variance: property.variance,
              static: property.static,
              typeAnnotation: this.getTypeValue(property.typeAnnotation),
              leadingComments: property.leadingComments ? property.leadingComments.map(extractComment) : [],
            };
          }
          case 'ClassMethod': {
            assert(!property.computed, 'computed properties are not supported');
            assert.equal(property.kind, 'method');
            return {
              loc: new SourceLocation(property.loc),
              type: 'method',
              key: property.key.name,
              variance: property.variance,
              static: property.static,
              params: property.params.map(p => this.getParam(p)),
              returnType: property.returnType ? this.getTypeValue(property.returnType) : null,
              leadingComments: property.leadingComments ? property.leadingComments.map(extractComment) : [],
            };
          }
          default:
            throw this.getError(property, 'Unknown class property type:', property);
        }
      });
  }

  onImportDeclaration(statement) {
    assert.equal(statement.source.type, 'StringLiteral');
    const moduleID = statement.source.value[0] === '.'
      ? resolveImport(statement.source.value, {basedir: dirname(this._filename)})
      : statement.source.value;
    if (statement.source.value[0] === '.') {
      this.dependencies.add(moduleID);
    }
    for (const specifier of statement.specifiers) {
      switch (specifier.type) {
        case 'ImportSpecifier':
          this.onImportSpecifier(specifier, moduleID);
          break;
        case 'ImportDefaultSpecifier':
          this.onImportDefaultSpecifier(specifier, moduleID);
          break;
        default:
          throw this.getError(specifier, 'Unknown import specifier type:', specifier);
      }
    }
  }
  onImportSpecifier(specifier, moduleID) {
    assert.equal(specifier.local.type, 'Identifier');
    assert.equal(specifier.imported.type, 'Identifier');
    const local = specifier.local.name;
    const imported = specifier.imported.name;
    this._values.set(local, {type: 'import', moduleID, name: imported, log: specifier.loc});
  }
  onImportDefaultSpecifier(specifier, moduleID) {
    assert.equal(specifier.local.type, 'Identifier');
    const local = specifier.local.name;
    const imported = 'default';
    this._values.set(local, {type: 'import', moduleID, name: imported, loc: new SourceLocation(specifier.loc)});
  }

  onExportNamedDeclaration(statement) {
    for (const specifier of statement.specifiers) {
      switch (specifier.type) {
        case 'ExportSpecifier':
          this.onExportSpecifier(specifier);
          break;
        default:
          throw this.getError(specifier, 'Unknown export specifier type:', specifier);
      }
    }
    if (statement.declaration) {
      this.onExportDeclaration(statement.declaration, statement.leadingComments);
    }
  }

  onExportDeclaration(_declaration, leadingComments, overrideName) {
    const declaration = {
      ..._declaration,
      leadingComments: [...(leadingComments || []), ...(_declaration.leadingComments || [])],
    };
    switch (declaration.type) {
      case 'FunctionDeclaration':
      case 'TypeAlias':
        return this.onExportDeclarationWithID(declaration, overrideName);
      case 'Identifier': {
        const local = declaration.name;
        const exported = overrideName || local;
        if (!this._values.has(local)) {
          throw this.getError(declaration, 'Unrecognised export: ' + local);
        }
        this.exports[exported] = this._values.get(local);
        break;
      }
      case 'VariableDeclaration': {
        assert.equal(overrideName, undefined);
        this.onVariableDeclaration(declaration);
        for (const declarator of declaration.declarations) {
          const name = declarator.id.name;
          if (!this._values.has(name)) {
            throw this.getError(declarator.id, 'Unrecognised export: ' + name);
          }
          this.exports[name] = this._values.get(name);
        }
        break;
      }
      default:
        throw this.getError(declaration, 'Unknown declaration type:', declaration);
    }
  }

  onExportDeclarationWithID(declaration, overrideName) {
    this.onStatement(declaration);

    const local = declaration.id.name;
    if (!this._values.has(local)) {
      throw this.getError(declaration.id, 'Unrecognised export: ' + local);
    }
    this.exports[overrideName || local] = this._values.get(local);
  }

  onExportSpecifier(specifier) {
    assert.equal(specifier.local.type, 'Identifier');
    assert.equal(specifier.exported.type, 'Identifier');
    const local = specifier.local.name;
    const exported = specifier.exported.name;
    if (!this._values.has(local)) {
      throw this.getError(specifier.local, 'Unrecognised export: ' + local);
    }
    this.exports[exported] = this._values.get(local);
  }

  onExportDefaultDeclaration(statement) {
    this.onExportDeclaration(statement.declaration, statement.leadingComments, 'default');
  }

  onFunctionDeclaration(statement) {
    assert.equal(statement.id.type, 'Identifier');
    const id = statement.id.name;
    const returnType = statement.returnType ? this.getTypeValue(statement.returnType) : null;
    const params = statement.params.map(p => this.getParam(p));
    this._values.set(id, {
      type: 'function',
      id,
      params,
      returnType,
      leadingComments: statement.leadingComments ? statement.leadingComments.map(extractComment) : [],
      loc: new SourceLocation(statement.loc),
    });
  }

  onTypeAlias(statement) {
    assert.equal(statement.id.type, 'Identifier');
    const id = statement.id.name;

    this._values.set(id, {
      type: 'type-alias',
      id,
      value: this.getTypeValue(statement.right),
      loc: new SourceLocation(statement.loc),
    });
  }

  onVariableDeclaration(statement) {
    for (const _declarator of statement.declarations) {
      const declarator = {
        ..._declarator,
        leadingComments: [...(statement.leadingComments || []), ...(_declarator.leadingComments || [])],
      };
      this.onVariableDeclarator(declarator);
    }
  }
  onVariableDeclarator(declarator) {
    if (!declarator.init) {
      return;
    }
    assert.equal(declarator.id.type, 'Identifier');
    if (/Enum$/.test(declarator.id.name)) {
      if (!declarator.init.type === 'ObjectExpression') {
        throw this.getError(declarator.init, 'Enums must be object literals');
      }
      const values = {};
      const entries = declarator.init.properties.map(prop => {
        if (prop.computed || prop.type !== 'ObjectProperty' || prop.key.type !== 'Identifier') {
          throw this.getError(prop, 'Enum keys must be plain identifiers');
        }
        if (prop.value.type === 'StringLiteral') {
          values[prop.key.name] = {type: 'string-literal', value: prop.value.value};
        } else if (prop.value.type === 'NumericLiteral') {
          values[prop.key.name] = {type: 'numeric-literal', value: prop.value.value};
        } else {
          throw this.getError(prop.value, 'Enum values must be string literals or numeric literals');
        }
      });
      const typeName = declarator.id.name.replace(/Enum$/, '');
      const enumObject = {
        type: 'enum',
        name: pluralize(typeName),
        valueName: typeName,
        values,
        loc: new SourceLocation(declarator.loc),
      };
      this.exports[declarator.id.name.replace(/Enum$/, '')] = {type: 'enum-value-type', enum: enumObject};
      this._values.set(declarator.id.name, enumObject);
    } else {
      const value = this.getValue(declarator.init);
      this._values.set(declarator.id.name, value);
    }
  }

  getParam(param) {
    switch (param.type) {
      case 'Identifier':
        return {
          type: 'param',
          name: param.name,
          typeAnnotation: this.getTypeValue(param.typeAnnotation),
          loc: new SourceLocation(param.loc),
        };
      case 'AssignmentPattern':
        return {
          ...this.getParam(param.left),
          defaultValue: this.getValue(param.right),
          loc: new SourceLocation(param.loc),
        };
      default:
        throw this.getError(param, 'Unknown param type:', param);
    }
  }
  getValue(value) {
    switch (value.type) {
      case 'Identifier':
        if (!this._values.has(value.name)) {
          throw this.getError(value, 'Unrecognised identifier: ' + value.name);
        }
        return this._values.get(value.name);
      case 'ObjectExpression':
        return {
          type: 'object-expression',
          properties: value.properties.map(property => {
            switch (property.type) {
              case 'ObjectProperty':
                assert(!property.computed, 'computed properties are not supported');
                assert(property.key.type === 'Identifier' || property.key.type === 'StringLiteral');
                return {
                  type: 'object-property',
                  key: property.key.type === 'Identifier' ? property.key.name : property.key.value,
                  value: this.getValue(property.value),
                  loc: new SourceLocation(property.loc),
                  leadingComments: property.leadingComments ? property.leadingComments.map(extractComment) : [],
                };
              default:
                throw this.getError(property, 'Unknown property type:', property);
            }
          }),
          loc: new SourceLocation(value.loc),
        };
      case 'StringLiteral':
        return {type: 'string-literal', loc: new SourceLocation(value.loc), value: value.value};
      case 'NumericLiteral':
        return {type: 'numeric-literal', loc: new SourceLocation(value.loc), value: value.value};
      case 'BooleanLiteral':
        return {type: 'boolean-literal', loc: new SourceLocation(value.loc), value: value.value};
      case 'ArrayExpression':
        return {
          type: 'array-expression',
          loc: new SourceLocation(value.loc),
          elements: value.elements.map(e => this.getValue(e)),
        };

      case 'MemberExpression':
        assert(!value.computed, 'computed MemberExpression is not supported');
        assert.equal(value.property.type, 'Identifier');
        return {type: 'member-expression', object: this.getValue(value.object), property: value.property.name};
      default:
        throw this.getError(value, 'Unknown value type:', value);
    }
  }
  getTypeValue(typeAnnotation) {
    switch (typeAnnotation.type) {
      case 'TypeAnnotation':
        return this.getTypeValue(typeAnnotation.typeAnnotation);
      case 'GenericTypeAnnotation': {
        assert.equal(typeAnnotation.id.type, 'Identifier');
        const name = typeAnnotation.id.name;
        if (!this._values.has(name) && !builtInValues.has(name)) {
          throw this.getError(typeAnnotation.id, 'Unrecognised type: ' + name);
        }
        const value = this._values.get(name) || builtInValues.get(name);
        if (typeAnnotation.typeParameters) {
          return {
            type: 'generic-type',
            id: value,
            typeParameters: typeAnnotation.typeParameters.params.map(t => this.getTypeValue(t)),
            loc: new SourceLocation(typeAnnotation.loc),
          };
        } else {
          return value;
        }
        return this._values.get(name);
      }
      case 'ObjectTypeAnnotation': {
        return {
          type: 'object-type',
          properties: typeAnnotation.properties.map(p => {
            switch (p.type) {
              case 'ObjectTypeProperty':
                return {
                  type: 'object-type-property',
                  key: p.key.name,
                  typeAnnotation: this.getTypeValue(p.value),
                  optional: p.optional,
                  static: p.static,
                  variance: p.variance,
                  leadingComments: p.leadingComments ? p.leadingComments.map(extractComment) : [],
                  loc: new SourceLocation(p.loc),
                };
              default:
                throw this.getError(p, 'Unknown property type annotation type:', p);
            }
          }),
          indexers: typeAnnotation.indexers.map(p => {
            switch (p.type) {
              case 'ObjectTypeIndexer':
                return {
                  type: 'object-type-indexer',
                  key: p.id.name,
                  keyType: this.getTypeValue(p.key),
                  typeAnnotation: this.getTypeValue(p.value),
                  optional: p.optional,
                  static: p.static,
                  variance: p.variance,
                  leadingComments: p.leadingComments ? p.leadingComments.map(extractComment) : [],
                  loc: new SourceLocation(p.loc),
                };
              default:
                throw this.getError(p, 'Unknown property type annotation type:', p);
            }
          }),
          loc: new SourceLocation(typeAnnotation.loc),
        };
      }
      case 'FunctionTypeAnnotation': {
        if (typeAnnotation.rest) {
          throw this.getError(typeAnnotation.rest, 'Cannot generate docs for rest');
        }
        if (typeAnnotation.typeParameters) {
          throw this.getError(typeAnnotation.typeParameters, 'Cannot generate docs for generic function');
        }
        return {
          type: 'function',
          params: typeAnnotation.params.map(p => {
            return {
              type: 'param',
              name: p.name.name,
              typeAnnotation: this.getTypeValue(p.typeAnnotation),
              optional: p.optional,
              loc: new SourceLocation(p.loc),
            };
          }),
          returnType: this.getTypeValue(typeAnnotation.returnType),
          loc: new SourceLocation(typeAnnotation.loc),
        };
      }
      case 'UnionTypeAnnotation': {
        return {
          type: 'union',
          types: typeAnnotation.types.map(t => this.getTypeValue(t)),
          loc: new SourceLocation(typeAnnotation.loc),
        };
      }
      case 'AnyTypeAnnotation': {
        return {type: 'builtin-type', id: 'any'};
      }
      case 'BooleanTypeAnnotation': {
        return {type: 'builtin-type', id: 'boolean'};
      }
      case 'MixedTypeAnnotation': {
        return {type: 'builtin-type', id: 'any'};
      }
      case 'NumberTypeAnnotation': {
        return {type: 'builtin-type', id: 'number'};
      }
      case 'StringTypeAnnotation': {
        return {type: 'builtin-type', id: 'string'};
      }
      case 'VoidTypeAnnotation': {
        return {type: 'builtin-type', id: 'void'};
      }
      case 'StringLiteralTypeAnnotation': {
        return {type: 'string-literal', value: typeAnnotation.value};
      }
      case 'NumericLiteralTypeAnnotation': {
        return {type: 'numeric-literal', value: typeAnnotation.value};
      }
      default:
        throw this.getError(typeAnnotation, 'Unknown type annotation type:', typeAnnotation);
    }
  }
}
function mergeFiles(value, context) {
  const {getModule, visited, getError} = context;
  if (visited.has(value)) {
    return value;
  }
  if (value.type !== 'import') {
    visited.add(value);
  }

  switch (value.type) {
    case 'import':
      const result = getModule(value.moduleID)[value.name];
      if (result === undefined) {
        throw context.getError(value, `${value.moduleID} has no export named "${value.name}"`);
      }
      if (result.type === 'import') {
        return mergeFiles(result, context);
      } else {
        return result;
      }
    case 'method':
    case 'function':
      value.params = value.params.map(v => mergeFiles(v, context));
      if (value.returnType) {
        value.returnType = mergeFiles(value.returnType, context);
      }
      return value;
    case 'generic-type':
      value.id = mergeFiles(value.id, context);
      value.typeParameters = value.typeParameters.map(v => mergeFiles(v, context));
      return value;
    case 'param':
      value.typeAnnotation = mergeFiles(value.typeAnnotation, context);
      if (value.defaultValue) {
        value.defaultValue = mergeFiles(value.defaultValue, context);
      }
      return value;
    case 'string-literal':
    case 'numeric-literal':
    case 'boolean-literal':
    case 'builtin-type':
    case 'enum':
      return value;
    case 'type-alias':
      value.value = mergeFiles(value.value, context);
      return value;
    case 'object-type':
      value.properties = value.properties.map(p => mergeFiles(p, context));
      value.indexers = value.indexers.map(p => mergeFiles(p, context));
      return value;
    case 'object-type-property':
      value.typeAnnotation = mergeFiles(value.typeAnnotation, context);
      return value;
    case 'object-type-indexer':
      value.keyType = mergeFiles(value.keyType, context);
      value.typeAnnotation = mergeFiles(value.typeAnnotation, context);
      return value;
    case 'union':
      value.types = value.types.map(v => mergeFiles(v, context));
      return value;
    case 'class':
      if (value.superClass) {
        value.superClass = mergeFiles(value.superClass, context);
      }
      value.body = value.body.map(v => mergeFiles(v, context));
      return value;
    case 'property':
      value.typeAnnotation = mergeFiles(value.typeAnnotation, context);
      return value;
    case 'object-expression':
      value.properties = value.properties.map(v => mergeFiles(v, context));
      return value;
    case 'object-property':
      value.value = mergeFiles(value.value, context);
      return value;
    case 'array-expression':
      value.elements = value.elements.map(v => mergeFiles(v, context));
      return value;
    case 'enum-value-type':
      value.enum = mergeFiles(value.enum, context);
      return value;
    case 'member-expression':
      value.object = mergeFiles(value.object, context);
      if (value.object.type === 'enum') {
        value.type = 'enum-value';
      }
      return value;
    default:
      throw context.getError(value, 'Unknown value type:', value);
  }
}
class DocumentationGenerator {
  _loadedFiles = new Set();
  _moduleSpecs = new Map();
  handleFile(filename) {
    if (this._loadedFiles.has(filename)) {
      return;
    }
    this._loadedFiles.add(filename);
    const moduleSpec = new ModuleGenerator(filename);
    this._moduleSpecs.set(filename, moduleSpec);
    moduleSpec.dependencies.forEach(dependency => this.handleFile(dependency));
  }
  mergeFiles() {
    this._moduleSpecs.forEach(spec => {
      Object.keys(spec.exports).forEach(key => {
        if (!spec.exports[key]) {
          delete spec.exports[key];
          return;
        }
        spec.exports[key] = mergeFiles(spec.exports[key], {
          getModule: name => this.getModule(name),
          getError: (...args) => spec.getError(...args),
          visited: new Set(),
        });
      });
    });
  }
  getModule(filename) {
    return this._moduleSpecs.get(resolvePath(filename)).exports;
  }
  getModuleSource(filename) {
    return this._moduleSpecs.get(resolvePath(filename)).src;
  }
}
function runInference(filename) {
  const doc = new DocumentationGenerator();
  doc.handleFile(resolvePath(filename));
  doc.mergeFiles();
  return {
    entry: doc.getModule(filename),
    getModule(f) {
      return doc.getModule(f);
    },
    getModuleSource(f) {
      return doc.getModuleSource(f);
    },
  };
}
export default runInference;
