const { executablePath, puppeteer } = require('chrome-aws-lambda');

const index = async (event, context, callback) => {
  const browser = await puppeteer.launch({
    // args,
    executablePath: await executablePath,
  });

  const page = await browser.newPage();

  await page.goto('https://jsbin.com/jirokasimu');

  const result = await page.evaluate(() =>
    new Date().toLocaleTimeString('en-GB', { timeZoneName: 'short' })
  );

  await browser.close();

  return result;
};

if (require.main === module) {
  index()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

module.exports = { index };
