import {connect} from 'net';

const connection = connect(9517, 'localhost');
connection.on('error', err => {
  console.error('Taxi rank may have crashed.');
  console.error(err.stack || err.message || err);
});
connection.pipe(process.stderr);
