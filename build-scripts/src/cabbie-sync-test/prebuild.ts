import {readFileSync, writeFileSync} from 'fs';
import {resolve} from 'path';
import makeSynchronous from '../utils/makeSynchronous';

const asyncDir = resolve(`${__dirname}/../../../tests/cabbie-async-test`);
const syncDir = resolve(`${__dirname}/../../../tests/cabbie-sync-test`);

writeFileSync(
  resolve(syncDir, 'tsconfig.json'),
  readFileSync(resolve(asyncDir, 'tsconfig.json')),
);

makeSynchronous(resolve(asyncDir, 'src'), resolve(syncDir, 'src'));
