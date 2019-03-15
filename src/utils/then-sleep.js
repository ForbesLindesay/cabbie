export default (async function threadSleep(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms));
});
