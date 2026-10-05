// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Global Navigation and Read-Only Views', () => {
  test('Display intentional application error', async ({ page }) => {
    // 1. Open /oups
    const response = await page.goto('http://localhost:8080/oups');
    
    // expect: The response is HTTP 500.
    expect(response?.status()).toBe(500);
    
    // expect: The page displays "Something happened...", "An internal server error occurred.", and the expected controller-exception explanation.
    await expect(page.getByRole('heading', { name: 'Something happened...' })).toBeVisible();
    await expect(page.getByText('An internal server error')).toBeVisible();
    await expect(page.getByText('Expected: controller used to')).toBeVisible();
    
    // expect: The page remains rendered with usable global navigation.
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
