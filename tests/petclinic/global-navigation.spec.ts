// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Global Navigation and Read-Only Views', () => {
  test('Load home page and use primary navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
    await expect(page.locator('img[src*="pets.png"]').first()).toBeVisible();
    await expect(page).toHaveTitle('PetClinic :: a Spring Framework demonstration');
    await expect(page).toHaveURL(/http:\/\/localhost:8080\/?$/);

    const checks = [
      { name: 'Home', url: /http:\/\/localhost:8080\/?$/ },
      { name: 'Find Owners', url: /http:\/\/localhost:8080\/owners\/find$/ },
      { name: 'Veterinarians', url: /http:\/\/localhost:8080\/vets\.html(?:\?.*)?$/ },
      { name: 'Error', url: /http:\/\/localhost:8080\/oups$/ }
    ];

    for (const check of checks) {
      await page.getByRole('link', { name: check.name }).click();
      await expect(page).toHaveURL(check.url);
      await expect(page.getByRole('navigation')).toBeVisible();
      await page.goto('/');
    }
  });
});
