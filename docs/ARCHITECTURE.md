# System Architecture

## Overall Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User's Web Browser                        │
│                  (localhost:3000)                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP/WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React 18)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Header (App Title + Status)                         │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Sidebar        │ Main Content Area             │  │   │
│  │  │ Navigation     │ ┌─────────────────────────┐  │  │   │
│  │  │ • Dashboard    │ │ Active Page Content     │  │  │   │
│  │  │ • Solver       │ │ • Dashboard             │  │  │   │
│  │  │ • History      │ │ • Solver (Forms)        │  │  │   │
│  │  │                │ │ • History (Table)       │  │  │   │
│  │  │                │ │ • Modals                │  │  │   │
│  │  │                │ └─────────────────────────┘  │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  Footer (Copyright)                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Technologies: React, Axios, React Router, CSS             │
│  Port: 3000                                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ REST API (JSON)
                           │ Proxy: http://backend:8000
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND (FastAPI/Python)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Layer (FastAPI)                                │   │
│  │  ├─ GET /health                                      │   │
│  │  ├─ POST /solve                                      │   │
│  │  ├─ POST /upload-json                                │   │
│  │  ├─ GET /solutions                                   │   │
│  │  ├─ GET /solution/{id}                               │   │
│  │  └─ DELETE /solution/{id}                            │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Business Logic Layer                                │   │
│  │  ├─ solver.py                                         │   │
│  │  │  ├─ BerthSchedulingProblem (Data Model)           │   │
│  │  │  ├─ VesselData (Data Model)                       │   │
│  │  │  └─ solve_berth_scheduling() (Greedy Heuristic)   │   │
│  │  └─ main.py (Request Handling)                        │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Data Access Layer                                   │   │
│  │  └─ database.py (DynamoDB Manager)                   │   │
│  │     ├─ save_solution()                               │   │
│  │     ├─ get_solution()                                │   │
│  │     ├─ list_solutions()                              │   │
│  │     └─ delete_solution()                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Technologies: FastAPI, Pydantic, Python 3.11              │
│  Port: 8000                                                 │
│  CORS: Enabled for frontend                                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ AWS SDK (Boto3)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE & SERVICES LAYER                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  LOCAL DEVELOPMENT (Docker Services)                │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │ LocalStack (DynamoDB Emulation)              │    │   │
│  │  │ ├─ Table: berth-scheduling-solutions         │    │   │
│  │  │ ├─ Partition Key: problem_id                 │    │   │
│  │  │ └─ Sort Key: timestamp                        │    │   │
│  │  │ Port: 4566                                    │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  │                                                       │   │
│  │  PRODUCTION (AWS Services)                           │   │
│  │  └─ AWS DynamoDB (Managed)                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Technologies: LocalStack (dev), AWS DynamoDB (prod)       │
│  Storage: Solutions with schedules and metadata            │
└─────────────────────────────────────────────────────────────┘
```

## Container Architecture (Docker Compose)

```
┌────────────────────────────────────────────────────────────────┐
│                    Docker Network: berth-network               │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │  Frontend    │    │  Backend     │    │  LocalStack  │     │
│  │  Container   │    │  Container   │    │  Container   │     │
│  │              │    │              │    │              │     │
│  │ Node 18      │    │ Python 3.11  │    │ LocalStack   │     │
│  │ React App    │    │ FastAPI App  │    │ DynamoDB     │     │
│  │              │    │              │    │              │     │
│  │ Port: 3000   │◄──►│ Port: 8000   │◄──►│ Port: 4566   │     │
│  │              │    │              │    │              │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
│        ▲                    ▲                                   │
│        │                    │                                   │
│        └────Host Ports──────┘                                   │
│             3000             8000                               │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Scenario: Upload and Solve Problem

```
1. USER ACTION (Browser)
   └─ Select JSON file or enter vessels
   
2. FRONTEND (React)
   └─ Validate input
   └─ Create request payload
   └─ Send HTTP POST to /solve or /upload-json
   
3. BACKEND (FastAPI)
   └─ Receive request
   └─ Parse JSON and validate with Pydantic
   └─ Create BerthSchedulingProblem instance
   
4. SOLVER (Python)
   └─ Sort vessels by arrival time
   └─ For each vessel:
      ├─ Find berth with earliest availability
      ├─ Schedule at max(arrival_time, berth_available)
      └─ Update berth availability
   └─ Calculate makespan
   └─ Return schedule + metrics
   
5. DATABASE (DynamoDB)
   └─ Generate problem_id (UUID)
   └─ Save solution to DynamoDB table
   └─ Return success/error
   
6. RESPONSE (FastAPI → Frontend)
   └─ SchedulingResult JSON:
      ├─ problem_id
      ├─ schedule (vessel → berth, times)
      ├─ makespan
      ├─ solving_time
      └─ timestamp
   
7. DISPLAY (React)
   └─ Show results in modal
   └─ Update dashboard metrics
   └─ Add to solution history
   
8. PERSISTENT STORAGE
   └─ Solution saved in DynamoDB
   └─ Can retrieve anytime via problem_id
```

## Algorithm Flow

```
INPUT: Problem with N vessels
       Each vessel: (id, arrival_time, processing_time)

ALGORITHM: Greedy Heuristic
│
├─ Step 1: Sort vessels by arrival_time
│         Time: O(N log N)
│
├─ Step 2: Initialize berth_availability[]
│         Each berth starts at time 0
│         Space: O(M) where M = number of berths
│
├─ Step 3: For each sorted vessel v:
│         Time: O(N × M)
│         │
│         ├─ Find berth with min(availability_time)
│         ├─ start_time[v] = max(arrival_time[v], berth_available[best_berth])
│         ├─ end_time[v] = start_time[v] + processing_time[v]
│         ├─ berth_available[best_berth] = end_time[v]
│         └─ schedule[v] = (berth, start_time, end_time)
│
├─ Step 4: Calculate makespan
│         makespan = max(end_time) over all vessels
│         Time: O(N)
│
└─ OUTPUT: Schedule, makespan, solving_time
          Time Complexity: O(N² + N log N) ≈ O(N²)
          Space Complexity: O(N + M)
```

## Component Hierarchy (Frontend)

```
App
├─ Header
│  ├─ title
│  └─ status-badge
├─ Layout (Flex)
│  ├─ Sidebar
│  │  └─ nav-items
│  │     ├─ Dashboard
│  │     ├─ Solver
│  │     └─ History
│  │
│  └─ MainContent
│     ├─ Page (dynamic based on nav)
│     │  ├─ Dashboard
│     │  │  ├─ KPI Cards (3x)
│     │  │  ├─ Recent Solutions Table
│     │  │  └─ Getting Started Section
│     │  │
│     │  ├─ Solver
│     │  │  ├─ File Upload Card
│     │  │  ├─ Manual Entry Card
│     │  │  │  ├─ Vessel Table
│     │  │  │  ├─ Add Vessel Button
│     │  │  │  └─ Solve Button
│     │  │  └─ Result Modal
│     │  │     ├─ Solution Summary
│     │  │     └─ Schedule Table
│     │  │
│     │  └─ History
│     │     ├─ Solutions Table
│     │     └─ Details Modal
│     │
│     └─ Footer
```

## Database Schema

```
Table: berth-scheduling-solutions

Partition Key: problem_id (String)
Sort Key: timestamp (String)

Attributes:
├─ problem_id (S, Hash Key)
├─ timestamp (S, Range Key)
├─ makespan (N)
├─ solving_time (S)
├─ num_vessels (N)
├─ schedule_json (S) - JSON string
└─ vessels_json (S) - JSON string

Example Item:
{
  "problem_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-01-06T12:34:56.789012",
  "makespan": 32,
  "solving_time": "0.00234",
  "num_vessels": 10,
  "schedule_json": "{\"V001\": {...}, \"V002\": {...}}",
  "vessels_json": "[{\"vessel_id\": \"V001\", ...}]"
}
```

## Deployment Architecture (AWS)

```
PRODUCTION (Future)

User Browser
    ▼
CloudFront (CDN)
    ▼
S3 Bucket (React SPA)
    ▼
Application Load Balancer
    ▼
┌──────────────────────────────────────┐
│ EC2 Instances (FastAPI)              │
│ ├─ Instance 1 (us-east-1a)           │
│ ├─ Instance 2 (us-east-1b)           │
│ └─ Instance 3 (us-east-1c)           │
│ Auto Scaling Group                   │
└──────────────────────────────────────┘
    ▼
DynamoDB (Managed)
    ▼
CloudWatch Logs
```

## Technology Stack

```
FRONTEND TIER
├─ React 18          (UI Framework)
├─ Axios             (HTTP Client)
├─ React Router      (Navigation)
├─ CSS3              (Styling)
└─ Node.js           (Build Tool)

BACKEND TIER
├─ FastAPI          (API Framework)
├─ Pydantic         (Data Validation)
├─ Python 3.11      (Runtime)
├─ Uvicorn          (ASGI Server)
└─ Boto3            (AWS SDK)

DATABASE TIER
├─ DynamoDB (Local via LocalStack)
└─ DynamoDB (AWS)

INFRASTRUCTURE
├─ Docker           (Containerization)
├─ Docker Compose   (Local Orchestration)
├─ Git              (Version Control)
└─ AWS              (Cloud Platform)
```

---

**Version**: 1.0.0
**Last Updated**: January 2026
