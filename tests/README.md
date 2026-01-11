# Tests

This directory contains all test suites for the Berth Scheduling webapp.

## 📁 Structure

```
tests/
├── e2e/          # End-to-end tests using Playwright
└── integration/  # Backend integration tests using pytest
```

## 🧪 Test Suites

### Integration Tests
Backend integration tests for API, database, and solver components. Fast, focused tests for backend development.

- **Location**: `tests/integration/`
- **Framework**: pytest
- **Coverage**: 32 tests across API, database, and solver logic
- **Execution time**: ~10-15 seconds

For detailed information and instructions, see [tests/integration/README.md](integration/README.md).

### E2E Tests
Comprehensive end-to-end tests covering the full application workflow, including UI interactions and API endpoints.

- **Location**: `tests/e2e/`
- **Framework**: Playwright
- **Coverage**: 35 tests across Dashboard, Solver, History, and API integration
- **Execution time**: ~2-3 minutes

For detailed information and instructions, see [tests/e2e/README.md](e2e/README.md).

## 🚀 Quick Start

### Run Integration Tests

```bash
# Make sure Docker is running
docker-compose up

# Install dependencies (from project root)
uv sync --extra test
# Or: pip install -r requirements-test.txt

# Navigate to integration test directory
cd tests/integration

# Run tests
uv run pytest
# Or: pytest

# Run with verbose output
uv run pytest -v
```

### Run E2E Tests

### E2E Tests
Run automatically on GitHub Actions for:
- Push to main/master/develop branches
- Pull requests
- Manual workflow dispatch

See [.github/workflows/e2e-tests.yml](../.github/workflows/e2e-tests.yml) for configuration.

### Integration Tests
Can be added to CI/CD pipelines:
```bash
docker-compose up -d
cd tests/integration
pip install -r requirements.txt
pytest -v
```

## 📈 Test Metrics

| Type | Count | Time | Scope |
|------|-------|------|-------|
| Integration | 32 | ~15s | Backend |
| E2E | 35 | ~2-3min | Full Stack |
| **Total** | **67** | **~3-4min** | **Complete Coverage** |

# Install dependencies (first time only)
npm install
npx playwright install

# Run tests
npm test
```

## 🎯 When to Use Which Tests

### Use Integration Tests When:
- 🚀 Developing backend features
- 🐛 Debugging API or solver issues  
- ⚡ Need fast feedback (10-15 seconds)
- 🔍 Testing specific business logic
- 💰 Want low-cost test runs

### Use E2E Tests When:
- 👤 Validating user workflows
- 🎨 Testing UI interactions
- 🌐 Verifying cross-browser compatibility
- 📦 Final pre-release verification
- 🔗 Testing full stack integration

## 📊 CI/CD

E2E tests run automatically on GitHub Actions for:
- Push to main/master/develop branches
- Pull requests
- Manual workflow dispatch

See [.github/workflows/e2e-tests.yml](../.github/workflows/e2e-tests.yml) for configuration.
