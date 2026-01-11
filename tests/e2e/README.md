# E2E Testing for Berth Scheduling Webapp

Comprehensive end-to-end tests using Playwright for the Berth Scheduling application.

## 🚀 Quick Start

```bash
# Navigate to e2e directory
cd tests/e2e

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Make sure the app is running (in another terminal)
cd ../..
docker-compose up

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed
```

## 📁 Project Structure

```
tests/e2e/
├── tests/
│   ├── dashboard.spec.js         # Dashboard page tests
│   ├── solver-upload.spec.js     # File upload functionality
│   ├── solver-manual.spec.js     # Manual vessel entry tests
│   ├── history.spec.js           # History page and solution management
│   └── api-integration.spec.js   # Direct API endpoint tests
├── fixtures/
│   └── test-data.json            # Test data for uploads
├── playwright.config.js          # Playwright configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🧪 Test Coverage

### Dashboard Tests (`dashboard.spec.js`)
- ✅ Display dashboard title and KPI metrics
- ✅ Show recent solutions section
- ✅ Navigate to different pages (Solver, History)
- ✅ Responsive sidebar functionality

### Solver Upload Tests (`solver-upload.spec.js`)
- ✅ Upload JSON files with problem data
- ✅ Load planning_horizon and num_berths from file
- ✅ Verify vessels loaded correctly
- ✅ Solve problem and display results
- ✅ Save solution to history

### Solver Manual Entry Tests (`solver-manual.spec.js`)
- ✅ Display default parameters (72 hours, 2 berths)
- ✅ Update placeholders when planning horizon changes
- ✅ Add and remove vessel rows
- ✅ Validate input fields (empty, non-numeric)
- ✅ Solve with custom parameters
- ✅ Handle multiple vessels

### History Tests (`history.spec.js`)
- ✅ Display solutions table with correct columns
- ✅ View solution details in modal
- ✅ Delete solutions
- ✅ Handle empty history
- ✅ Integration with newly solved problems

### API Integration Tests (`api-integration.spec.js`)
- ✅ Health check endpoint
- ✅ Solve via POST /solve
- ✅ Custom parameters (planning_horizon, num_berths)
- ✅ List solutions (GET /solutions)
- ✅ Retrieve specific solution (GET /solution/{id})
- ✅ Delete solution (DELETE /solution/{id})
- ✅ Error handling (404, 422, 400)
- ✅ Default parameter behavior

## 🎯 Test Scenarios

### Critical User Journeys

**Journey 1: Upload and Solve**
1. Navigate to Solver page
2. Upload test_instance.json
3. Verify data loads (72 hours, 2 berths, 10 vessels)
4. Click "Solve Problem"
5. View results in modal
6. Verify solution in History

**Journey 2: Manual Entry with Custom Parameters**
1. Navigate to Solver page
2. Change planning_horizon to 48
3. Change num_berths to 3
4. Add 3 vessels manually
5. Solve and verify results
6. Check History

**Journey 3: Solution Management**
1. View saved solutions in History
2. Click "View" on a solution
3. Inspect schedule details
4. Delete solution
5. Verify deletion

## 📊 Running Tests

### All Tests
```bash
npm test
```

### Specific Browser
```bash
npm run test:chromium   # Chrome/Edge
npm run test:firefox    # Firefox
npm run test:webkit     # Safari
```

### Mobile Testing
```bash
npm run test:mobile
```

### Debug Mode
```bash
npm run test:debug
```

### Interactive UI Mode
```bash
npm run test:ui
```

### Generate Code
```bash
npm run codegen  # Opens browser to record actions
```

## 🎬 Viewing Reports

```bash
# After tests run, view HTML report
npm run report
```

Reports are saved in `playwright-report/` directory.

## ⚙️ Configuration

Configuration is in `playwright.config.js`:

- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Timeout**: 30 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: Only on failure
- **Videos**: Retained on failure
- **Web Server**: Auto-starts docker-compose

## 🐛 Debugging

### Debug Single Test
```bash
npx playwright test solver-upload --debug
```

### Slow Motion
```bash
npx playwright test --headed --slow-mo=1000
```

### Show Browser
```bash
npx playwright test --headed
```

### Inspector
```bash
npx playwright test --debug
```

## 🔧 Troubleshooting

### Issue: Tests fail with "Target closed"
**Solution**: Increase timeout in playwright.config.js
```javascript
timeout: 60 * 1000,
```

### Issue: Cannot connect to localhost:3000
**Solution**: Make sure docker-compose is running
```bash
docker-compose up
```

### Issue: File upload tests fail
**Solution**: Check file paths are correct relative to e2e directory
```javascript
const testFilePath = path.join(process.cwd(), '..', 'data', 'test_instance.json');
```

### Issue: Tests are flaky
**Solution**: 
1. Add explicit waits: `await expect(element).toBeVisible()`
2. Use `page.waitForLoadState('networkidle')`
3. Increase `actionTimeout` in config

## 📝 Writing New Tests

### Template
```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-page');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await page.click('button:has-text("Click Me")');
    
    // Act
    await page.fill('input[name="field"]', 'value');
    await page.click('button[type="submit"]');
    
    // Assert
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### Best Practices
1. ✅ Use descriptive test names
2. ✅ Use `test.describe()` to group related tests
3. ✅ Use `beforeEach()` for common setup
4. ✅ Wait for elements with `toBeVisible()`
5. ✅ Use semantic selectors (text, role, label)
6. ✅ Avoid hard-coded waits (`page.waitForTimeout()`)
7. ✅ Test one thing per test
8. ✅ Clean up test data when needed

## 🚦 CI/CD Integration

Tests are configured to run in CI with:
- GitHub Actions workflow (see `.github/workflows/e2e-tests.yml`)
- Automatic retries on failure
- Artifact upload for reports
- Test result publishing

## 📈 Test Metrics

Current coverage:
- **Dashboard**: 6 tests
- **Solver Upload**: 5 tests
- **Solver Manual**: 8 tests
- **History**: 6 tests
- **API Integration**: 10 tests

**Total: 35 comprehensive E2E tests**

## 🔗 Useful Links

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Test Generator](https://playwright.dev/docs/codegen)

## 📞 Support

If tests fail:
1. Check app is running (`docker-compose ps`)
2. View test report (`npm run report`)
3. Run in debug mode (`npm run test:debug`)
4. Check browser console for errors
5. Review test logs in terminal

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Test Framework**: Playwright v1.40
