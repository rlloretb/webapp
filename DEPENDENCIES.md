# Dependency Management

This project uses `uv` for fast, modern Python dependency management with `pyproject.toml` as the single source of truth.

## Quick Start with uv

```bash
# Install dependencies
uv pip install -e .

# Install with test dependencies
uv pip install -e ".[test]"

# Or use uv sync (recommended)
uv sync
uv sync --extra test
```

## Files

### `pyproject.toml` ⭐
**Primary dependency source** - All dependencies defined here.

**Install production dependencies:**
```bash
uv pip install -e .
# Or: uv sync
```

**Install with test dependencies:**
```bash
uv pip install -e ".[test]"
# Or: uv sync --extra test
```

### `requirements.txt` & `requirements-test.txt`
**Legacy compatibility files** - Kept for Docker builds and traditional pip workflows.

```bash
# Traditional pip installation (still works)
pip install -r requirements.txt
pip install -r requirements-test.txt
```

These files mirror `pyproject.toml` but are maintained for:
- Docker image builds (faster, cacheable layers)
- CI/CD systems without uv
- Team members not using uv

## Why This Structure?

✅ **pyproject.toml** - Single source of truth (for uv users)  
✅ **requirements.txt** - Docker/CI compatibility  
✅ **uv** - Fast dependency resolution and installation  
✅ **Backward compatible** - Works with traditional pip too

## Development Workflow with uv

### Initial Setup
```bash
# Create virtual environment with uv
uv venv

# Activate it
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac

# Install all dependencies (including test)
uv sync --extra test

# Or install in editable mode
uv pip install -e ".[test]"
```

### Adding New Dependencies

**Production dependency:**
```bash
# Add to pyproject.toml manually, then:
uv sync

# Or use uv to add it:
uv add fastapi uvicorn
```

**Test-only dependency:**
```bash
# Add to [project.optional-dependencies].test in pyproject.toml
uv sync --extra test
```

### Running the Application
```bash
# Backend (uses requirements.txt for build speed)
```dockerfile
COPY requirements.txt .
RUN pip install -r requirements.txt
```

### GitHub Actions (with uv - faster)
```yaml
- uses: astral-sh/setup-uv@v1
- name: Install dependencies
  run: uv sync --extra test
- name: Run tests
  run: uv run pytest
```

### GitHub Actions (traditional pip)
```yaml
- name: Install dependencies
  run: pip install -r requirements-test.txt
- name: Run tests
  run: pytest
```

## Upgrading Dependencies with uv

```bash
# Update all dependencies to latest compatible versions
uv sync --upgrade

# Update specific package
uv add --upgrade fastapi

# Generate updated requirements.txt from pyproject.toml
uv pip compile pyproject.toml -o requirements.txt
uv pip compile --extra test pyproject.toml -o requirements-test.tx
## Traditional pip Workflow

If not using uv, everything still works with pip:

```bash
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements-test.txt

# Run tests
cd tests/integration
pytest
```

## CI/CD Integration

### Docker
The Dockerfile uses `requirements.txt` for production images:
```dockerfile
COPY requirements.txt .
RUN pip install -r requirements.txt
```

### GitHub Actions
Use `requirements-test.txt` for running tests:
```yaml
- name: Install dependencies
  run: pip install -r requirements-test.txt

- name: Run tests
  run: pytest
```

## Best Practices

1. **Pin versions** - Use exact versions (`==`) for reproducibility
2. **Update regularly** - Keep dependencies up to date for security
3. **Test after updates** - Run full test suite after dependency changes
4. **Document changes** - Note breaking changes in commit messages
5. **Use virtual environments** - Always work in a venv to avoid conflicts
