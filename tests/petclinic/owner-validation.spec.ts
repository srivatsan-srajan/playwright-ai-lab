// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Validation and Robustness', () => {
  test('validate required owner fields and telephone format', async ({ page }) => {
    await page.goto('/owners/new');
    await page.getByRole('button', { name: 'Add Owner' }).click();

    await expect(page).toHaveURL('/owners/new');
    await expect(page.locator('.has-error, .error')).toHaveCount(5);
    await expect(page.locator('.has-error, .error').first()).toContainText(/required|must not be blank/i);

    await page.locator('#firstName').fill('   ');
    await page.locator('#lastName').fill('ValidLastName');
    await page.locator('#address').fill('123 Valid Street');
    await page.locator('#city').fill('Madison');
    await page.locator('#telephone').fill('123456789');
    await page.getByRole('button', { name: 'Add Owner' }).click();
    await expect(page).toHaveURL('/owners/new');
    await expect(page.locator('.has-error, .error').filter({ hasText: 'First Name' })).toContainText(/required|must not be blank/i);
    await expect(page.locator('.has-error, .error').filter({ hasText: 'Telephone' })).toContainText(/10 digits|numeric|size|must be/i);

    await page.locator('#firstName').fill('Valid');
    await page.locator('#telephone').fill('6085551234');
    await page.getByRole('button', { name: 'Add Owner' }).click();
    await expect(page).toHaveURL(/\/owners\/\d+/);
    await expect(page.getByText('Valid ValidLastName')).toBeVisible();
  });
});
