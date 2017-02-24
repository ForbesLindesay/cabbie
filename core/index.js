const cabbieSync = require('cabbie-sync');
const cabbieAsync = require('cabbie-async');

console.warn('');
console.warn('You should use cabbie-async or cabbie-sync directly, not cabbie!!!');
console.warn('');

function createDriver(remote, options) {
  if (!options) {
    throw new Error('Expected options');
  }
  if (options.mode === 'sync') {
    return cabbieSync.default(remote, options);
  }
  if (options.mode === 'async') {
    return cabbieAsync.default(remote, options);
  }
  throw new Error('Invalid mode, ' + JSON.stringify(options.mode) + ', expected "sync" or "async"');
}
