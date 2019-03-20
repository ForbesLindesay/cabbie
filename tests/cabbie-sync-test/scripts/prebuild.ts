import {readFileSync, writeFileSync} from 'fs';
import {resolve, dirname} from 'path';
import {lsrSync} from 'lsr';
import {sync as mkdirp} from 'mkdirp';
import {transformFileSync} from '@babel/core';

const asyncDir = resolve(`${__dirname}/../../cabbie-async-test`);
const syncDir = resolve(`${__dirname}/..`);

writeFileSync(
  resolve(syncDir, 'tsconfig.json'),
  readFileSync(resolve(asyncDir, 'tsconfig.json')),
);

lsrSync(resolve(asyncDir, 'src')).forEach(file => {
  if (file.isFile() && /\.ts$/.test(file.name)) {
    console.log(file.path);
    const result = transformFileSync(file.fullPath, {
      babelrc: false,
      configFile: false,
      parserOpts: {
        sourceType: 'module',
        plugins: ['classProperties', 'typescript'],
      },
      plugins: [require('babel-plugin-remove-async')],
    });
    if (!result) {
      throw new Error('Got no result from transforming file');
    }
    const outputFileName = resolve(syncDir, 'src', file.path);
    mkdirp(dirname(outputFileName));
    writeFileSync(outputFileName, result.code);
  }
});
