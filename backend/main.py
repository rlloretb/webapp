"""
FastAPI backend for berth scheduling problem solver.
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import json
import os
from dotenv import load_dotenv
from datetime import datetime, timezone
import uuid

from solver import solve_berth_scheduling, BerthSchedulingProblem, VesselData
from database import DynamoDBManager

load_dotenv()

app = FastAPI(title="Berth Scheduling Solver API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
db = DynamoDBManager()

# Create table if it doesn't exist
try:
    db.create_table()
    print("DynamoDB table created or already exists")
except Exception as e:
    print(f"Note: Table might already exist or error creating: {e}")

# Pydantic models
class Vessel(BaseModel):
    vessel_id: str
    arrival_time: int
    processing_time: int

class SchedulingRequest(BaseModel):
    vessels: List[Vessel]
    planning_horizon: Optional[int] = 72  # Default: 3 days in hours
    num_berths: Optional[int] = 2  # Default: 2 berths

class SchedulingResult(BaseModel):
    problem_id: str
    vessels: List[Vessel]
    schedule: Dict[str, Dict]
    makespan: int
    solving_time: float
    timestamp: str

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}

@app.post("/solve")
async def solve_scheduling(request: SchedulingRequest):
    """
    Solve the berth scheduling problem.
    
    Request body should contain:
    {
        "vessels": [
            {"vessel_id": "V1", "arrival_time": 0, "processing_time": 5},
            ...
        ]
    }
    """
    try:
        # Create problem instance
        problem = BerthSchedulingProblem(
            vessels=[
                VesselData(
                    vessel_id=v.vessel_id,
                    arrival_time=v.arrival_time,
                    processing_time=v.processing_time
                )
                for v in request.vessels
            ],
            planning_horizon=request.planning_horizon,
            num_berths=request.num_berths
        )
        
        # Solve the problem
        result = solve_berth_scheduling(problem)
        
        # Generate problem ID
        problem_id = str(uuid.uuid4())
        
        # Prepare response
        response = SchedulingResult(
            problem_id=problem_id,
            vessels=request.vessels,
            schedule=result['schedule'],
            makespan=result['makespan'],
            solving_time=result['solving_time'],
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        
        # Save to database
        db.save_solution(problem_id, response.dict())
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/upload-json")
async def upload_json(file: UploadFile = File(...)):
    """
    Upload a JSON file containing vessel data and immediately solve it.
    
    Expected JSON format:
    {
        "vessels": [
            {"vessel_id": "V1", "arrival_time": 0, "processing_time": 5},
            ...
        ]
    }
    """
    try:
        contents = await file.read()
        data = json.loads(contents)
        
        # Validate and create request
        request = SchedulingRequest(**data)
        
        # Solve directly
        result = await solve_scheduling(request)
        return result
    
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/solution/{problem_id}")
def get_solution(problem_id: str):
    """Retrieve a previously saved solution."""
    try:
        solution = db.get_solution(problem_id)
        if solution is None:
            raise HTTPException(status_code=404, detail="Solution not found")
        return solution
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/solutions")
def list_solutions(limit: int = 10):
    """List recent solutions."""
    try:
        solutions = db.list_solutions(limit)
        return {"solutions": solutions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/solution/{problem_id}")
def delete_solution(problem_id: str):
    """Delete a saved solution."""
    try:
        db.delete_solution(problem_id)
        return {"message": "Solution deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
