// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Global Navigation and Read-Only Views', () => {
  test('Display intentional application error', async ({ page }) => {
    const response = await page.goto('http://localhost:8080/oups');

    expect(response?.status()).toBe(500);
    await expect(page.getByRole('heading', { name: 'Something happened...' })).toBeVisible();
    await expect(page.getByText(/An internal server error|unexpected error/i)).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
