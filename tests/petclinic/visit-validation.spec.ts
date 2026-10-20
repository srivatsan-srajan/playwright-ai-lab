// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Visit Recording', () => {
  test('reject invalid visit data', async ({ page }) => {
    await page.goto('/owners/1');
    const addVisitLink = page.getByRole('link', { name: /Add Visit/ }).first();
    await addVisitLink.click();

    await page.locator('#description').fill('');
    await page.getByRole('button', { name: 'Add Visit' }).click();
    await expect(page).toHaveURL(/\/owners\/\d+\/pets\/\d+\/visits\/new$/);
    await expect(page.locator('.has-error, .error').first()).toContainText(/must not be blank|required|cannot be empty/i);

    const validDate = await page.evaluate(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    });
    const validDescription = `Valid follow-up visit ${Date.now()}`;
    await page.locator('#description').fill(validDescription);
    await page.locator('#date').fill(validDate);
    await page.getByRole('button', { name: 'Add Visit' }).click();
    await expect(page).toHaveURL(/\/owners\/\d+(?:;jsessionid=[^/?#]+)?(?:[/?#].*)?$/);
    await expect(page.getByText(validDescription)).toBeVisible();
  });
});
