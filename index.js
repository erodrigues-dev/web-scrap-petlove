const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const { setTimeout } = require("timers/promises");

(async () => {
  console.log("start script");
  const browser = await puppeteer.launch();
  try {
    let pageNumber = 1;
    const results = [];
    const page = await browser.newPage();

    while (true) {
      console.log(`Get PAGE:${pageNumber}`);
      await page.goto(
        `https://www.petlove.com.br/cachorro/racoes/racao-seca/corante_sem%20corante?results_per_page=36&sort=6&page=${pageNumber}`
      );
      const items = await page.$$(".catalog-list-item");

      if (items.length === 0) break;

      for (const item of items) {
        const name = await item.$eval(".catalog-list-name", (elem) => {
          return elem.innerText;
        });

        console.log(`Processing: ${name}`);

        const isOutOfStock = await item.$(".catalog-list-out-of-stock");
        if (isOutOfStock) {
          console.log("Out of stock");
          continue;
        }

        const link = await item.$eval("a", (element) => element.href);

        const price = await item.$eval(
          ".catalog-list-price-subscription",
          (element) =>
            Number(element.innerText.replace(/[^0-9,]/g, "").replace(",", "."))
        );

        const weightText = name.split("-")[1].split("+")[0].trim();
        const isKilogram = /kg/gi.test(weightText);
        const weight = Number(
          weightText.replace(/[kg]/gi, "").replace(",", ".")
        );
        const kg = isKilogram ? weight : weight / 1000;

        const data = {
          name,
          link,
          price,
          kg,
          priceByKg: Number((price / kg).toFixed(2)),
        };

        results.push(data);
      }

      console.log(`Found ${results.length} at time`);
      console.log("iddle timeout to get next page");
      await setTimeout(1000, "next-page");
      pageNumber++;
    }

    const sortByPrice = (a, b) => {
      if (a.priceByKg > b.priceByKg) return 1;
      if (a.priceByKg < b.priceByKg) return -1;
      return 0;
    };

    console.log(`Found ${results.length} results`);
    console.log("sorting result by price");
    results.sort(sortByPrice);

    console.log("Writing result in file");
    await fs.writeFile("data.json", JSON.stringify(results, null, 2));
    console.log("script finished");
  } catch (error) {
    console.error(error);
  } finally {
    console.log("closing puppeteer...");
    await browser.close();
  }
})();
