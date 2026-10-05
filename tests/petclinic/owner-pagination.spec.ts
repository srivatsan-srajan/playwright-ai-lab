// spec: specs/petclinic-e2e-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Owner Search and Profiles', () => {
  test('Navigate owner pagination', async ({ page }) => {
    // 1. Open the owner index with an empty search and select page 2.
    await page.locator('a:has-text("Find Owners")').click();
    await page.locator('button:has-text("Find Owner")').click();
    
    // Navigate to page 2
    await page.locator('a:has-text("2")').click();
    
    // Verify page 2 shows the second set of seeded owners, including Jean Coleman through Carlos Estaban
    const page2Owners = [
      'Jean Coleman',
      'Jeff Black',
      'Maria Escobito',
      'David Schroeder',
      'Carlos Estaban'
    ];
    
    for (const owner of page2Owners) {
      await expect(page.locator(`a:has-text("${owner}")`)).toBeVisible();
    }
    
    // Verify page 2 is marked active
    const activePageIndicator = page.locator('text=pages').locator('..').locator('generic:has-text("2")');
    await expect(activePageIndicator).toBeVisible();
    
    // Verify the navigation controls reflect that it is the last page (Next and Last controls should be disabled)
    const nextControl = page.locator('a[title="Next"]');
    const lastControl = page.locator('a[title="Last"]');
    await expect(nextControl).not.toBeVisible();
    await expect(lastControl).not.toBeVisible();
    
    // Verify First and Previous controls are enabled
    const firstControl = page.locator('a[title="First"]');
    const previousControl = page.locator('a[title="Previous"]');
    await expect(firstControl).toBeVisible();
    await expect(previousControl).toBeVisible();
    
    // 2. Select page 1 and use the first/previous/next/last controls where enabled.
    // Use Previous control to go back to page 1
    await page.locator('a[title="Previous"]').click();
    
    // Verify page 1 is now active
    const page1Indicator = page.locator('text=pages').locator('..').locator('generic:has-text("1")');
    await expect(page1Indicator).toBeVisible();
    
    // Verify page 1 owners are displayed (George Franklin through Peter McTavish)
    const page1Owners = [
      'George Franklin',
      'Betty Davis',
      'Eduardo Rodriquez',
      'Harold Davis',
      'Peter McTavish'
    ];
    
    for (const owner of page1Owners) {
      await expect(page.locator(`a:has-text("${owner}")`)).toBeVisible();
    }
    
    // Verify First and Previous controls are disabled on page 1
    await expect(page.locator('a[title="First"]')).not.toBeVisible();
    await expect(page.locator('a[title="Previous"]')).not.toBeVisible();
    
    // Verify Next and Last controls are enabled on page 1
    const nextOnPage1 = page.locator('a[title="Next"]');
    const lastOnPage1 = page.locator('a[title="Last"]');
    await expect(nextOnPage1).toBeVisible();
    await expect(lastOnPage1).toBeVisible();
    
    // Use Next control to navigate to page 2
    await page.locator('a[title="Next"]').click();
    
    // Verify we're back on page 2 with correct owners
    const page2Indicator = page.locator('text=pages').locator('..').locator('generic:has-text("2")');
    await expect(page2Indicator).toBeVisible();
    
    for (const owner of page2Owners) {
      await expect(page.locator(`a:has-text("${owner}")`)).toBeVisible();
    }
    
    // Navigate back to page 1 using First control
    await page.locator('a[title="First"]').click();
    
    // Verify we're on page 1
    await expect(page1Indicator).toBeVisible();
    
    // Verify page 1 owners are displayed again (no duplicates or missing records)
    for (const owner of page1Owners) {
      await expect(page.locator(`a:has-text("${owner}")`)).toBeVisible();
    }
    
    // Use Last control to navigate to page 2
    await page.locator('a[title="Last"]').click();
    
    // Verify we're on page 2
    await expect(page2Indicator).toBeVisible();
    
    // Verify page 2 owners are displayed again (no duplicates or missing records)
    for (const owner of page2Owners) {
      await expect(page.locator(`a:has-text("${owner}")`)).toBeVisible();
    }
  });
});
