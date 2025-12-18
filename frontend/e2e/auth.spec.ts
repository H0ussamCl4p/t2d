import { test, expect } from '@playwright/test';

test('Login flow redirects to dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="username"]', 'validuser');
  await page.fill('input[name="password"]', 'validpass');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/);
});
