import { test, expect } from '@playwright/test';

test.describe('Solver - Manual Entry', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=Solver');
    await expect(page.locator('h2:has-text("Problem Solver")')).toBeVisible();
  });

  test('should display default problem parameters', async ({ page }) => {
    // Check default planning horizon (72)
    const planningHorizonInput = page.locator('label:has-text("Planning Horizon")').locator('..').locator('input');
    await expect(planningHorizonInput).toHaveValue('72');
    
    // Check default num_berths (2)
    const numBerthsInput = page.locator('label:has-text("Number of Berths")').locator('..').locator('input');
    await expect(numBerthsInput).toHaveValue('2');
  });

  test('should update placeholders when planning horizon changes', async ({ page }) => {
    // Change planning horizon to 48
    const planningHorizonInput = page.locator('label:has-text("Planning Horizon")').locator('..').locator('input');
    await planningHorizonInput.fill('48');
    
    // Verify arrival time placeholder updated
    await expect(page.locator('input[placeholder="0-48"]').first()).toBeVisible();
    
    // Verify processing time placeholder updated
    await expect(page.locator('input[placeholder="1-48"]').first()).toBeVisible();
  });

  test('should add and remove vessels', async ({ page }) => {
    // Initially one empty vessel row
    const initialRows = await page.locator('tbody tr').count();
    expect(initialRows).toBe(1);
    
    // Add a vessel
    await page.click('button:has-text("Add Vessel")');
    
    // Should now have 2 rows
    const afterAddRows = await page.locator('tbody tr').count();
    expect(afterAddRows).toBe(2);
    
    // Remove a vessel
    await page.click('button:has-text("Remove")').first();
    
    // Back to 1 row
    const afterRemoveRows = await page.locator('tbody tr').count();
    expect(afterRemoveRows).toBe(1);
  });

  test('should validate empty vessel data', async ({ page }) => {
    // Try to solve without filling vessel data
    await page.click('button:has-text("Solve Problem")');
    
    // Should show validation error
    await expect(page.locator('text=/All fields are required/')).toBeVisible({ timeout: 5000 });
  });

  test('should validate numeric input', async ({ page }) => {
    // Fill vessel ID
    await page.fill('input[placeholder="e.g., V001"]', 'V001');
    
    // Leave arrival time and processing time empty
    await page.click('button:has-text("Solve Problem")');
    
    // Should show validation error
    await expect(page.locator('text=/All fields are required/')).toBeVisible();
  });

  test('should successfully solve with manual entry', async ({ page }) => {
    // Fill in planning horizon and num berths
    await page.locator('label:has-text("Planning Horizon")').locator('..').locator('input').fill('48');
    await page.locator('label:has-text("Number of Berths")').locator('..').locator('input').fill('3');
    
    // Fill in first vessel
    await page.fill('input[placeholder="e.g., V001"]', 'MANUAL001');
    await page.fill('input[placeholder="0-48"]', '0');
    await page.fill('input[placeholder="1-48"]', '5');
    
    // Add second vessel
    await page.click('button:has-text("Add Vessel")');
    const vesselIdInputs = page.locator('input[placeholder="e.g., V001"]');
    await vesselIdInputs.nth(1).fill('MANUAL002');
    const arrivalInputs = page.locator('input[placeholder="0-48"]');
    await arrivalInputs.nth(1).fill('3');
    const processingInputs = page.locator('input[placeholder="1-48"]');
    await processingInputs.nth(1).fill('8');
    
    // Solve
    await page.click('button:has-text("Solve Problem")');
    
    // Wait for results modal
    await expect(page.locator('text=Solution Results')).toBeVisible({ timeout: 15000 });
    
    // Verify results contain our vessels
    await expect(page.locator('text=MANUAL001')).toBeVisible();
    await expect(page.locator('text=MANUAL002')).toBeVisible();
    
    // Verify makespan is displayed
    await expect(page.locator('text=/Makespan:.*\\d+/')).toBeVisible();
  });

  test('should clear error messages on valid input', async ({ page }) => {
    // Trigger validation error
    await page.click('button:has-text("Solve Problem")');
    await expect(page.locator('text=/All fields are required/')).toBeVisible();
    
    // Fill in valid data
    await page.fill('input[placeholder="e.g., V001"]', 'V001');
    await page.fill('input[placeholder="0-72"]', '0');
    await page.fill('input[placeholder="1-72"]', '5');
    
    // Click solve again
    await page.click('button:has-text("Solve Problem")');
    
    // Error should be gone and replaced with loading or results
    await expect(page.locator('text=/All fields are required/')).not.toBeVisible();
  });

  test('should handle multiple vessels with different parameters', async ({ page }) => {
    // Change parameters
    await page.locator('label:has-text("Planning Horizon")').locator('..').locator('input').fill('100');
    await page.locator('label:has-text("Number of Berths")').locator('..').locator('input').fill('5');
    
    // Add 5 vessels
    for (let i = 1; i <= 5; i++) {
      if (i > 1) {
        await page.click('button:has-text("Add Vessel")');
      }
      
      const vesselIdInputs = page.locator('input[placeholder="e.g., V001"]');
      await vesselIdInputs.nth(i - 1).fill(`V${String(i).padStart(3, '0')}`);
      
      const arrivalInputs = page.locator('input[placeholder="0-100"]');
      await arrivalInputs.nth(i - 1).fill(String((i - 1) * 10));
      
      const processingInputs = page.locator('input[placeholder="1-100"]');
      await processingInputs.nth(i - 1).fill(String(5 + i));
    }
    
    // Solve
    await page.click('button:has-text("Solve Problem")');
    
    // Verify success
    await expect(page.locator('text=Solution Results')).toBeVisible({ timeout: 15000 });
  });
});
