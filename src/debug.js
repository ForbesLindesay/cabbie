import {inspect} from 'util';
import chalk from 'chalk';
import ms from 'ms';
import type {Options} from './flow-types/options';

function stringFill(filler: string, length: number): string {
  const buffer = new Buffer(length);
  buffer.fill(filler);
  return buffer.toString();
}
class Debug {
  indentation: number = 0;
  options: Options;
  constructor(options: Options) {
    this.options = options;
  }

  _getIndentation(add: number): string {
    return stringFill(' ', (this.indentation + add) * 2);
  }

  onRequest(req: Object) {
    if (this.options.httpDebug) {
      console.log(this._getIndentation(1) + "Request:  ", JSON.stringify(req).substr(0, 5000));
    }
    if (this.options.onRequest) {
      this.options.onRequest(req);
    }
  }

  onResponse(res: Object) {
    if (this.options.httpDebug) {
      const copy = {};
      Object.keys(res).forEach(function (key) { copy[key] = res[key] });
      copy.body = res.body.toString('utf8')
      console.log(this._getIndentation(1) + "Response: ", JSON.stringify(copy).substr(0, 5000));
    }
    if (this.options.onResponse) {
      this.options.onResponse(res);
    }
  }
  onCall(
    event: {obj: Object, name: string, args: Array<any>, duration: number, success: boolean, result: any, err: any},
  ) {
    if (this.options.debug && event.name !== 'requestJSON') {
      let message = (
        (event.success ? chalk.magenta(' \u2022 ') : chalk.red(' \u2717 ')) +
        inspect(event.obj, {colors: true, depth: 1}) + '.' + event.name + '(' +
        event.args.map(v => inspect(v, {colors: true, depth: 1})).join(', ') +
        ')'
      );
      if (event.success && event.result !== undefined) {
        message += ' => ' + inspect(event.result, {colors: true, depth: 1});
      } else if (!event.success) {
        message += ' => ' + chalk.red('' + (event.err.message || event.err));
      }
      message += chalk.cyan(' (' + ms(event.duration) + ')');
      console.log(message);
    }
    if (this.options.onCall) {
      this.options.onCall(event);
    }
  }
}
export default Debug;
