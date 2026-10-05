// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Visit Recording', () => {
  test('reject invalid visit data', async ({ page }) => {
    await page.goto('/owners/1');
    await page.locator('tr', { hasText: 'Leo' }).getByRole('link', { name: /Add Visit/ }).click();

    const originalVisitCount = await page.locator('table').last().locator('tbody tr').count();
    await page.locator('#description').fill('');
    await page.getByRole('button', { name: 'Add Visit' }).click();

    await expect(page).toHaveURL(/\/visits\/new/);
    await expect(page.locator('.has-error, .error')).toContainText(/must not be blank|required/i);
    await expect(page.locator('table').last().locator('tbody tr')).toHaveCount(originalVisitCount);

    await page.locator('#date').fill('');
    await page.locator('#description').fill('Invalid date attempt');
    await page.getByRole('button', { name: 'Add Visit' }).click();
    await expect(page).toHaveURL(/\/owners\/1(?:;|$)/);

    await page.locator('tr', { hasText: 'Leo' }).getByRole('link', { name: /Add Visit/ }).click();
    await page.locator('#date').fill('2026-09-08');
    await page.locator('#description').fill('Valid follow-up visit');
    await page.getByRole('button', { name: 'Add Visit' }).click();
    await expect(page).toHaveURL(/\/owners\/1(?:;|$)/);
    await expect(page.getByText('Valid follow-up visit')).toBeVisible();
  });
});
