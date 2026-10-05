// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Global Navigation and Read-Only Views', () => {
  test('Load home page and use primary navigation', async ({ page }) => {
    // Step 1: Navigate to http://localhost:8080/ and verify welcome page
    // Verify the Welcome heading is visible
    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
    
    // Verify VMware Tanzu Logo is visible
    await expect(page.getByRole('img', { name: 'VMware Tanzu Logo' })).toBeVisible();
    
    // Verify page title
    expect(page.url()).toBe('http://localhost:8080/');
    await expect(page).toHaveTitle('PetClinic :: a Spring Framework demonstration');

    // Step 2: Click Home link and verify navigation
    await page.getByRole('link', { name: ' Home' }).click();
    await expect(page).toHaveURL('http://localhost:8080/');
    
    // Verify navigation is still available
    const homeLink = page.getByRole('link', { name: ' Home' });
    const findOwnersLink = page.getByRole('link', { name: ' Find Owners' });
    const veterinariansLink = page.getByRole('link', { name: ' Veterinarians' });
    const errorLink = page.getByRole('link', { name: ' Error' });
    
    await expect(homeLink).toBeVisible();
    await expect(findOwnersLink).toBeVisible();
    await expect(veterinariansLink).toBeVisible();
    await expect(errorLink).toBeVisible();

    // Click Find Owners link and verify navigation
    await findOwnersLink.click();
    await expect(page).toHaveURL('http://localhost:8080/owners/find');
    
    // Verify navigation is still available
    await expect(page.getByRole('link', { name: ' Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: ' Find Owners' })).toBeVisible();
    await expect(page.getByRole('link', { name: ' Veterinarians' })).toBeVisible();
    await expect(page.getByRole('link', { name: ' Error' })).toBeVisible();

    // Click Veterinarians link and verify navigation
    await page.getByRole('link', { name: ' Veterinarians' }).click();
    await expect(page).toHaveURL('http://localhost:8080/vets.html');
    
    // Verify navigation is still available
    await expect(page.getByRole('link', { name: ' Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: ' Find Owners' })).toBeVisible();
    await expect(page.getByRole('link', { name: ' Veterinarians' })).toBeVisible();
    await expect(page.getByRole('link', { name: ' Error' })).toBeVisible();

    // Click Error link and verify navigation
    await page.getByRole('link', { name: ' Error' }).click();
    await expect(page).toHaveURL('http://localhost:8080/oups');
    
    // Verify navigation is still available
    await expect(page.getByRole('link', { name: ' Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: ' Find Owners' })).toBeVisible();
    await expect(page.getByRole('link', { name: ' Veterinarians' })).toBeVisible();
    await expect(page.getByRole('link', { name: ' Error' })).toBeVisible();
  });
});
