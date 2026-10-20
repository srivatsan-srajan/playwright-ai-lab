// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Owner Search and Profiles', () => {
  test('Search owners by last name and open profile', async ({ page }) => {
    const timestamp = Date.now();
    const firstName = 'SearchOwner';
    const lastName = `Search${timestamp}`;
    const address = `Search Street ${timestamp}`;
    const city = 'SearchCity';
    const telephone = '6085554242';

    await page.goto('/');
    await page.getByRole('link', { name: 'Find Owners' }).click();
    await page.getByRole('link', { name: 'Add Owner' }).click();

    await page.locator('#firstName').fill(firstName);
    await page.locator('#lastName').fill(lastName);
    await page.locator('#address').fill(address);
    await page.locator('#city').fill(city);
    await page.locator('#telephone').fill(telephone);
    await page.getByRole('button', { name: 'Add Owner' }).click();

    await page.goto('/owners/find');
    await page.locator('#lastName').fill(lastName);
    await page.getByRole('button', { name: 'Find Owner' }).click();

    await expect(page).toHaveURL(/\/owners\/\d+$/);
    await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible();
    await expect(page.getByText(`${firstName} ${lastName}`)).toBeVisible();
    await expect(page.getByText(address)).toBeVisible();
    await expect(page.getByText(city)).toBeVisible();
    await expect(page.getByText(telephone)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Edit Owner' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Add New Pet' })).toBeVisible();
  });
});
