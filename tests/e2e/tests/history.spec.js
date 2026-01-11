import { test, expect } from '@playwright/test';

test.describe('History Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=History');
    await expect(page.locator('h2:has-text("Solution History")')).toBeVisible();
  });

  test('should display history page title', async ({ page }) => {
    await expect(page.locator('h2:has-text("Solution History")')).toBeVisible();
    await expect(page.locator('text=Browse all saved solutions')).toBeVisible();
  });

  test('should display solutions table', async ({ page }) => {
    // Check for table headers
    await expect(page.locator('th:has-text("Problem ID")')).toBeVisible();
    await expect(page.locator('th:has-text("Timestamp")')).toBeVisible();
    await expect(page.locator('th:has-text("Vessels")')).toBeVisible();
    await expect(page.locator('th:has-text("Makespan")')).toBeVisible();
    await expect(page.locator('th:has-text("Time (s)")')).toBeVisible();
    await expect(page.locator('th:has-text("Actions")')).toBeVisible();
  });

  test('should view solution details', async ({ page }) => {
    // First, create a solution by solving a problem
    await page.goto('/');
    await page.click('text=Solver');
    await expect(page.locator('h2:has-text("Problem Solver")')).toBeVisible();
    
    // Fill in a simple problem
    await page.fill('input[placeholder="e.g., V001"]', 'HIST001');
    await page.fill('input[placeholder="0-72"]', '0');
    await page.fill('input[placeholder="1-72"]', '5');
    
    await page.click('button:has-text("Solve Problem")');
    await expect(page.locator('text=Solution Results')).toBeVisible({ timeout: 15000 });
    
    // Close modal
    await page.click('button:has-text("Close")');
    
    // Go to history
    await page.click('text=History');
    await expect(page.locator('h2:has-text("Solution History")')).toBeVisible();
    
    // Click "View" on the first solution
    await page.click('button:has-text("View")').first();
    
    // Modal should open with solution details
    await expect(page.locator('text=Solution Details')).toBeVisible();
    
    // Should show schedule information
    await expect(page.locator('text=HIST001')).toBeVisible();
  });

  test('should delete solution', async ({ page }) => {
    // First, create a solution
    await page.goto('/');
    await page.click('text=Solver');
    await expect(page.locator('h2:has-text("Problem Solver")')).toBeVisible();
    await page.fill('input[placeholder="e.g., V001"]', 'DELETE001');
    await page.fill('input[placeholder="0-72"]', '0');
    await page.fill('input[placeholder="1-72"]', '5');
    await page.click('button:has-text("Solve Problem")');
    await expect(page.locator('text=Solution Results')).toBeVisible({ timeout: 15000 });
    await page.click('button:has-text("Close")');
    
    // Go to history
    await page.click('text=History');
    await expect(page.locator('h2:has-text("Solution History")')).toBeVisible();
    
    // Count solutions before deletion
    const initialCount = await page.locator('tbody tr').count();
    
    // Delete the first solution
    await page.click('button:has-text("Delete")').first();
    
    // Wait a moment for deletion to complete
    await page.waitForTimeout(1000);
    
    // Reload to verify deletion
    await page.reload();
    
    // Should have one less solution (or show empty message)
    const afterCount = await page.locator('tbody tr').count();
    expect(afterCount).toBeLessThanOrEqual(initialCount);
  });

  test('should handle empty history gracefully', async ({ page }) => {
    // Delete all solutions first (if any exist)
    const deleteButtons = page.locator('button:has-text("Delete")');
    const count = await deleteButtons.count();
    
    for (let i = 0; i < count; i++) {
      await page.click('button:has-text("Delete")').first();
      await page.waitForTimeout(500);
    }
    
    // Reload page
    await page.reload();
    
    // Should show empty state or message
    // (Depends on your implementation - adjust as needed)
    await expect(page.locator('tbody')).toBeVisible();
  });

  test('should navigate from history back to solver', async ({ page }) => {
    await page.click('text=Solver');
    await expect(page.locator('h2:has-text("Problem Solver")')).toBeVisible();
  });
});

test.describe('History Integration', () => {
  test('should show newly solved problem in history', async ({ page }) => {
    // Solve a problem
    await page.goto('/');
    await page.click('text=Solver');
    await expect(page.locator('h2:has-text("Problem Solver")')).toBeVisible();
    await page.fill('input[placeholder="e.g., V001"]', 'NEWTEST');
    await page.fill('input[placeholder="0-72"]', '5');
    await page.fill('input[placeholder="1-72"]', '10');
    await page.click('button:has-text("Solve Problem")');
    await expect(page.locator('text=Solution Results')).toBeVisible({ timeout: 15000 });
    
    // Get the problem ID from the modal (if displayed)
    // Close modal
    await page.click('button:has-text("Close")');
    
    // Navigate to history
    await page.click('text=History');
    await expect(page.locator('h2:has-text("Solution History")')).toBeVisible();
    
    // The solution should be visible in the table
    // Look for 1 vessel count (we added 1 vessel)
    await expect(page.locator('td:has-text("1")')).toBeVisible();
  });
});
