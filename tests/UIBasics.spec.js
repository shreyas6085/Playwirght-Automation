const { test, expect } = require('@playwright/test');

const eventHubUrl = 'https://eventhub.rahulshettyacademy.com';

test('TC-003: Cancel a single booking from the detail page', async ({ page }) => {
    const email = process.env.EVENTHUB_EMAIL;
    const password = process.env.EVENTHUB_PASSWORD;

    if (!email || !password) {
        throw new Error('Set EVENTHUB_EMAIL and EVENTHUB_PASSWORD to run this test.');
    }

    await page.goto(`${eventHubUrl}/login`);
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByTestId('nav-bookings')).toBeVisible();

    await page.goto(`${eventHubUrl}/bookings`);
    let bookingLinks = page.locator('main a[href^="/bookings/"]');

    if (await bookingLinks.count() === 0) {
        await page.goto(`${eventHubUrl}/events/285`);
        await page.getByRole('textbox', { name: 'Full Name*' }).fill('Shreyas');
        await page.getByTestId('customer-email').fill(email);
        await page.getByRole('textbox', { name: 'Phone Number*' }).fill('+91 98765 43210');
        await page.getByRole('button', { name: 'Confirm Booking' }).click();
        await expect(page.getByRole('heading', { name: /Booking Confirmed/ })).toBeVisible();

        await page.goto(`${eventHubUrl}/bookings`);
        bookingLinks = page.locator('main a[href^="/bookings/"]');
    }

    await expect(bookingLinks.first()).toBeVisible();
    const bookingHref = await bookingLinks.first().getAttribute('href');
    if (!bookingHref) {
        throw new Error('The confirmed booking link did not have an href.');
    }

    await bookingLinks.first().click();
    await expect(page).toHaveURL(new RegExp(`${eventHubUrl}/bookings/\\d+$`));
    await expect(page.getByText('confirmed', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Cancel Booking' }).click();
    const toastAssertion = expect(
        page.getByText('Booking cancelled successfully', { exact: true }),
    ).toBeVisible();
    const redirectAssertion = page.waitForURL(`${eventHubUrl}/bookings`);
    await page.getByRole('button', { name: 'Yes, cancel it' }).click();

    await Promise.all([toastAssertion, redirectAssertion]);

    await expect(page.locator(`main a[href="${bookingHref}"]`)).toHaveCount(0);
});
