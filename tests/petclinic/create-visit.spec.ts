// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Visit Recording', () => {
  test('record a visit for a pet', async ({ page }) => {
    await page.goto('/owners/1');
    const leoRow = page.locator('tr', { hasText: 'Leo' });
    await leoRow.getByRole('link', { name: /Add Visit/ }).click();

    await expect(page).toHaveURL(/\/pets\/\d+\/visits\/new/);
    await expect(page.getByRole('heading', { name: 'New Visit' })).toBeVisible();
    await expect(page.getByText('Leo')).toBeVisible();
    await expect(page.locator('#date')).toHaveValue(/\d{4}-\d{2}-\d{2}/);
    await expect(page.locator('#description')).toBeVisible();
    await expect(page.getByText('Previous Visits', { exact: true })).toBeVisible();

    await page.locator('#date').fill('2026-09-08');
    await page.locator('#description').fill('Annual wellness exam');
    await page.getByRole('button', { name: 'Add Visit' }).click();

    await expect(page).toHaveURL(/\/owners\/1(?:;|$)/);
    await expect(page.getByText('Annual wellness exam')).toBeVisible();
    await expect(page.getByText('2026-09-08')).toBeVisible();
  });
});
