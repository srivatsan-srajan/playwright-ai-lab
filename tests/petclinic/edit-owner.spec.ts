// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Owner and Pet Management', () => {
  test('Edit an existing owner', async ({ page }) => {
    await page.goto('/');

    // Open a seeded owner profile and select Edit Owner
    await page.locator('text=Find Owners').click();
    await page.locator('input').fill('Franklin');
    await page.locator('button:has-text("Find Owner")').click();
    await page.locator('text=Edit Owner').click();

    // The form is pre-populated with the owner's current values
    await expect(page.locator('input[value="110 W. Liberty St."]')).toHaveValue('110 W. Liberty St.');
    await expect(page.locator('input[value="Madison"]')).toHaveValue('Madison');
    await expect(page.locator('input[value="6085551023"]')).toHaveValue('6085551023');

    // The button is labeled Update Owner
    await expect(page.getByRole('button', { name: 'Update Owner' })).toBeVisible();

    // Change the address, city, and telephone to valid new values and submit
    await page.locator('input[value="110 W. Liberty St."]').fill('123 Main Street');
    await page.locator('input[value="Madison"]').fill('Chicago');
    await page.locator('input[value="6085551023"]').fill('5551234567');
    await page.locator('button:has-text("Update Owner")').click();

    // The update succeeds without validation errors and the profile displays the changed values
    await expect(page.getByRole('cell', { name: 'Main Street' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Chicago' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '5551234567' })).toBeVisible();

    // The profile preserves the owner identity and existing pets
    await expect(page.getByText('George Franklin')).toBeVisible();
    await expect(page.getByText('Leo')).toBeVisible();
  });
});
