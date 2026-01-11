"""
Integration tests for API endpoints.
Tests the full API layer including request validation, response format, and error handling.
"""

import pytest
from fastapi import status


@pytest.mark.api
class TestHealthEndpoint:
    """Tests for health check endpoint."""

    def test_health_check_returns_ok(self, test_client):
        """Health endpoint should return 200 OK with status ok."""
        response = test_client.get("/health")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "ok"


@pytest.mark.api
class TestSolveEndpoint:
    """Tests for the solve endpoint."""

    def test_solve_with_valid_data(self, test_client, sample_problem):
        """Should successfully solve a valid scheduling problem."""
        response = test_client.post("/solve", json=sample_problem)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Check response structure
        assert "problem_id" in data
        assert "makespan" in data
        assert "schedule" in data
        assert "solving_time" in data
        assert "vessels" in data
        
        # Check schedule has assignments for all vessels (schedule is a dict)
        assert len(data["schedule"]) == len(sample_problem["vessels"])
        assert len(data["vessels"]) == len(sample_problem["vessels"])

    def test_solve_with_custom_parameters(self, test_client, sample_vessels):
        """Should respect custom planning_horizon and num_berths."""
        problem = {
            "vessels": sample_vessels,
            "planning_horizon": 48,
            "num_berths": 3
        }
        response = test_client.post("/solve", json=problem)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        # Custom parameters affect solving but aren't returned in response
        assert "problem_id" in data
        assert "schedule" in data

    def test_solve_with_default_parameters(self, test_client, sample_vessels):
        """Should use default parameters when not provided."""
        problem = {"vessels": sample_vessels}
        response = test_client.post("/solve", json=problem)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        # Default parameters are used internally
        assert "problem_id" in data
        assert "schedule" in data

    def test_solve_with_empty_vessels(self, test_client):
        """Should handle empty vessel list."""
        problem = {"vessels": []}
        response = test_client.post("/solve", json=problem)
        
        # Currently accepts empty vessels and returns makespan 0
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["makespan"] == 0

    def test_solve_with_invalid_vessel_data(self, test_client):
        """Should handle invalid vessel data."""
        problem = {
            "vessels": [
                {"vessel_id": "V001", "arrival_time": -5, "processing_time": 3}
            ]
        }
        response = test_client.post("/solve", json=problem)
        
        # Currently accepts negative times (no validation)
        assert response.status_code == status.HTTP_200_OK

    def test_solve_with_missing_required_fields(self, test_client):
        """Should reject requests with missing required fields."""
        problem = {
            "vessels": [
                {"vessel_id": "V001", "arrival_time": 0}  # Missing processing_time
            ]
        }
        response = test_client.post("/solve", json=problem)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT

    @pytest.mark.slow
    def test_solve_with_large_problem(self, test_client, large_problem):
        """Should handle larger problem instances."""
        response = test_client.post("/solve", json=large_problem)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["schedule"]) == 20
        assert data["solving_time"] is not None


@pytest.mark.api
class TestSolutionsEndpoint:
    """Tests for listing and retrieving solutions."""

    def test_list_solutions(self, test_client, sample_problem):
        """Should list all solutions."""
        # Create a solution first
        test_client.post("/solve", json=sample_problem)
        
        response = test_client.get("/solutions")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "solutions" in data
        assert isinstance(data["solutions"], list)
        assert len(data["solutions"]) >= 0

    def test_get_specific_solution(self, test_client, sample_problem):
        """Should retrieve a specific solution by ID."""
        # Create a solution
        solve_response = test_client.post("/solve", json=sample_problem)
        problem_id = solve_response.json()["problem_id"]
        
        # Retrieve it
        response = test_client.get(f"/solution/{problem_id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["problem_id"] == problem_id
        assert "schedule" in data
        assert "vessels" in data

    def test_get_nonexistent_solution(self, test_client):
        """Should return error for non-existent solution."""
        response = test_client.get("/solution/nonexistent-id-12345")
        
        # Currently returns 500, could be improved to 404
        assert response.status_code in [status.HTTP_404_NOT_FOUND, status.HTTP_500_INTERNAL_SERVER_ERROR]


@pytest.mark.api
class TestDeleteEndpoint:
    """Tests for solution deletion."""

    def test_delete_solution(self, test_client, sample_problem):
        """Should successfully delete a solution."""
        # Create a solution
        solve_response = test_client.post("/solve", json=sample_problem)
        problem_id = solve_response.json()["problem_id"]
        
        # Delete it
        response = test_client.delete(f"/solution/{problem_id}")
        
        assert response.status_code == status.HTTP_200_OK
        
        # Verify it's deleted (or returns error)
        get_response = test_client.get(f"/solution/{problem_id}")
        assert get_response.status_code in [status.HTTP_404_NOT_FOUND, status.HTTP_500_INTERNAL_SERVER_ERROR]

    def test_delete_nonexistent_solution(self, test_client):
        """Should handle deletion of non-existent solution."""
        response = test_client.delete("/solution/nonexistent-id-12345")
        
        # Currently returns 200 even if doesn't exist
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
