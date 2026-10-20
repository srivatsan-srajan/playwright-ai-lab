// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Global Navigation and Read-Only Views', () => {
  test('Browse veterinarian directory and pagination', async ({ page }) => {
    await page.goto('/vets.html');

    await expect(page.getByRole('heading', { name: 'Veterinarians' })).toBeVisible();
    const table = page.locator('#vets');
    await expect(table).toBeVisible();
    await expect(table.locator('thead th').filter({ hasText: 'Name' })).toBeVisible();
    await expect(table.locator('thead th').filter({ hasText: 'Specialties' })).toBeVisible();

    const rows = table.locator('tbody tr');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(0);

    await expect(page.getByText('James Carter')).toBeVisible();
    await expect(page.getByText('Helen Leary')).toBeVisible();
    await expect(page.getByText('Linda Douglas')).toBeVisible();

    const page2Link = page.locator('a[href*="page=2"]').first();
    if (await page2Link.count()) {
      await page2Link.click();
      await expect(page).toHaveURL(/\/vets\.html\?page=2$/);
      await expect(page.locator('#vets')).toBeVisible();
      await page.locator('a[href*="page=1"]').first().click();
      await expect(page).toHaveURL(/\/vets\.html\?page=1$/);
    }
  });
});
