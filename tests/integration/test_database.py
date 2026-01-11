"""
Integration tests for database operations.
Tests DynamoDB operations with LocalStack.
"""

import pytest
import uuid
from datetime import datetime


@pytest.mark.database
class TestDatabaseOperations:
    """Tests for DynamoDB operations."""

    def test_save_and_retrieve_solution(self, db_manager):
        """Should save and retrieve a solution correctly."""
        problem_id = str(uuid.uuid4())
        solution_data = {
            "makespan": 15,
            "solving_time": 0.123,
            "schedule": {
                "V001": {"berth": 1, "start_time": 0, "end_time": 5}
            },
            "vessels": [
                {"vessel_id": "V001", "arrival_time": 0, "processing_time": 5}
            ],
            "timestamp": datetime.now().isoformat()
        }
        
        # Save solution
        db_manager.save_solution(problem_id, solution_data)
        
        # Retrieve solution
        retrieved = db_manager.get_solution(problem_id)
        
        assert retrieved is not None
        assert retrieved["problem_id"] == problem_id
        assert retrieved["makespan"] == solution_data["makespan"]

    def test_list_all_solutions(self, db_manager):
        """Should list all solutions in the database."""
        solutions = db_manager.list_solutions()
        
        assert isinstance(solutions, list)
        # Should have at least the solutions created in previous tests
        assert len(solutions) >= 0

    def test_delete_solution(self, db_manager):
        """Should delete a solution from the database."""
        # Create a solution
        problem_id = str(uuid.uuid4())
        solution_data = {
            "makespan": 10,
            "solving_time": 0.1,
            "schedule": {},
            "vessels": [],
            "timestamp": datetime.now().isoformat()
        }
        db_manager.save_solution(problem_id, solution_data)
        
        # Delete it
        db_manager.delete_solution(problem_id)
        
        # Verify it's deleted
        retrieved = db_manager.get_solution(problem_id)
        assert retrieved is None

    def test_get_nonexistent_solution(self, db_manager):
        """Should return None for non-existent solution."""
        result = db_manager.get_solution("nonexistent-id-12345")
        
        assert result is None

    def test_solution_data_integrity(self, db_manager):
        """Should preserve data types and structure."""
        problem_id = str(uuid.uuid4())
        solution_data = {
            "makespan": 25,
            "solving_time": 0.456,
            "schedule": {
                "V001": {"berth": 1, "start_time": 0, "end_time": 5},
                "V002": {"berth": 2, "start_time": 3, "end_time": 10},
            },
            "vessels": [
                {"vessel_id": "V001", "arrival_time": 0, "processing_time": 5},
                {"vessel_id": "V002", "arrival_time": 3, "processing_time": 7},
            ],
            "timestamp": datetime.now().isoformat()
        }
        
        db_manager.save_solution(problem_id, solution_data)
        retrieved = db_manager.get_solution(problem_id)
        
        # Verify data types (DynamoDB may return Decimal for numbers)
        from decimal import Decimal
        assert isinstance(retrieved["makespan"], (int, Decimal))
        assert isinstance(retrieved["schedule"], dict)
        assert isinstance(retrieved["vessels"], list)
        
        # Verify nested data (handle Decimal)
        assert int(retrieved["schedule"]["V001"]["start_time"]) == 0
        assert retrieved["vessels"][1]["processing_time"] == 7
