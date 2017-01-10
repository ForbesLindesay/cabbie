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
  }
  onResponse(res: Object) {
    if (this.options.httpDebug) {
      const copy = {};
      Object.keys(res).forEach(function (key) { copy[key] = res[key] });
      copy.body = res.body.toString('utf8')
      console.log(this._getIndentation(1) + "Response: ", JSON.stringify(copy).substr(0, 5000));
    }
  }
}
export default Debug;
