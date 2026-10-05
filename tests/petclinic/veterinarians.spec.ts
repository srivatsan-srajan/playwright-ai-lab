// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Global Navigation and Read-Only Views', () => {
  test('Browse veterinarian directory and pagination', async ({ page }) => {
    // 1. Open /vets.html
    await page.goto('http://localhost:8080/vets.html');

    // Verify Veterinarians heading is visible
    await expect(page.locator('heading:has-text("Veterinarians")')).toBeVisible();

    // Verify table with Name and Specialties columns are visible
    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(page.locator('th:has-text("Name")')).toBeVisible();
    await expect(page.locator('th:has-text("Specialties")')).toBeVisible();

    // Verify the first page displays seeded veterinarian records with various specialties
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(5);

    // Verify records with none, one, and multiple specialties are present
    await expect(page.locator('td:has-text("James Carter")')).toBeVisible();
    await expect(page.locator('text=none').first()).toBeVisible(); // James Carter has none

    await expect(page.locator('td:has-text("Helen Leary")')).toBeVisible();
    await expect(page.locator('text=radiology').first()).toBeVisible(); // Helen Leary has one specialty

    await expect(page.locator('td:has-text("Linda Douglas")')).toBeVisible();
    await expect(page.locator('text=dentistry surgery')).toBeVisible(); // Linda Douglas has multiple specialties

    // 2. Select page 2, then return to page 1 using the pagination controls
    const page2Link = page.locator('a:has-text("2")');
    await expect(page2Link).toBeVisible();
    await page2Link.click();

    // Verify page 2 displays a different set of veterinarian records
    await expect(rows).toHaveCount(1);
    await expect(page.locator('td:has-text("Sharon Jenkins")')).toBeVisible();

    // Verify the active page indicator reflects page 2
    const pagination = page.locator('generic:has-text("2")');
    await expect(pagination).toBeVisible();

    // Verify that first, previous, next, and last controls reflect the current page state
    // On page 2: Page 1 link is enabled, Previous/First are enabled
    const page1Link = page.locator('a:has-text("1")');
    await expect(page1Link).toBeVisible();

    // Return to page 1 using pagination control
    await page1Link.click();

    // Verify returning to page 1 restores the first set of records without errors
    await expect(rows).toHaveCount(5);
    await expect(page.locator('td:has-text("James Carter")')).toBeVisible();
    await expect(page.locator('td:has-text("Helen Leary")')).toBeVisible();
    await expect(page.locator('td:has-text("Linda Douglas")')).toBeVisible();
    await expect(page.locator('td:has-text("Rafael Ortega")')).toBeVisible();
    await expect(page.locator('td:has-text("Henry Stevens")')).toBeVisible();

    // Verify active page indicator reflects page 1
    const page1Active = page.locator('generic').filter({ hasText: /^1$/ });
    await expect(page1Active).toBeVisible();
  });
});
