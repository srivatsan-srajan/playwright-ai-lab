// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Validation and Robustness', () => {
  test('validate required pet fields and date/type inputs', async ({ page }) => {
    await page.goto('/owners/1/pets/new');
    await expect(page.locator('#type')).toHaveValue('bird');
    await page.getByRole('button', { name: 'Add Pet' }).click();

    await expect(page).toHaveURL(/\/pets\/new/);
    await expect(page.locator('.has-error, .error').first()).toContainText(/required|must not be blank/i);
    await expect(page.locator('#type')).toBeVisible();

    await page.locator('#name').fill('Invalid Date Pet');
    await page.locator('#birthDate').fill('');
    await page.locator('#type').selectOption('cat');
    await page.getByRole('button', { name: 'Add Pet' }).click();
    await expect(page).toHaveURL(/\/pets\/new/);
    await expect(page.locator('.has-error, .error').first()).toBeVisible();

    await page.locator('#name').fill(`Valid Pet ${Date.now()}`);
    await page.locator('#birthDate').fill('2020-01-02');
    await page.getByRole('button', { name: 'Add Pet' }).click();
    await expect(page).toHaveURL(/\/owners\/1(?:;|$)/);
    await expect(page.getByText(/Valid Pet/)).toBeVisible();
  });
});
