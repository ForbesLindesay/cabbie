function addLogging(cls: Object, options: {baseClass: boolean} = {baseClass: false}) {
  const proto = cls.prototype;
  Object.getOwnPropertyNames(proto).forEach(name => {
    if (typeof proto[name] !== 'function') {
      return;
    }
    if (name === 'inspect') {
      return;
    }
    const fun = proto[name];
    proto[name] = async function (...args) {
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
  if (!proto.inspect && !options.baseClass) {
    proto.inspect = () => cls.name;
  }
}
export default addLogging;
