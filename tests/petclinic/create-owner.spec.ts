// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Owner and Pet Management', () => {
  test('Create a new owner', async ({ page }) => {
    const timestamp = Date.now();
    const firstName = 'TestOwner';
    const lastName = `User${timestamp}`;
    const address = `123 Test Street ${timestamp}`;
    const city = 'TestCity';
    const telephone = '5551234567';

    await page.goto('/');
    await page.getByRole('link', { name: 'Find Owners' }).click();
    await expect(page).toHaveURL(/\/owners\/find$/);

    await page.getByRole('link', { name: 'Add Owner' }).click();
    await expect(page).toHaveURL(/\/owners\/new$/);

    await page.locator('#firstName').fill(firstName);
    await page.locator('#lastName').fill(lastName);
    await page.locator('#address').fill(address);
    await page.locator('#city').fill(city);
    await page.locator('#telephone').fill(telephone);
    await page.getByRole('button', { name: 'Add Owner' }).click();

    await expect(page).toHaveURL(/\/owners\/\d+(?:;jsessionid=[^/?#]+)?$/);
    await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible();
    await expect(page.getByText(`${firstName} ${lastName}`)).toBeVisible();
    await expect(page.getByText(address)).toBeVisible();
    await expect(page.getByText(city)).toBeVisible();
    await expect(page.getByText(telephone)).toBeVisible();

    await page.getByRole('link', { name: 'Find Owners' }).click();
    await page.locator('#lastName').fill(lastName);
    await page.getByRole('button', { name: 'Find Owner' }).click();

    await expect(page).toHaveURL(/\/owners\/\d+(?:;jsessionid=[^/?#]+)?$/, { timeout: 15000 });
    await expect(page.getByText(`${firstName} ${lastName}`)).toBeVisible();
    await expect(page.getByText(address)).toBeVisible();
    await expect(page.getByText(city)).toBeVisible();
    await expect(page.getByText(telephone)).toBeVisible();
  });
});
