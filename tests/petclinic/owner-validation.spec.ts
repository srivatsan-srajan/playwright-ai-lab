// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Validation and Robustness', () => {
  test('validate required owner fields and telephone format', async ({ page }) => {
    await page.goto('/owners/new');
    await page.getByRole('button', { name: 'Add Owner' }).click();

    await expect(page).toHaveURL(/\/owners\/new$/);
    await expect(page.locator('.has-error, .error').first()).toContainText(/required|must not be blank|must not be empty/i);

    const uniqueLastName = `ValidLastName${Date.now()}`;
    await page.locator('#firstName').fill('   ');
    await page.locator('#lastName').fill(uniqueLastName);
    await page.locator('#address').fill('123 Valid Street');
    await page.locator('#city').fill('Madison');
    await page.locator('#telephone').fill('123456789');
    await page.getByRole('button', { name: 'Add Owner' }).click();

    await expect(page).toHaveURL(/\/owners\/new$/);
    await expect(page.locator('.has-error, .error').first()).toContainText(/required|must not be blank|must not be empty/i);
    await expect(page.locator('body')).toContainText(/Telephone|numeric|digits|10/i);

    await page.locator('#firstName').fill('Valid');
    await page.locator('#telephone').fill('6085551234');
    await page.getByRole('button', { name: 'Add Owner' }).click();

    await expect(page).toHaveURL(/\/owners\/\d+(?:;jsessionid=[^/?#]+)?$/);
    await expect(page.getByText(`Valid ${uniqueLastName}`)).toBeVisible();
  });
});
