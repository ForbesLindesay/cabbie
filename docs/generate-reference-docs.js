'use strict';

const fs = require('fs');
const dox = require('dox');

// which modules are public vs. private
const modules = {
  activeWindow: true,
  alert: true,
  browser: true,
  connection: false,
  cookie: true,
  cookieStorage: true,
  driver: true,
  element: true,
  errors: false,
  frame: true,
  globalMouse: true,
  globalTouch: true,
  ime: true,
  json: false,
  keys: true,
  localStorage: true,
  log: false,
  logEntry: false,
  mouse: true,
  navigator: true,
  session: true,
  sessionStorage: true,
  status: true,
  timeOut: true,
  touch: true,
  type: false,
  when: false,
  window: true,
};

// TODO: handle "Keys"

const classes = {};
fs.readdirSync(__dirname + '/../lib').forEach(filename => {
  if (!(filename.replace(/\.js$/, '') in modules)) {
    throw new Error(
      'You must mark whether ' + filename + ' is public or private'
    );
  }
  if (!modules[filename.replace(/\.js$/, '')]) {
    return;
  }
  const src = fs.readFileSync(__dirname + '/../lib/' + filename, 'utf8');
  const parsed = dox.parseComments(src, {raw: true});
  for (const comment of parsed) {
    if (comment.isPrivate || comment.tags.some(tag => tag.type === 'protected')) {
      continue;
    }
    if (!comment.ctx) {
      // console.log(filename);
      // console.log(comment);
    } else if (comment.ctx.type === 'constructor') {
      classes[comment.ctx.name] = {
        meta: comment,
        properties: [],
        methods: [],
        staticProperties: [],
        staticMethods: [],
      };
    } else if (comment.ctx.type === 'method') {
      if (classes[comment.ctx.receiver]) {
        classes[comment.ctx.receiver].staticMethods.push(comment);
      } else if (classes[comment.ctx.constructor]) {
        classes[comment.ctx.constructor].methods.push(comment);
      } else {
        console.log('Failed to understand context');
        console.log(filename);
        console.dir(comment.ctx);
      }
    } else if (comment.ctx.type === 'property') {
      if (classes[comment.ctx.receiver]) {
        classes[comment.ctx.receiver].staticProperties.push(comment);
      } else if (classes[comment.ctx.constructor]) {
        classes[comment.ctx.constructor].properties.push(comment);
      } else {
        console.log('Failed to understand context');
        console.log(filename);
        console.dir(comment.ctx);
      }
    } else {
      console.log('Failed to understand context');
      console.log(filename);
      console.dir(comment.ctx);
    }
  }
});
function printMethod(comment) {
  let doc = '';
  doc += '### ' + comment.ctx.name
  doc += '(';
  comment.tags.filter(tag => tag.type ==='param').forEach((tag, i) => {
    if (i !== 0) doc += ', ';
    doc += tag.name;
    doc += ': ';
    doc += tag.types.join(' | ');
  })
  doc += ')';
  const returns = comment.tags.filter(tag => tag.type === 'return');
  if (returns.length === 1) {
    doc += ': ' + (returns[0].types.length ? returns[0].types.join(' | ') : 'any');
  } else if (returns.length > 1) {
    console.dir(comment, {colors: true, depth: 10});
    console.log();
    throw new Error('Expected exactly one return type');
  }
  doc += '\n\n';
  doc += comment.description.full;
  return doc;
}
function printProperty(comment) {
  let doc = '';
  doc += '### ' + comment.ctx.name;

  const types = comment.tags.filter(tag => tag.type === 'type');
  if (types.length === 1) {
    doc += ': ' + (types[0].types.length ? types[0].types.join(' | ') : 'any');
  } else if (types.length > 1) {
    console.dir(comment, {colors: true, depth: 10});
    console.log();
    throw new Error('Expected exactly one return type');
  }
  doc += '\n\n';
  doc += comment.description.full;
  return doc;
}
Object.keys(classes).forEach(className => {
  let extendsMessage = '';
  const extendsTag = classes[className].meta.tags.filter(tag => tag.type === 'extends');
  if (extendsTag.length > 1) {
    throw new Error('Cannot extend multiple classes: ' + className);
  }
  if (extendsTag.length === 1) {
    extendsMessage = ' (extends [' + extendsTag[0].otherClass + '](' + extendsTag[0].otherClass + '.md))'
  }
  let doc = '# ' + className + extendsMessage + '\n\n';
  doc += classes[className].meta.description.full + '\n';
  if (classes[className].staticProperties.length) {
    doc += '\n## Static Properties\n';
    classes[className].staticProperties.forEach(property => {
      doc += '\n' + printProperty(property) + '\n';
    });
  }
  if (classes[className].staticMethods.length) {
    doc += '\n## Static Methods\n';
    classes[className].staticMethods.forEach(method => {
      doc += '\n' + printMethod(method) + '\n';
    });
  }
  if (classes[className].properties.length) {
    doc += '\n## Instance Properties\n';
    classes[className].properties.forEach(property => {
      doc += '\n' + printProperty(property) + '\n';
    });
  }
  if (classes[className].methods.length) {
    doc += '\n## Instance Methods\n';
    classes[className].methods.forEach(method => {
      doc += '\n' + printMethod(method) + '\n';
    });
  }
  // doc += '\n```js\n' + JSON.stringify(classes[className], null, '  ')+ '\n```\n';
  fs.writeFileSync(__dirname + '/api/' + className + '.md', doc);
});
