const { test,expect } = require('@playwright/test');
const { assert } = require('node:console');

test.only ('First playwright test', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    await page.locator('#username').type('rahulshettyacademy');
    await page.locator('#password').type('learning');
    await page.locator('#signInBtn').click();
    console.log(await page.locator('[style*="block"]').textContent());
    await expect(page.locator('[style*="block"]')).toContainText('Incorrect');

});

// test('Second playwright test', async ({page}) => {
//      await page.goto('https://google.com');
//      console.log(await page.title());
//      await expect(page).toHaveTitle('Google');
// }); 