
const puppeteer = require('puppeteer');
const {execSync} = require('child_process')
function sleep(time) { 
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 1000*time);
    });
}

(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
//   page.on('response',(response)=>{
//     console.log(response.url);
//   })
  function getDownloadUrl() { 
      return new Promise((resolve, reject) => {
        browser.on('targetcreated', (target)=>{
            resolve(target.url())
        })
      });
   }
  await page.setViewport({width: 1440, height: 1080});
  await page.goto('http://www.iconfont.cn');
  await page.click('#magix_vf_header > header > div > div.quick-menu > ul > li:nth-child(2) > a')
  await sleep(1)
  await page.click('div.login-div > ul > li:nth-child(1) > a')

  await page.waitForSelector('#login_field')
  await page.type('#login_field','zhuoqi_chen@126.com')
  await page.type('#password','xxxxxxxxx')
  await page.click('#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block')

  await page.waitForSelector('header > div > nav > ul > li:nth-child(3)')
  await page.hover('header > div > nav > ul > li:nth-child(3)')
  await page.click('header > div > nav > ul > li:nth-child(3) > ul > li:nth-child(3) > a')


  await page.waitForSelector('div.page-manage-left > div > div:nth-child(2) > div.nav-lists > div:nth-child(3)')
  await page.click('div.page-manage-left > div > div:nth-child(2) > div.nav-lists > div:nth-child(3)')

  await page.waitForSelector('.page-manage-right > div:nth-child(2) > span.bar-text.btn.btn-normal')
  execSync('rm -rf ~/Downloads/download*.zip')
  await page.click('.page-manage-right > div:nth-child(2) > span.bar-text.btn.btn-normal')
  const url = await getDownloadUrl();
  console.log('xxxxx',url);
  console.log(execSync(`bash handle_iconfont.sh "${url}"`).toString());
//   await browser.close();
})();