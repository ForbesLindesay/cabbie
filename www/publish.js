import {parse} from 'url';
import stop from 'stop';
import s3 from 's3';
import {sync as rimraf} from 'rimraf';

rimraf(__dirname + '/../output/www-static');

require('./index');

const localDir = __dirname + '/../output/www-static';
setTimeout(() => {
  stop.getWebsiteStream('http://localhost:3000', {
    filter: function(currentURL) {
      return parse(currentURL).hostname === 'localhost';
    },
    parallel: 1,
  }).syphon(stop.minifyCSS({deadCode: true, silent: true})).syphon(stop.log()).syphon(stop.checkStatusCodes([200])).syphon(stop.writeFileSystem(localDir)).wait().done(function() {
    console.log('done building website');
    if (process.env.TRAVIS_PULL_REQUEST !== 'false' || process.env.TRAVIS_BRANCH !== 'master') {
      process.exit(0);
      return;
    }
    if (process.env.S3_KEY) {
      const client = s3.createClient({
        s3Options: {
          accessKeyId: process.env.S3_KEY,
          secretAccessKey: process.env.S3_SECRET,
          region: process.env.S3_REGION,
        },
      });
      const uploader = client.uploadDir({
        localDir,
        deleteRemoved: true,
        s3Params: {Bucket: process.env.S3_BUCKET, Prefix: ''},
      });
      uploader.on('error', function(err) {
        console.error('unable to sync:', err.stack);
      });
      uploader.on('end', function() {
        console.log('done uploading website');
        process.exit(0);
      });
    }
  });
}, 1000);
