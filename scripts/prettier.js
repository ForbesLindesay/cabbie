import {readFile, writeFile} from 'fs';
import {sync as lsr} from 'lsr';
import {format} from 'prettier';

[
  ...lsr(__dirname + '/../core'),
  ...lsr(__dirname + '/../scripts'),
  ...lsr(__dirname + '/../src'),
  ...lsr(__dirname + '/../test/src/src'),
  ...lsr(__dirname + '/../www'),
].forEach(file => {
  if (!(file.isFile() && /\.js$/.test(file.fullPath))) {
    return;
  }
  readFile(file.fullPath, 'utf8', (err, src) => {
    if (err) throw err;
    console.log(file.fullPath);
    if (/@disable-prettier/.test(src)) {
      return;
    }
    const output = format(src, {
      // Fit code within this line limit
      printWidth: 120,

      // Number of spaces it should use per tab
      tabWidth: 2,

      // Use the flow parser instead of babylon
      useFlowParser: false,

      // If true, will use single instead of double quotes
      singleQuote: true,

      // Controls the printing of trailing commas wherever possible
      trailingComma: true,

      // Controls the printing of spaces inside array and objects
      bracketSpacing: false
    });
    if (src !== output) {
      writeFile(file.fullPath, output, err => { if (err) throw err; });
    }
  });
})
