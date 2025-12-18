import { test, expect } from '@playwright/test';

test('Upload file and see analysis toast', async ({ page }) => {
  await page.goto('/dashboard');
  await page.setInputFiles('input[type="file"]', 'tests/fixtures/test.csv');
  await page.click('button:has-text("Analyser")');
  await expect(page.locator('.toast-success')).toHaveText(/Analysis Complete/i);
});

test('Chat message shows response', async ({ page }) => {
  await page.goto('/dashboard');
  await page.fill('input[placeholder="Message"]', 'Bonjour');
  await page.click('button:has-text("Envoyer")');
  await expect(page.locator('.chat-response')).toBeVisible();
});
