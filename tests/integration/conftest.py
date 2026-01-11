"""
Pytest configuration and fixtures for integration tests.
"""

import pytest
import sys
import os
from pathlib import Path

# Set AWS credentials BEFORE any imports
os.environ["DYNAMODB_ENDPOINT_URL"] = "http://localhost:4566"
os.environ["AWS_REGION"] = "us-east-1"
os.environ["AWS_ACCESS_KEY_ID"] = "test"
os.environ["AWS_SECRET_ACCESS_KEY"] = "test"
os.environ["AWS_DEFAULT_REGION"] = "us-east-1"

# Add backend directory to Python path
backend_path = Path(__file__).parent.parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from fastapi.testclient import TestClient
from main import app, db
from database import DynamoDBManager


@pytest.fixture(scope="session")
def api_base_url():
    """Base URL for API tests (assumes docker-compose is running)."""
    return os.getenv("API_BASE_URL", "http://localhost:8000")


@pytest.fixture(scope="module")
def test_client():
    """
    FastAPI TestClient for direct API testing without HTTP overhead.
    Uses the actual app with LocalStack DynamoDB.
    """
    return TestClient(app)


@pytest.fixture(scope="module")
def db_manager():
    """DynamoDB manager instance for database tests."""
    return db


@pytest.fixture(autouse=True)
def setup_test_environment():
    """Set up test environment variables."""
    os.environ["DYNAMODB_ENDPOINT_URL"] = "http://localhost:4566"
    os.environ["AWS_REGION"] = "us-east-1"
    os.environ["AWS_ACCESS_KEY_ID"] = "test"
    os.environ["AWS_SECRET_ACCESS_KEY"] = "test"
    os.environ["AWS_DEFAULT_REGION"] = "us-east-1"
    yield
    # Cleanup after test if needed


@pytest.fixture
def sample_vessels():
    """Sample vessel data for testing."""
    return [
        {"vessel_id": "V001", "arrival_time": 0, "processing_time": 5},
        {"vessel_id": "V002", "arrival_time": 3, "processing_time": 7},
        {"vessel_id": "V003", "arrival_time": 8, "processing_time": 4},
    ]


@pytest.fixture
def sample_problem():
    """Sample complete scheduling problem."""
    return {
        "planning_horizon": 72,
        "num_berths": 2,
        "vessels": [
            {"vessel_id": "V001", "arrival_time": 0, "processing_time": 5},
            {"vessel_id": "V002", "arrival_time": 3, "processing_time": 7},
            {"vessel_id": "V003", "arrival_time": 8, "processing_time": 4},
            {"vessel_id": "V004", "arrival_time": 10, "processing_time": 6},
        ]
    }


@pytest.fixture
def large_problem():
    """Large scheduling problem for performance testing."""
    vessels = []
    for i in range(20):
        vessels.append({
            "vessel_id": f"V{i:03d}",
            "arrival_time": i * 2,
            "processing_time": 3 + (i % 5)
        })
    return {
        "planning_horizon": 100,
        "num_berths": 3,
        "vessels": vessels
    }
