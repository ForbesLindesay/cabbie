const startServer = require('taxi-rank');
startServer({
  port: 9516,
  onStart() {
    console.log('started taxi-rank');
  },
});
