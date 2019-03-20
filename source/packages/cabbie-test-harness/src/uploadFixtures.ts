import {readFileSync} from 'fs';
import request from 'sync-request';

function doReplacements(
  source: string,
  replacements: {[key: string]: string},
): string {
  Object.keys(replacements).forEach(function(key) {
    source = source.split(key).join(replacements[key]);
  });
  return source;
}

function createPage(
  filename: string,
  replacements?: {[key: string]: string},
): string {
  var html = readFileSync(filename, 'utf8');
  if (replacements) {
    html = doReplacements(html, replacements);
  }
  const res = request('POST', 'https://tempjs.org/create', {
    json: {html: html},
  }).getBody('utf8');
  const parsed = JSON.parse(res);
  return 'https://tempjs.org' + parsed.path;
}

export default function uploadFixtures() {
  const location = createPage(__dirname + '/../fixtures/demoPage.html', {
    '{{linked-page}}': createPage(__dirname + '/../fixtures/linkedTo.html'),
  });
  return location;
}
