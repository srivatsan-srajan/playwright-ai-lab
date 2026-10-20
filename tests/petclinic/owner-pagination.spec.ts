// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Owner Search and Profiles', () => {
  test('Navigate owner pagination', async ({ page }) => {
    await page.goto('/owners/find');
    await page.getByRole('button', { name: 'Find Owner' }).click();

    await expect(page.locator('table')).toBeVisible();
    const page2Link = page.locator('a[href*="page=2"]').first();
    await expect(page2Link).toBeVisible();
    await page2Link.click();
    await expect(page).toHaveURL(/\/owners\?lastName=.*page=2|\/owners\?page=2/);

    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('a[title="Previous"]')).toBeVisible();
    await expect(page.locator('a[title="First"]')).toBeVisible();

    await page.locator('a[title="Previous"]').click();
    await expect(page.locator('table')).toBeVisible();

    await page.locator('a[title="Next"]').click();
    await expect(page.locator('table')).toBeVisible();

    await page.locator('a[title="Last"]').click();
    await expect(page.locator('table')).toBeVisible();
  });
});
