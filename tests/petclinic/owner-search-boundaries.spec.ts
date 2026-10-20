// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Owner Search and Profiles', () => {
  test('Search owners with blank, partial, and unknown terms', async ({ page }) => {
    await page.goto('/owners/find');
    await page.getByRole('button', { name: 'Find Owner' }).click();

    await expect(page).toHaveURL(/\/owners\?lastName=/);
    await expect(page.getByRole('heading', { name: 'Owners' })).toBeVisible();
    await expect(page.locator('table')).toBeVisible();

    await page.goto('/owners/find');
    await page.locator('#lastName').fill('Dav');
    await page.getByRole('button', { name: 'Find Owner' }).click();

    await expect(page).toHaveURL(/\/owners\?lastName=Dav/);
    await expect(page.getByRole('heading', { name: 'Owners' })).toBeVisible();
    await expect(page.locator('table')).toBeVisible();

    await page.goto('/owners/find');
    const missingLastName = `NoSuchOwner${Date.now()}`;
    await page.locator('#lastName').fill(missingLastName);
    await page.getByRole('button', { name: 'Find Owner' }).click();

    await expect(page).toHaveURL(new RegExp(`\/owners\\?lastName=${missingLastName}`));
    await expect(page.getByRole('heading', { name: 'Find Owners' })).toBeVisible();
    await expect(page.getByText(/not found|has not been found/i)).toBeVisible();
    await expect(page.locator('#lastName')).toHaveValue(missingLastName);
  });
});
