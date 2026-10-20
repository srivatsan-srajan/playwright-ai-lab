// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Owner and Pet Management', () => {
  test('Edit an existing owner', async ({ page }) => {
    const timestamp = Date.now();
    const firstName = 'Editable';
    const lastName = `Owner${timestamp}`;
    const originalAddress = `Original St ${timestamp}`;
    const originalCity = 'OriginalCity';
    const originalTelephone = '6085550000';
    const updatedAddress = `Updated St ${timestamp}`;
    const updatedCity = 'UpdatedCity';
    const updatedTelephone = '5551234567';

    await page.goto('/');
    await page.getByRole('link', { name: 'Find Owners' }).click();
    await page.getByRole('link', { name: 'Add Owner' }).click();

    await page.locator('#firstName').fill(firstName);
    await page.locator('#lastName').fill(lastName);
    await page.locator('#address').fill(originalAddress);
    await page.locator('#city').fill(originalCity);
    await page.locator('#telephone').fill(originalTelephone);
    await page.getByRole('button', { name: 'Add Owner' }).click();

    await page.getByRole('link', { name: 'Edit Owner' }).click();
    await expect(page.locator('#address')).toHaveValue(originalAddress);
    await expect(page.locator('#city')).toHaveValue(originalCity);
    await expect(page.locator('#telephone')).toHaveValue(originalTelephone);
    await expect(page.getByRole('button', { name: 'Update Owner' })).toBeVisible();

    await page.locator('#address').fill(updatedAddress);
    await page.locator('#city').fill(updatedCity);
    await page.locator('#telephone').fill(updatedTelephone);
    await page.getByRole('button', { name: 'Update Owner' }).click();

    await expect(page.getByText(updatedAddress)).toBeVisible();
    await expect(page.getByText(updatedCity)).toBeVisible();
    await expect(page.getByText(updatedTelephone)).toBeVisible();
    await expect(page.getByText(`${firstName} ${lastName}`)).toBeVisible();
  });
});
