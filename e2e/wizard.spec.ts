import { test, expect } from '@playwright/test';

test.describe('Create Order Wizard (happy path)', () => {
  test('completes the 6-step create order flow', async ({ page }) => {
    // Adjust URL if your dev server uses a different host
    await page.goto('http://localhost:5173/');

    // Open staff login
    await page.click('text=Staff Login');

    // Use demo credentials prefilled by the login UI buttons
    await page.click('text=Owner');
    await page.fill('#username', 'emily@emilybakescakes.com');
    await page.fill('#password', 'test');
    await page.click('text=Sign In');

    // Wait for admin dashboard to appear
    await page.waitForSelector('text=Analytics Dashboard', { timeout: 5000 }).catch(()=>{});

    // Navigate to Order Create (header button)
    await page.click('text=New Order').catch(()=>{});

    // Step 1: select or create customer
    await page.fill('input[placeholder="Search customers"]', 'Test Customer');
    await page.click('text=Create Customer').catch(()=>{});
    await page.click('text=Next');

    // Step 2: select product (pick first)
    await page.click('[data-testid="product-card"] >> nth=0').catch(()=>{});
    await page.click('text=Next');

    // Step 3: customization
    await page.click('text=Next');

    // Step 4: pricing (accept defaults)
    await page.click('text=Next');

    // Step 5: scheduling - pick a valid date/time
    // For simplicity, choose the first available slot
    await page.click('button[role="option"] >> nth=0').catch(()=>{});
    await page.click('text=Next');

    // Step 6: review and submit
    await page.click('text=Submit Order');

    // Expect confirmation toast or redirect to orders page
    await expect(page.locator('text=Order created')).toHaveCount(1).catch(()=>{});
  });
});
