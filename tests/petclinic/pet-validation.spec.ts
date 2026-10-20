// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Validation and Robustness', () => {
  test('validate required pet fields and date/type inputs', async ({ page }) => {
    await page.goto('/owners/1/pets/new');
    await expect(page.locator('#type')).toBeVisible();
    await page.getByRole('button', { name: 'Add Pet' }).click();

    await expect(page).toHaveURL(/\/owners\/\d+\/pets\/new$/);
    await expect(page.locator('.has-error, .error').first()).toContainText(/required|must not be blank|must not be empty/i);

    const validName = `Valid Pet ${Date.now()}`;
    await page.locator('#name').fill(validName);
    await page.locator('#birthDate').fill('2020-01-02');
    await page.locator('#type').selectOption('cat');
    await page.getByRole('button', { name: 'Add Pet' }).click();

    await expect(page).toHaveURL(/\/owners\/\d+(?:;jsessionid=[^/?#]+)?(?:[/?#].*)?$/);
    await expect(page.getByText(validName)).toBeVisible();
  });
});
