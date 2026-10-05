// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Validation and Robustness', () => {
  for (const route of ['/owners/999999', '/owners/1/pets/999999', '/owners/1/pets/1/visits/999999', '/owners/not-a-number']) {
    test(`handles missing or malformed route ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response).not.toBeNull();
      expect(response!.status()).toBeGreaterThanOrEqual(400);
      await expect(page.locator('body')).not.toContainText(/exception|stack trace|at org\.springframework/i);
      await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    });
  }
});
