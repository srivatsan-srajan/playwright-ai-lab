// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Owner Search and Profiles', () => {
  test('Search owners by last name and open profile', async ({ page }) => {
    // 1. Open Find Owners, enter "Franklin" in Last Name, and select Find Owner.
    await page.goto('http://localhost:8080/owners/find');
    await page.locator('#lastName').fill('Franklin');
    await page.locator('button:has-text(\'Find Owner\')').click();

    // expect: The owner results page loads with George Franklin listed with address, city, telephone, and pet data.
    // The app auto-redirects to the owner details page when there's a single match
    await page.waitForURL('**/owners/1');
    
    // Verify we are on the owner details page
    await expect(page).toHaveURL(/.*\/owners\/1/);

    // expect: George Franklin is listed with address, city, telephone, and pet data.
    await expect(page.locator('heading:has-text("Owner Information")')).toBeVisible();
    await expect(page.locator('text=George Franklin')).toBeVisible();
    await expect(page.locator('text=110 W. Liberty St.')).toBeVisible();
    await expect(page.locator('text=Madison')).toBeVisible();
    await expect(page.locator('text=6085551023')).toBeVisible();
    await expect(page.locator('text=Leo')).toBeVisible();

    // 2. Verify George Franklin result is displayed with correct owner information.
    // expect: Owner Information shows the correct name, address, city, and telephone.
    const table = page.locator('table').first();
    
    // Verify the owner details table contains the expected information
    await expect(table.locator('text=George Franklin')).toBeVisible();
    await expect(table.locator('text=110 W. Liberty St.')).toBeVisible();
    await expect(table.locator('text=Madison')).toBeVisible();
    await expect(table.locator('text=6085551023')).toBeVisible();

    // expect: Pets and Visits lists Leo with birth date 2010-09-07 and type cat.
    await expect(page.locator('heading:has-text("Pets and Visits")')).toBeVisible();
    await expect(page.locator('text=Leo')).toBeVisible();
    await expect(page.locator('text=2010-09-07')).toBeVisible();
    await expect(page.locator('text=cat')).toBeVisible();

    // expect: Edit Owner and Add New Pet actions are present.
    const editOwnerLink = page.locator('a:has-text("Edit Owner")');
    const addNewPetLink = page.locator('a:has-text("Add New Pet")');
    
    await expect(editOwnerLink).toBeVisible();
    await expect(editOwnerLink).toHaveAttribute('href', /.*\/edit/);
    
    await expect(addNewPetLink).toBeVisible();
    await expect(addNewPetLink).toHaveAttribute('href', /.*\/pets\/new/);
  });
});
