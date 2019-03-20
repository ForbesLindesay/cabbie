import {resolve} from 'path';
import makeFlow from '../utils/makeFlow';

const tsDir = resolve(`${__dirname}/../../../tests/cabbie-async-test`);
const flowDir = resolve(`${__dirname}/../../../tests/cabbie-async-test-flow`);

makeFlow(resolve(tsDir, 'src'), resolve(flowDir, 'src'));
