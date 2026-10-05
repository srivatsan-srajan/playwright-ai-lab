// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Owner and Pet Management', () => {
  test('Create a new owner', async ({ page }) => {
    // Generate unique owner data using timestamp
    const timestamp = Date.now().toString().slice(-8);
    const firstName = 'TestOwner';
    const lastName = `User${timestamp}`;
    const address = '123 Test Street';
    const city = 'TestCity';
    const telephone = '5551234567';

    // Navigate to Find Owners page to access Add Owner functionality
    await page.locator('text=Find Owners').click();
    await expect(page).toHaveURL('/owners/find');

    // Click on Add Owner link to open the owner creation form
    await page.locator('text=Add Owner').click();
    await expect(page).toHaveURL('/owners/new');

    // Fill in the owner form with unique values
    // Step: Enter first name for the new owner
    await page.locator('#firstName').fill(firstName);

    // Step: Enter unique last name for the new owner using timestamp
    await page.locator('#lastName').fill(lastName);

    // Step: Enter address for the new owner
    await page.locator('#address').fill(address);

    // Step: Enter city for the new owner
    await page.locator('#city').fill(city);

    // Step: Enter 10-digit telephone number for the new owner
    await page.locator('#telephone').fill(telephone);

    // Step: Submit the Add Owner form to create the new owner
    await page.locator('button:has-text("Add Owner")').click();

    // Expect: The owner is saved without validation errors
    // Expect: The application navigates to or displays the new owner's profile
    await expect(page).toHaveURL(/\/owners\/\d+/);

    // Expect: The profile shows all submitted values
    await expect(page.locator('heading:has-text("Owner Information")')).toBeVisible();
    await expect(page.locator(`text=${firstName} ${lastName}`)).toBeVisible();
    await expect(page.locator(`text=${address}`)).toBeVisible();
    await expect(page.locator(`text=${city}`)).toBeVisible();
    await expect(page.locator(`text=${telephone}`)).toBeVisible();

    // Expect: Initially has no pets unless otherwise expected by the application
    const petsTable = page.locator('heading:has-text("Pets and Visits")').locator('..').locator('table');
    const rows = await petsTable.locator('tbody tr').count();
    expect(rows).toBe(0);

    // Step: Navigate to Find Owners page to search for the newly created owner
    await page.locator('text=Find Owners').click();
    await expect(page).toHaveURL('/owners/find');

    // Step: Enter the new owner's last name in the search field
    await page.locator('#lastName').fill(lastName);

    // Step: Click Find Owner button to search for the new owner
    await page.locator('button:has-text("Find Owner")').click();

    // Expect: The new owner appears in search results with the submitted contact information
    await expect(page.locator(`text=${firstName} ${lastName}`)).toBeVisible();
    await expect(page.locator(`text=${address}`)).toBeVisible();
    await expect(page.locator(`text=${city}`)).toBeVisible();
    await expect(page.locator(`text=${telephone}`)).toBeVisible();
  });
});
