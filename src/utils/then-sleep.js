export default function threadSleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
