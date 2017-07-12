const {readFile, writeFile} = require('fs');
const {sync: lsr} = require('lsr');
const {format} = require('prettier');

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
    if (/@disable-prettier/.test(src)) {
      return;
    }
    try {
      const output = format(src, {
        // Fit code within this line limit
        printWidth: 120,

        // Number of spaces it should use per tab
        tabWidth: 2,

        // Use the flow parser instead of babylon
        parser: 'flow',

        // If true, will use single instead of double quotes
        singleQuote: true,

        // Controls the printing of trailing commas wherever possible
        trailingComma: 'all',

        // Controls the printing of spaces inside array and objects
        bracketSpacing: false
      });
      if (src !== output) {
        console.log(file.fullPath);
        writeFile(file.fullPath, output, err => { if (err) throw err; });
      }
    } catch (ex) {
      console.log('Error prettifying: ' + file.fullPath);
      console.error(ex.stack);
    }
  });
})
