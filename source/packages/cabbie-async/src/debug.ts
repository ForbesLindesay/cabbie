import {inspect} from 'util';
import chalk from 'chalk';
import ms = require('ms');
import {Options} from './flow-types/options';

export type CallEvent = {
  obj: any;
  name: string;
  args: Array<any>;
  duration: number;
  success: boolean;
  result: any;
  err: any;
};

function stringFill(filler: string, length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += filler;
  }
  return result;
}
const logBufferStack: Array<Array<{d: Debug; e: CallEvent}>> = [];
class Debug {
  indentation: number = 0;
  options: Options;
  constructor(options: Options) {
    this.options = options;
  }

  _getIndentation(add: number): string {
    return stringFill(' ', (this.indentation + add) * 2);
  }

  onRequest(req: any) {
    if (this.options.httpDebug) {
      console.log(
        this._getIndentation(1) + 'Request:  ',
        JSON.stringify(req).substr(0, 5000),
      );
    }
    if (this.options.onRequest) {
      this.options.onRequest(req);
    }
  }

  onResponse(res: any) {
    if (this.options.httpDebug) {
      const copy: any = {};
      Object.keys(res).forEach(key => {
        copy[key] = res[key];
      });
      copy.body = res.body.toString('utf8');
      console.log(
        this._getIndentation(1) + 'Response: ',
        JSON.stringify(copy).substr(0, 5000),
      );
    }
    if (this.options.onResponse) {
      this.options.onResponse(res);
    }
  }
  onCall(event: CallEvent) {
    if (logBufferStack.length) {
      logBufferStack[logBufferStack.length - 1].push({d: this, e: event});
      return;
    }
    if (this.options.debug && event.name !== 'requestJSON') {
      let message =
        (event.success ? chalk.magenta(' • ') : chalk.red(' ✗ ')) +
        inspect(event.obj, {
          colors: true,
          depth: 1,
        }) +
        '.' +
        event.name +
        '(' +
        event.args.map(v => inspect(v, {colors: true, depth: 1})).join(', ') +
        ')';
      if (event.success && event.result !== undefined) {
        message +=
          ' => ' +
          inspect(event.result, {
            colors: true,
            depth: 1,
          });
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
export function startBufferingLogs() {
  logBufferStack.push([]);
}
export function discardBufferedLogs() {
  logBufferStack.pop();
}
export function printBufferedLogs() {
  const logs = logBufferStack.pop();
  if (logs) {
    logs.forEach(({d, e}) => {
      d.onCall(e);
    });
  }
}
export default Debug;
