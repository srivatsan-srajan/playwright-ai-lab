// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Owner Search and Profiles', () => {
  test('Search owners with blank, partial, and unknown terms', async ({ page }) => {
    // 1. Submit the Find Owners form with an empty last-name field.
    await page.goto('http://localhost:8080/owners/find');
    await page.locator('button[type="submit"]').click();

    // Verify: The application returns the owner index rather than failing.
    expect(page.url()).toContain('/owners?lastName=');
    await expect(page.locator('heading:has-text("Owners")')).toBeVisible();

    // Verify: Results are paginated and the first page contains the expected seeded records.
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Check for expected seeded owner records on the first page
    await expect(page.locator('text=George Franklin')).toBeVisible();
    await expect(page.locator('text=Betty Davis')).toBeVisible();
    await expect(page.locator('text=Eduardo Rodriquez')).toBeVisible();
    await expect(page.locator('text=Harold Davis')).toBeVisible();
    await expect(page.locator('text=Peter McTavish')).toBeVisible();

    // Verify pagination is present
    await expect(page.locator('link:has-text("2")')).toBeVisible();

    // 2. Search using a partial last name such as "Dav".
    await page.goto('http://localhost:8080/owners/find');
    await page.locator('input[name="lastName"]').fill('Dav');
    await page.locator('button[type="submit"]').click();

    // Verify: Matching Davis records are returned according to the application's search semantics.
    expect(page.url()).toContain('/owners?lastName=Dav');
    await expect(page.locator('heading:has-text("Owners")')).toBeVisible();

    // Verify only Davis records are shown
    const table2 = page.locator('table');
    await expect(table2).toBeVisible();
    await expect(page.locator('text=Betty Davis')).toBeVisible();
    await expect(page.locator('text=Harold Davis')).toBeVisible();

    // Verify unrelated owners are not shown
    await expect(page.locator('text=George Franklin')).not.toBeVisible();
    await expect(page.locator('text=Eduardo Rodriquez')).not.toBeVisible();
    await expect(page.locator('text=Peter McTavish')).not.toBeVisible();

    // Verify: The result count and pagination remain consistent with the returned data.
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBe(2); // Only Betty Davis and Harold Davis

    // 3. Search using a last name that does not exist, such as "NoSuchOwner".
    await page.goto('http://localhost:8080/owners/find');
    await page.locator('input[name="lastName"]').fill('NoSuchOwner');
    await page.locator('button[type="submit"]').click();

    // Verify: The page loads successfully with an empty-results state or equivalent no-match presentation.
    expect(page.url()).toContain('/owners?lastName=NoSuchOwner');
    await expect(page.locator('heading:has-text("Find Owners")')).toBeVisible();
    await expect(page.locator('text=has not been found')).toBeVisible();

    // Verify: No stale records from a previous search appear.
    await expect(page.locator('text=Betty Davis')).not.toBeVisible();
    await expect(page.locator('text=Harold Davis')).not.toBeVisible();
    await expect(page.locator('text=George Franklin')).not.toBeVisible();
    await expect(page.locator('text=Eduardo Rodriquez')).not.toBeVisible();
    await expect(page.locator('text=Peter McTavish')).not.toBeVisible();

    // Verify the search field retains the entered value
    const searchInput = page.locator('input[name="lastName"]');
    await expect(searchInput).toHaveValue('NoSuchOwner');
  });
});
