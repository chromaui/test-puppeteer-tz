const { executablePath, defaultViewport, args, headless, puppeteer } = require('chrome-aws-lambda');

const index = async (event, context, callback) => {
  const browser = await puppeteer.launch({
    args: args,
    defaultViewport: defaultViewport,
    executablePath: await executablePath,
    headless: headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  await page.goto('file:///index.html');

  const result = await page.evaluate(() =>
    new Date().toLocaleTimeString('en-GB', { timeZoneName: 'short' })
  );

  await browser.close();

  return {
    node: new Date().toLocaleTimeString("en-GB", { timeZoneName: 'short'}),
    chrome: result
  };
};

if (require.main === module) {
  index()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

module.exports = { index };
