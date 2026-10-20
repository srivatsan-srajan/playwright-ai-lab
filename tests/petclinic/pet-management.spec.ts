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
      await expect(page).toHaveURL(/\/owners\/\d+\/pets\/new$/);

      const optionTexts = await page.locator('#type option').allTextContents();
      expect(optionTexts.length).toBeGreaterThan(0);

      await page.locator('#name').fill(petName);
      await page.locator('#birthDate').fill('2020-01-02');
      await page.locator('#type').selectOption(petType);
      await page.getByRole('button', { name: 'Add Pet' }).click();

      await expect(page).toHaveURL(/\/owners\/\d+(?:;jsessionid=[^/?#]+)?(?:[/?#].*)?$/);
      await expect(page.getByText(petName)).toBeVisible();
      await expect(page.locator('tr').filter({ hasText: petName }).getByText('2020-01-02')).toBeVisible();
    });
  }

  test('edit an existing pet and preserve visit history', async ({ page }) => {
    await page.goto('/owners/1');
    const petRow = page.locator('tr').filter({ hasText: /Leo|Leo Updated/ }).first();
    await petRow.getByRole('link', { name: /Edit Pet/ }).click();

    const updatedPetName = `Leo Updated ${Date.now()}`;
    await page.locator('#name').fill(updatedPetName);
    await page.locator('#birthDate').fill('2011-02-03');
    await page.locator('#type').selectOption('dog');
    await page.getByRole('button', { name: 'Update Pet' }).click();

    await expect(page).toHaveURL(/\/owners\/\d+(?:;jsessionid=[^/?#]+)?(?:[/?#].*)?$/);
    await expect(page.getByText(updatedPetName)).toBeVisible();
    await expect(page.getByText('2011-02-03')).toBeVisible();
  });
});
