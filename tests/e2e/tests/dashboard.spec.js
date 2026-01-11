import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for dashboard to load
    await expect(page.locator('h2:has-text("Dashboard")')).toBeVisible();
  });

  test('should display dashboard title and description', async ({ page }) => {
    await expect(page.locator('h2:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('text=Real-time system overview')).toBeVisible();
  });

  test('should display KPI metrics cards', async ({ page }) => {
    // Check for KPI cards
    await expect(page.locator('text=Total Solutions')).toBeVisible();
    await expect(page.locator('text=Vessels Scheduled')).toBeVisible();
    await expect(page.locator('text=Avg Makespan')).toBeVisible();
  });

  test('should display recent solutions section', async ({ page }) => {
    await expect(page.locator('text=Recent Solutions')).toBeVisible();
  });

  test('should navigate to Solver page', async ({ page }) => {
    await page.click('text=Solver');
    // Wait for the Solver page content to appear (state-based routing, no URL change)
    await expect(page.locator('h2:has-text("Problem Solver")')).toBeVisible();
    await expect(page.locator('text=Upload or manually enter vessel data')).toBeVisible();
  });

  test('should navigate to History page', async ({ page }) => {
    await page.click('text=History');
    // Wait for the History page content to appear (state-based routing, no URL change)
    await expect(page.locator('h2:has-text("Solution History")')).toBeVisible();
    await expect(page.locator('text=Browse all saved solutions')).toBeVisible();
  });

  test('should have responsive sidebar', async ({ page }) => {
    // Check sidebar is visible
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Solver')).toBeVisible();
    await expect(page.locator('text=History')).toBeVisible();
  });
});
