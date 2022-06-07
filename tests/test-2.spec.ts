import {
    test,
    expect
} from '@playwright/test';
import cheerio from 'cheerio';
import axios, {
    AxiosResponse
} from 'axios';


const api_url = 'https://gb9fb258fe17506-apexdb.adb.ap-seoul-1.oraclecloudapps.com/ords/hm/upload/upload/'
const src = 'okpos'

async function apexPost(upJson: object) {

    const request_config = {
        headers: {
            "src": src,
            "image_type": 'application/json',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        data: upJson
    };
    return axios
        .post(api_url, upJson, request_config);
}

test('test', async ({
    page
}) => {


    let scrapingResult = {
        'gbn': '01',
        'cdate': '',
        'name': '',
        'cnt': '',
        'amt': ''
    }
    // Go to https://asp.netusys.com/mobile/login/login_form.jsp
    await page.goto('https://asp.netusys.com/mobile/login/login_form.jsp');

    // Click text=이대로 계속 볼게요
    await page.locator('text=이대로 계속 볼게요').click();

    // Click input[name="user_id"]
    await page.locator('input[name="user_id"]').click();

    // Fill input[name="user_id"]
    await page.locator('input[name="user_id"]').fill('hjze');

    // Click input[name="user_pwd"]
    await page.locator('input[name="user_pwd"]').click();

    // Fill input[name="user_pwd"]
    await page.locator('input[name="user_pwd"]').fill('00222');

    // Click #btnLogin
    await Promise.all([
        page.waitForNavigation( /*{ url: 'https://asp.netusys.com/mobile/login/main.jsp?appfg=web&appYndHis=20220531154203' }*/ ),
        page.locator('#btnLogin').click()
    ]);

    // Click #mtext_1502
    await page.locator('#mtext_1502').click();

    // Click #stext_000473
    await page.locator('#stext_000473').click();

    await expect(page).toHaveURL('https://asp.netusys.com/mobile/shop/day_detail010.jsp');

    await page.locator('input[type="button"]').click();

    // Click input[type="button"]
    await page.locator('input[type="button"]').click();

    // //     async function fun(attr) {
    // //         // const title = await attr.replace('fnMoveDetail', '').replace(';', '').replace(/'/gi, '').split(',');
    // //         console.log(attr)
    // //         return attr
    // //     //       title = arr[2]
    // //     }
    // //     let created = ''
    // //     const books = await page.$$eval('#view table', all_items => {
    // //         const data = [];


    // //          all_items.forEach( async book => {

    // //             try {

    // //             const title = book.querySelector('tbody > tr > td:nth-child(1)').getAttribute('onclick');
    // //             const arr = title.replace('fnMoveDetail', '').replace(';', '').replace(/'/gi, '').split(',');
    // //             created = arr[0].replace('(', '')

    // //             const name = arr[2].substring(0, arr[2].length-1)
    // //             const price = book.querySelector('tbody > tr > td:nth-child(2)').innerText;
    // //             const stock = book.querySelector('tbody > tr > td:nth-child(3)').innerText;
    // // console.log(name)
    // //             // scrapingResult['name'] = name;
    // //             // scrapingResult['cnt'] = price;
    // //             // scrapingResult['amt'] =  stock;
    // //             // apexPost(scrapingResult)
    // //             data.push({ name, price, stock});
    // // // console.log(scrapingResult)
    // //                 // apexPost(scrapingResult)
    // //                 // }

    // //             }
    // //             catch (e) {
    // //                 console.log(e)
    // //             }

    // //         });

    // //         return data;

    // //     });

    //         // apexPost(books);
    //     // console.log(created, books);
    // });

    const content = await page.content();

    const $ = cheerio.load(content);
    let cdate: string;

    const extractTitle = $ =>
        $('#view table')
        .map((_, product) => {

            try {
                const $product = $(product);
                let title: string = $product.find('td').attr('onclick');
                let created: string;

                const arr = title.replace('fnMoveDetail', '').replace(';', '').replace(/'/gi, '').split(',');
                title = arr[2]
                console.log(arr[2].lastIndexOf(')'), arr[2].length)
                if (arr[2].lastIndexOf(')') == arr[2].length - 1) {
                    console.log(arr[2].lastIndexOf(')'))
                    title = arr[2].substring(0, arr[2].length - 1)
                }
                created = arr[0].replace('(', '')
                cdate = created
                scrapingResult['gbn'] = '01';
                scrapingResult['cdate'] = created;
                scrapingResult['name'] = title;
                scrapingResult['cnt'] = $product.find('tfoot > tr > td:nth-child(2)').text()
                scrapingResult['amt'] = $product.find('tfoot > tr > td:nth-child(3)').text()
                apexPost(scrapingResult)
                return {
                    title: title,
                    cnt: $product.find('tfoot > tr > td:nth-child(2)').text(),
                    price: $product.find('tfoot > tr > td:nth-child(3)').text(),
                    created: created,
                };
            } catch (e) {}
            // console.log(arr)

        })
        .toArray();

    // const title = extractTitle($).filter(it => it.price.length > 1);
    const product = extractTitle($).filter(it => typeof it.title !== 'undefined')
    // const product = extractTitle($)


    const updata = {
        cdate,
        product
    }
    apexPost(updata)
    console.log(updata)

});