// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Visit Recording', () => {
  test('record a visit for a pet', async ({ page }) => {
    const visitDate = await page.evaluate(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    });
    const description = `Annual wellness exam ${Date.now()}`;

    await page.goto('/owners/1');
    const addVisitLink = page.getByRole('link', { name: /Add Visit/ }).first();
    await addVisitLink.click();

    await expect(page).toHaveURL(/\/owners\/\d+\/pets\/\d+\/visits\/new$/);
    await expect(page.getByRole('heading', { name: /New Visit|Visit/i })).toBeVisible();
    await expect(page.locator('#date')).toBeVisible();
    await expect(page.locator('#description')).toBeVisible();
    await expect(page.getByText('Previous Visits')).toBeVisible();

    await page.locator('#date').fill(visitDate);
    await page.locator('#description').fill(description);
    await page.getByRole('button', { name: 'Add Visit' }).click();

    await expect(page).toHaveURL(/\/owners\/\d+(?:;jsessionid=[^/?#]+)?(?:[/?#].*)?$/);
    const descriptionCell = page.getByRole('cell', { name: description, exact: true });
    await expect(descriptionCell).toBeVisible();
    await expect(descriptionCell.locator('xpath=../td[1]')).toHaveText(visitDate);
  });
});
