const cabbieSync = require('cabbie-sync');
const cabbieAsync = require('cabbie-async');

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
