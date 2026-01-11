"""
Integration tests for the solver algorithm.
Tests the core scheduling logic with various problem configurations.
"""

import pytest
from solver import solve_berth_scheduling, BerthSchedulingProblem, VesselData


@pytest.mark.solver
class TestSolverLogic:
    """Tests for berth scheduling solver."""

    def test_solve_simple_problem(self, sample_vessels):
        """Should solve a simple scheduling problem."""
        vessels = [VesselData(**v) for v in sample_vessels]
        problem = BerthSchedulingProblem(vessels=vessels, planning_horizon=72, num_berths=2)
        
        result = solve_berth_scheduling(problem)
        
        assert "makespan" in result
        assert "schedule" in result
        assert "solving_time" in result
        assert len(result["schedule"]) == len(vessels)

    def test_solve_with_one_berth(self):
        """Should handle single berth constraint."""
        vessels = [
            VesselData(vessel_id="V1", arrival_time=0, processing_time=3),
            VesselData(vessel_id="V2", arrival_time=1, processing_time=2),
            VesselData(vessel_id="V3", arrival_time=2, processing_time=4),
        ]
        problem = BerthSchedulingProblem(vessels=vessels, planning_horizon=72, num_berths=1)
        
        result = solve_berth_scheduling(problem)
        
        # All vessels should be on berth 0 (schedule is a dict)
        for vessel_id, assignment in result["schedule"].items():
            assert assignment["berth"] == 0
        
        # No overlaps - each vessel starts after previous ends
        sorted_schedule = sorted(result["schedule"].values(), key=lambda x: x["start_time"])
        for i in range(len(sorted_schedule) - 1):
            assert sorted_schedule[i]["end_time"] <= sorted_schedule[i + 1]["start_time"]

    def test_solve_with_many_berths(self):
        """Should utilize multiple berths when available."""
        vessels = [
            VesselData(vessel_id=f"V{i}", arrival_time=0, processing_time=5)
            for i in range(5)
        ]
        problem = BerthSchedulingProblem(vessels=vessels, planning_horizon=72, num_berths=5)
        
        result = solve_berth_scheduling(problem)
        
        # With enough berths, all vessels can start at arrival time
        for vessel_id, assignment in result["schedule"].items():
            assert assignment["start_time"] == 0

    def test_solve_with_no_vessels(self):
        """Should handle empty vessel list."""
        problem = BerthSchedulingProblem(vessels=[], planning_horizon=72, num_berths=2)
        
        result = solve_berth_scheduling(problem)
        
        assert result["makespan"] == 0
        assert len(result["schedule"]) == 0

    def test_solve_respects_arrival_times(self):
        """Vessels should not start before their arrival time."""
        vessels = [
            VesselData(vessel_id="V1", arrival_time=10, processing_time=5),
            VesselData(vessel_id="V2", arrival_time=20, processing_time=3),
        ]
        problem = BerthSchedulingProblem(vessels=vessels, planning_horizon=72, num_berths=2)
        
        result = solve_berth_scheduling(problem)
        
        for vessel_id, assignment in result["schedule"].items():
            vessel = next(v for v in vessels if v.vessel_id == vessel_id)
            assert assignment["start_time"] >= vessel.arrival_time

    def test_solve_correct_processing_times(self):
        """End time should equal start time plus processing time."""
        vessels = [
            VesselData(vessel_id="V1", arrival_time=0, processing_time=7),
            VesselData(vessel_id="V2", arrival_time=5, processing_time=4),
        ]
        problem = BerthSchedulingProblem(vessels=vessels, planning_horizon=72, num_berths=2)
        
        result = solve_berth_scheduling(problem)
        
        for vessel_id, assignment in result["schedule"].items():
            vessel = next(v for v in vessels if v.vessel_id == vessel_id)
            expected_end = assignment["start_time"] + vessel.processing_time
            assert assignment["end_time"] == expected_end

    def test_makespan_is_latest_departure(self):
        """Makespan should be the maximum end time."""
        vessels = [
            VesselData(vessel_id="V1", arrival_time=0, processing_time=5),
            VesselData(vessel_id="V2", arrival_time=3, processing_time=8),
        ]
        problem = BerthSchedulingProblem(vessels=vessels, planning_horizon=72, num_berths=1)
        
        result = solve_berth_scheduling(problem)
        
        max_end_time = max(assignment["end_time"] for assignment in result["schedule"].values())
        assert result["makespan"] == max_end_time

    def test_no_berth_conflicts(self):
        """Vessels on same berth should not overlap."""
        vessels = [
            VesselData(vessel_id=f"V{i}", arrival_time=i, processing_time=5)
            for i in range(10)
        ]
        problem = BerthSchedulingProblem(vessels=vessels, planning_horizon=72, num_berths=2)
        
        result = solve_berth_scheduling(problem)
        
        # Group by berth
        berth_schedules = {}
        for vessel_id, assignment in result["schedule"].items():
            berth = assignment["berth"]
            if berth not in berth_schedules:
                berth_schedules[berth] = []
            berth_schedules[berth].append(assignment)
        
        # Check no overlaps within each berth
        for berth, assignments in berth_schedules.items():
            sorted_assignments = sorted(assignments, key=lambda x: x["start_time"])
            for i in range(len(sorted_assignments) - 1):
                assert sorted_assignments[i]["end_time"] <= sorted_assignments[i + 1]["start_time"], \
                    f"Overlap detected on berth {berth}"

    @pytest.mark.slow
    def test_solve_large_problem(self, large_problem):
        """Should handle larger problem instances efficiently."""
        vessels = [VesselData(**v) for v in large_problem["vessels"]]
        problem = BerthSchedulingProblem(
            vessels=vessels,
            planning_horizon=large_problem["planning_horizon"],
            num_berths=large_problem["num_berths"]
        )
        
        result = solve_berth_scheduling(problem)
        
        assert len(result["schedule"]) == 20
        assert result["solving_time"] < 5.0  # Should solve in reasonable time
        assert result["makespan"] > 0

    def test_custom_parameters(self):
        """Should respect custom planning_horizon and num_berths."""
        vessels = [
            VesselData(vessel_id="V1", arrival_time=0, processing_time=3),
            VesselData(vessel_id="V2", arrival_time=1, processing_time=3),
        ]
        
        # Test with custom parameters
        problem = BerthSchedulingProblem(vessels=vessels, planning_horizon=48, num_berths=3)
        result = solve_berth_scheduling(problem)
        
        assert len(result["schedule"]) == 2
        # With 3 berths, both vessels can be accommodated immediately
        for vessel_id, assignment in result["schedule"].items():
            vessel = next(v for v in vessels if v.vessel_id == vessel_id)
            assert assignment["start_time"] == vessel.arrival_time
