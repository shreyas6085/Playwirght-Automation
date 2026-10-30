const { test,expect } = require('@playwright/test');
const { assert } = require('node:console');

test ('First playwright test', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const username = page.locator('#username');
    const password = page.locator('#password');
    const dropdown = page.locator('select.form-control');
    const documentLink = page.locator('[href*="documents-request"]');
    await dropdown.selectOption('consult');
    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();
    expect(page.locator(".radiotextsty").last()).toBeChecked();
    console.log(await page.locator(".radiotextsty").last().isChecked());
    await (expect(page.locator(".radiotextsty").toHaveAttribute('class','blinkingText')));
}  ); 

test.only('child windows', async ({page}) => {
    
     await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
     console.log(await page.title());
     const documentLink = page.locator('[href*="documents-request"]');
     
     
      
      const [newPage] = Promise.all([
        documentLink.context,
        documentLink.click(),
      ])
});