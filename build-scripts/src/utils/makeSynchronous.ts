import {writeFileSync} from 'fs';
import {resolve, dirname} from 'path';
import {lsrSync} from 'lsr';
import {sync as mkdirp} from 'mkdirp';
import {transformFileSync} from '@babel/core';

export default function makeSynchronous(asyncDir: string, syncDir: string) {
  lsrSync(resolve(asyncDir)).forEach(file => {
    if (file.isFile() && /\.(t|j)s$/.test(file.name)) {
      const result = transformFileSync(file.fullPath, {
        babelrc: false,
        configFile: false,
        parserOpts: {
          sourceType: 'module',
          plugins: [
            'classProperties',
            /\.ts/.test(file.name) ? 'typescript' : 'flow',
          ],
        },
        plugins: [require('./babel-plugin-remove-async')],
      });
      if (!result) {
        throw new Error('Got no result from transforming file');
      }
      const outputFileName = resolve(syncDir, file.path);
      mkdirp(dirname(outputFileName));
      writeFileSync(outputFileName, result.code);
    }
  });
}
