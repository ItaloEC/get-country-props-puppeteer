const puppeteer = require("puppeteer");
const fs = require("fs");

async function writeInJSONFile(data, nameFile) {
  await fs.writeFile(
    `./${nameFile}.json`,
    JSON.stringify(data, null, 2),
    "utf8",
    function (err) {
      if (err) {
        return console.log(err);
      }
    }
  );
  console.log("dados escritos");
}

function run() {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.countryflags.io/");
      let urls = await page.evaluate(() => {
        let results = [];
        let items = document.querySelectorAll("div.item_country");
        items.forEach((item) => {
          let obj = item.innerText.split("\n\n");
          results.push({
            code: obj[0],
            fullName: obj[1],
          });
        });

        let flags = document.querySelectorAll("img.theme-flat");
        flags.forEach((flag, index) => {
          results[index].flag =
            "https://www.countryflags.io" + flag.getAttribute("src");
        });

        return results;
      });
      browser.close();
      return resolve(urls);
    } catch (e) {
      return reject(e);
    }
  });
}

run()
  .then(async (objs) => {
    // console.log(objs);
    await writeInJSONFile(objs, "CountriesWithFlags");
  })
  .catch(console.error);
