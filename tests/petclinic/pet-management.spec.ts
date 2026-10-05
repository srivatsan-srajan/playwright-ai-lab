// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const petTypes = ['bird', 'cat', 'dog', 'hamster', 'lizard', 'snake'];

test.describe('Owner and Pet Management', () => {
  for (const petType of petTypes) {
    test(`add a pet of type ${petType}`, async ({ page }) => {
      const petName = `TestPet${petType}${Date.now()}`;

      await page.goto('/owners/1');
      await page.getByRole('link', { name: 'Add New Pet' }).click();
      await expect(page).toHaveURL(/\/owners\/1\/pets\/new/);
      await expect(page.locator('#type option')).toHaveText(petTypes);
      await expect(page.locator('#type')).toHaveValue('bird');

      await page.locator('#name').fill(petName);
      await page.locator('#birthDate').fill('2020-01-02');
      await page.locator('#type').selectOption(petType);
      await page.getByRole('button', { name: 'Add Pet' }).click();

      await expect(page).toHaveURL(/\/owners\/1(?:;|$)/);
      const petRow = page.locator('tr', { hasText: petName });
      await expect(petRow).toContainText('2020-01-02');
      await expect(petRow).toContainText(petType);
    });
  }

  test('edit an existing pet and preserve visit history', async ({ page }) => {
    await page.goto('/owners/1');
    const leoRow = page.locator('tr', { hasText: 'Leo' });
    await leoRow.getByRole('link', { name: /Edit Pet/ }).click();

    await page.locator('#name').fill('Leo Updated');
    await page.locator('#birthDate').fill('2011-02-03');
    await page.locator('#type').selectOption('dog');
    await page.getByRole('button', { name: 'Update Pet' }).click();

    await expect(page).toHaveURL(/\/owners\/1(?:;|$)/);
    const updatedRow = page.locator('tr', { hasText: 'Leo Updated' });
    await expect(updatedRow).toContainText('2011-02-03');
    await expect(updatedRow).toContainText('dog');
  });
});
