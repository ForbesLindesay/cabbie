import {writeFileSync} from 'fs';
import {sync as mkdirp} from 'mkdirp';
import runInference from './inference';
import renderEntrypoint from './render-api/entrypoint';

const inference = runInference(__dirname + '/../src/index.js');

function renderPage(data, context) {
  switch (data.type) {
    case 'entrypoint':
      return renderEntrypoint(data, context);
    default:
      throw new Error('Unknown data type for page:\n' + require('util').inspect(data, {colors: true, depth: 3}));
  }
}
function render(mode) {
  const paths = new Map();
  const pages = new Map();
  const queue = [];
  function getPath(data) {
    if (!paths.has(data)) {
      const page = renderPage(data, {getPath, mode});
      paths.set(data, `/cabbie-${mode}/api${page.path}`);
      queue.push(page);
    }
    return paths.get(data);
  }
  getPath({type: 'entrypoint', exports: inference.entry});
  while (queue.length) {
    const page = queue.pop();
    pages.set(page.path, page.getContent());
  }
  pages.forEach((content, path) => {
    const fullPath = __dirname + '/../output/www' + path;
    mkdirp(fullPath);
    writeFileSync(fullPath + '/index.html', content);
  });
}
render('async');
