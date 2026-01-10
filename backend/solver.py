"""
Berth scheduling problem formulation and solver.

Problem: Minimize makespan (latest departure time) for all vessels
given their arrival times and processing times.

Constraints:
- Each vessel can occupy at most one berth
- Vessels cannot overlap at the same berth
- Time is discrete (hours)
- Planning horizon is 72 hours (3 days)
"""

from dataclasses import dataclass
from typing import Dict, List
import time

@dataclass
class VesselData:
    """Vessel arrival and processing information."""
    vessel_id: str
    arrival_time: int
    processing_time: int

@dataclass
class BerthSchedulingProblem:
    """Berth scheduling problem instance."""
    vessels: List[VesselData]
    planning_horizon: int = 72  # 3 days in hours
    num_berths: int = 2

def solve_berth_scheduling(problem: BerthSchedulingProblem) -> Dict:
    """
    Solve the berth scheduling problem using a simple heuristic.
    
    Heuristic approach:
    1. Sort vessels by arrival time
    2. Assign each vessel to the earliest available berth
    3. Update berth availability
    
    Returns:
        Dictionary with:
        - schedule: Dict mapping vessel_id to (berth, start_time, end_time)
        - makespan: Latest departure time
        - solving_time: Time taken to solve
    """
    start_time = time.time()
    
    # Validate input
    if not problem.vessels:
        return {
            'schedule': {},
            'makespan': 0,
            'solving_time': time.time() - start_time
        }
    
    # Heuristic: First-Come-First-Served with earliest available berth
    schedule = {}
    berth_availability = {b: 0 for b in range(problem.num_berths)}  # Track when each berth becomes free
    
    # Sort vessels by arrival time
    sorted_vessels = sorted(problem.vessels, key=lambda v: v.arrival_time)
    
    for vessel in sorted_vessels:
        # Find the berth that becomes available earliest
        best_berth = min(berth_availability, key=berth_availability.get)
        
        # Vessel can start at max(arrival_time, berth_available_time)
        start_time_vessel = max(vessel.arrival_time, berth_availability[best_berth])
        
        # Check planning horizon
        if start_time_vessel >= problem.planning_horizon:
            raise ValueError(f"Vessel {vessel.vessel_id} cannot be scheduled within planning horizon")
        
        end_time_vessel = start_time_vessel + vessel.processing_time
        
        # Assign vessel to berth
        schedule[vessel.vessel_id] = {
            'berth': int(best_berth),
            'start_time': int(start_time_vessel),
            'end_time': int(end_time_vessel),
            'arrival_time': vessel.arrival_time,
            'processing_time': vessel.processing_time
        }
        
        # Update berth availability
        berth_availability[best_berth] = end_time_vessel
    
    # Calculate makespan
    makespan = max(v['end_time'] for v in schedule.values()) if schedule else 0
    
    solving_time = time.time() - start_time
    
    return {
        'schedule': schedule,
        'makespan': makespan,
        'solving_time': solving_time
    }
