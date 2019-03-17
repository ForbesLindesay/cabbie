import * as assert from 'assert';
import {inspect} from 'util';

const inspectKey = inspect.custom || 'inspect';

function addLogging(
  cls: any,
  options: {baseClass?: boolean, inspect?: (obj: any, depth: number, options: any) => string} = {baseClass: false},
) {
  const proto = cls.prototype;
  Object.getOwnPropertyNames(proto).forEach(name => {
    if (typeof proto[name] !== 'function') {
      return;
    }
    if (name[0] === '_') {
      return;
    }
    const fun = proto[name];
    proto[name] = async function(...args) {
      const start = Date.now();
      let result;
      try {
        result = await fun.call(this, ...args);
      } catch (err) {
        this.debug.onCall({obj: this, name, args, duration: Date.now() - start, success: false, err});
        throw err;
      }
      this.debug.onCall({obj: this, name, args, duration: Date.now() - start, success: true, result});
      return result;
    };
  });
  if (options.inspect) {
    const ins = options.inspect;
    assert.equal(typeof options.inspect, 'function');
    proto[inspectKey] = function(depth: number, options: any): string {
      return ins(this, depth, options);
    };
  } else if (!proto[inspectKey] && !options.baseClass) {
    proto[inspectKey] = () => cls.name;
  }
}
export default addLogging;
