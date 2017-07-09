import {connect} from 'net';

connect(9517, 'localhost').pipe(process.stderr);
