const { handler } = require('./get-queue-times');
console.log(handler);

(async () => {
  await handler('WQ4a56272fb4e71116d3f2aced39809d1d');
})();
