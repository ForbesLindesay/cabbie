// expose all classes and enums on the top level module

import {readFileSync, readdirSync, writeFileSync} from 'fs';
import {resolve} from 'path';

const srcDirectory = resolve(
  `${__dirname}/../../../source/packages/cabbie-async/src`,
);
const filename = resolve(srcDirectory, 'index.ts');
const src = readFileSync(filename, 'utf8').split('// BEGIN_GENERATED_CODE')[0];

const enums = readdirSync(resolve(srcDirectory, 'enums'));

const importStatements: string[] = [];
const exportedNames: string[] = [];
enums.forEach(enumFileName => {
  const name =
    enumFileName[0].toUpperCase() +
    enumFileName
      .substr(1)
      .replace(/\-([a-z])/g, (_, l) => l.toUpperCase())
      .replace(/\.ts$/, '');
  importStatements.push(
    `import ${name} from './enums/${enumFileName.replace(/\.ts$/, '')}';`,
  );
  exportedNames.push(name);
});

readdirSync(srcDirectory).forEach(classFileName => {
  if (!/\.ts$/.test(classFileName)) {
    return;
  }
  const classSource = readFileSync(
    resolve(srcDirectory, classFileName),
    'utf8',
  );
  const nameMatch = /^class ([A-Z][A-Za-z]+) /m.exec(classSource);
  const name = nameMatch && nameMatch[1];
  if (name && src.indexOf('\nimport ' + name) !== -1) {
    return;
  }
  if (name && !/^Base/.test(name) && name !== 'Driver') {
    importStatements.push(
      `import ${name} from './${classFileName.replace(/\.ts$/, '')}';`,
    );
    exportedNames.push(name);
  }
});

writeFileSync(
  filename,
  src +
    '// BEGIN_GENERATED_CODE\n\n' +
    importStatements.sort().join('\n') +
    '\n\n' +
    'export {\n' +
    exportedNames
      .sort()
      .map(n => `  ${n},`)
      .join('\n') +
    '\n};\n',
);
