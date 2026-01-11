# Integration Tests

Backend integration tests for the Berth Scheduling webapp using pytest.

## 🎯 Purpose

Integration tests validate the backend components working together:
- **API Layer**: FastAPI endpoints with request/response validation
- **Database**: DynamoDB operations via LocalStack
- **Solver**: Scheduling algorithm with various problem configurations

These tests run faster than E2E tests and don't require browser interaction.

## 🚀 Quick Start

### Prerequisites

Make sure Docker services are running:
```bash
# From project root
docker-compose up
```

### Install Dependencies

```bash
# Navigate to project root
cd c:\Users\roger\Documents\webapp

# Using uv (recommended - fast!)
uv sync --extra test

# Or traditional pip
pip install -r requirements-test.txt
```

### Run Tests

```bash
# Run all integration tests (uv)
uv run pytest

# With verbose output
uv run pytest -v

# Run specific test file
uv run pytest test_api.py

# Or with activated venv (both uv and pip)
pytest -v
```

## 📁 Test Structure

```
tests/integration/
├── conftest.py              # Pytest fixtures and configuration
├── pytest.ini               # Pytest settings
├── test_api.py             # API endpoint tests (13 tests)
├── test_database.py        # Database operation tests (6 tests)
├── test_solver.py          # Solver algorithm tests (11 tests)
└── README.md               # This file

**Note**: Dependencies are now managed at the project root:
- `requirements.txt` - Production dependencies
- `requirements-test.txt` - Test dependencies
```

## 🧪 Test Coverage

### API Tests (`test_api.py`)
Tests FastAPI endpoints with TestClient:
- ✅ Health check endpoint
- ✅ POST /solve with valid data
- ✅ Custom parameters (planning_horizon, num_berths)
- ✅ Default parameter handling
- ✅ Input validation and error handling
- ✅ GET /solutions listing
- ✅ GET /solution/{id} retrieval
- ✅ DELETE /solution/{id} removal

### Database Tests (`test_database.py`)
Tests DynamoDB operations:
- ✅ Save and retrieve solutions
- ✅ List all solutions
- ✅ Delete solutions
- ✅ Data type preservation
- ✅ Error handling (non-existent IDs)

### Solver Tests (`test_solver.py`)
Tests scheduling algorithm:
- ✅ Basic problem solving
- ✅ Single berth constraint
- ✅ Multiple berth utilization
- ✅ Arrival time constraints
- ✅ Processing time correctness
- ✅ No berth conflicts (overlap detection)
- ✅ Makespan calculation
- ✅ Edge cases (empty vessels, large problems)

## 🏷️ Test Markers

Use markers to run specific test categories:

```python
@pytest.mark.api        # API endpoint tests
@pytest.mark.database   # Database integration tests
@pytest.mark.solver     # Solver algorithm tests
@pytest.mark.slow       # Long-running tests
```

Run by marker:
```bash
pytest -m api          # Fast API tests
pytest -m "not slow"   # Skip slow tests for quick feedback
```

## 🔧 Configuration

### Environment Variables
Tests automatically set LocalStack environment:
- `DYNAMODB_ENDPOINT_URL=http://localhost:4566`
- `AWS_REGION=us-east-1`
- `AWS_ACCESS_KEY_ID=test`
- `AWS_SECRET_ACCESS_KEY=test`

### Fixtures
Common fixtures in `conftest.py`:
- `test_client`: FastAPI TestClient
- `db_manager`: DynamoDB manager instance
- `sample_vessels`: Small test dataset (3 vessels)
- `sample_problem`: Complete problem (4 vessels)
- `large_problem`: Performance test (20 vessels)

## 📊 Test Execution Time

Typical execution times:
- API tests: ~2-5 seconds
- Database tests: ~1-3 seconds
- Solver tests: ~3-8 seconds
- **Total**: ~10-15 seconds

Much faster than E2E tests (~2-3 minutes).

## 🐛 Debugging

### Verbose Output
```bash
pytest -v          # Verbose test names
pytest -vv         # Very verbose with diff
pytest -s          # Show print statements
```

### Run Failed Tests
```bash
pytest --lf        # Last failed
pytest --ff        # Failed first
```

### Debug with PDB
```bash
pytest --pdb       # Drop into debugger on failure
```

### View Coverage
```bash
pip install pytest-cov
pytest --cov=../../backend --cov-report=html
```

## 🔄 CI/CD Integration

These tests can run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Integration Tests
  run: |
    docker-compose up -d
    pip install -r requirements-test.txt
    cd tests/integration
    pytest -v
```

## 📝 Writing New Tests

### Test File Template
```python
import pytest

@pytest.mark.api  # Use appropriate marker
class TestNewFeature:
    """Tests for new feature."""
    
    def test_something(self, test_client, sample_problem):
        """Should do something specific."""
        response = test_client.post("/endpoint", json=sample_problem)
        
        assert response.status_code == 200
        assert "expected_field" in response.json()
```

### Best Practices
1. **Use descriptive names**: `test_solve_with_invalid_vessels`
2. **One assertion focus**: Test one behavior per test
3. **Use fixtures**: Reuse common test data
4. **Add markers**: Categorize tests appropriately
5. **Document**: Add docstring explaining what's tested

## 🆚 Integration vs E2E Tests

| Aspect | Integration | E2E |
|--------|------------|-----|
| **Speed** | Fast (10-15s) | Slow (2-3min) |
| **Scope** | Backend only | Full stack |
| **Browser** | No | Yes |
| **Use Case** | TDD, unit-like | User journeys |
| **Debugging** | Easy | Complex |
| **Cost** | Low | High |

**Use integration tests for**:
- Backend development and debugging
- Algorithm validation
- Database operations
- API contract testing

**Use E2E tests for**:
- User workflow validation
- UI interaction testing
- Cross-browser compatibility
- Release verification
