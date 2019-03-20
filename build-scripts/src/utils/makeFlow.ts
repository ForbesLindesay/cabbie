import {writeFileSync, readFileSync} from 'fs';
import {resolve, dirname} from 'path';
import {lsrSync} from 'lsr';
import {sync as mkdirp} from 'mkdirp';

export default function makeFlow(tsDir: string, flowDir: string) {
  lsrSync(resolve(tsDir)).forEach(file => {
    if (file.isFile() && /\.ts$/.test(file.name)) {
      const src = readFileSync(file.fullPath, 'utf8');
      const result =
        '// @flow\n\n' +
        src
          .replace(/^import (.*) = require\((.*)\);/gm, 'import $1 from $2;')
          .replace(
            /(^.*\'\.\.\/\.\.\/\.\.\/source\/packages\/cabbie\-test\-harness\')/gm,
            '// $FlowFixMe\n$1',
          );
      const outputFileName = resolve(
        flowDir,
        file.path.replace(/\.ts$/, '.js'),
      );
      mkdirp(dirname(outputFileName));
      writeFileSync(outputFileName, result);
    }
  });
}
