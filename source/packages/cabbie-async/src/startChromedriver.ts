let chromedriverRunning = false;
/**
 * Start a chromedriver instance.  You must have installed chromedriver to use this:
 *
 * ```
 * npm install chromedriver --save-dev
 * ```
 */
export default function startChromedriver(): void {
  if (chromedriverRunning) {
    return;
  }
  let chromedriver;
  try {
    chromedriver = (require as any)('chromedriver');
  } catch (ex) {
    throw new Error(
      'You must install the chromedriver module via "npm install chromedriver --save-dev" to call ' +
        'cabbie.startChromedriver();',
    );
  }
  const cd = chromedriver;
  cd.start().unref();
  process.once('exit', () => {
    cd.stop();
  });
  chromedriverRunning = true;
}
