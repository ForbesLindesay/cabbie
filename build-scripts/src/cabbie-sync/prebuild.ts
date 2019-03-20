import {readFileSync, writeFileSync} from 'fs';
import {resolve} from 'path';
import makeSynchronous from '../utils/makeSynchronous';

const asyncDir = resolve(`${__dirname}/../../../source/packages/cabbie-async`);
const syncDir = resolve(`${__dirname}/../../../source/packages/cabbie-sync`);

writeFileSync(
  resolve(syncDir, 'tsconfig.json'),
  readFileSync(resolve(asyncDir, 'tsconfig.json')),
);
writeFileSync(
  resolve(syncDir, 'LICENSE'),
  readFileSync(resolve(asyncDir, 'LICENSE')),
);

makeSynchronous(resolve(asyncDir, 'src'), resolve(syncDir, 'src'));
