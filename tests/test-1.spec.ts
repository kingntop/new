import {
    test,
    expect
} from '@playwright/test';
import cheerio from "cheerio";

// test('test2', async ({ page }) => {

//     await page.goto('https://books.toscrape.com/');
//     const books = await page.$$eval('.product_pod', all_items => {
//         const data = [];
//         all_items.forEach(book => {
//             const name = book.querySelector('h3').innerText;
//             const price = book.querySelector('.price_color').innerText;
//             const stock = book.querySelector('.availability').innerText;
//             data.push({ name, price, stock});
//         });
//         return data;
//     });
//     console.log(books);
// });

// test('test', async ({ page }) => {
//     await page.goto('https://github.com/topics/javascript');
//     // Click and tell Playwright to keep watching for more than
//     // 30 repository cards to appear in the page.
//     await page.click('text=Load more');
//     // await page.waitForFunction(() => {
//     //     const repoCards = document.querySelectorAll('article.border');
//     //     return repoCards.length > 30;
//     // });
//     // Extract data from the page. Selecting all 'article' elements
//     // will return all the repository cards we're looking for.
//     const repos = await page.$$eval('article.border', repoCards => {
//         return repoCards.map(card => {
//             const [user, repo] = card.querySelectorAll('h3 a');
//             const stars = card.querySelector('a.social-count');
//             const description = card.querySelector('div.px-3 > p + div');
//             const topics = card.querySelectorAll('a.topic-tag');

//             const toText = (element) => element && element.innerText.trim();

//             return {
//                 user: toText(user),
//                 repo: toText(repo),
//                 url: repo.href,
//                 stars: toText(stars),
//                 description: toText(description),
//                 topics: Array.from(topics).map((t) => toText(t)),
//             };
//         });
//     });
//     // Print the results. Nice!
//     console.log(`We extracted ${repos.length} repositories.`);
//     console.dir(repos);;
// });


// test('test3', async ({ page }) => {
//     await page.goto('https://finance.yahoo.com/world-indices');
//     const market = await page.$$('fin-streamer')

//     console.log('Market Composites--->>>>', market.length);
//     // await page.waitForTimeout(5000); // wait
//     await Promise.all(
//         market.map(async ele => {
//             const fin = await ele.innerText()
//             console.log(fin)
//         })

//     )
// });


test('test4', async ({
    page
}) => {
    await page.goto('https://m.stock.naver.com/domestic/index/KOSPI');
    let scrapingResult = {
        '날짜': '',
        '시가': Number(),
        '고가': '',
        '저가': ''
    }
    function stringNumberToInt(stringNumber){
        return parseInt(stringNumber.replace(/,/g , ''));
    }

    const content = await page.content();

    const $ = cheerio.load(content);
    const list = $("#content  div.CommTable_article__2Is1Z.CommTable_articlePrice__33fkk > table > tbody > tr")

    console.log(list.length)

    var json = [];

    // $('time').each(function (i, elem) {
    //     // Range Name
    //     json.push({});
    //     json[i].range = $(this).text().trim();
    // })

    // console.log(json)
    const bodyList = $("#content  div.CommTable_article__2Is1Z.CommTable_articlePrice__33fkk > table > tbody > tr").map(function (i, element) {
        scrapingResult['날짜'] = String($(element).find('time').text());
        scrapingResult['시가'] = stringNumberToInt($(element).find('td:nth-child(5)').text());
        scrapingResult['고가'] =  String($(element).find('td:nth-child(6)').text());
        scrapingResult['저가'] = String($(element).find('td:nth-child(6)').text());
        json.push(scrapingResult) 
        // console.log(scrapingResult)
    });
    // #content > div:nth-child(14) > div.CommTable_article__2Is1Z.CommTable_articlePrice__33fkk > table > tbody > tr:nth-child(1) > td:nth-child(5)
//     #content  div.CommTable_article__2Is1Z.CommTable_articlePrice__33fkk > table > tbody > tr
// //*[@id="content"]/div[14]/div[2]/table/tbody/tr[1]
//     #content > div:nth-child(14) > div.CommTable_article__2Is1Z.CommTable_articlePrice__33fkk > table > tbody > tr:nth-child(1) > td:nth-child(1) > time
        console.log(json)



});