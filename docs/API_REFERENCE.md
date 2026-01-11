# API Reference

## Base URL
- **Local Development**: `http://localhost:8000`
- **Production**: `https://your-api-endpoint.com`

## Health Check

### GET /health
Health check endpoint to verify API is running.

**Response** (200 OK):
```json
{
  "status": "ok"
}
```

---

## Solver Endpoints

### POST /solve
Solve the berth scheduling problem with JSON payload.

**Request**:
```json
{
  "vessels": [
    {
      "vessel_id": "V001",
      "arrival_time": 0,
      "processing_time": 6
    },
    {
      "vessel_id": "V002",
      "arrival_time": 2,
      "processing_time": 8
    }
  ],
  "planning_horizon": 72,
  "num_berths": 2
}
```

**Request Parameters**:
- `vessels` (required): Array of vessel objects with:
  - `vessel_id` (string): Unique identifier
  - `arrival_time` (integer): Arrival time in hours
  - `processing_time` (integer): Processing duration in hours
- `planning_horizon` (optional, default: 72): Total time window in hours
- `num_berths` (optional, default: 2): Number of available berths

**Response** (200 OK):
```json
{
  "problem_id": "uuid-string",
  "vessels": [...],
  "schedule": {
    "V001": {
      "berth": 0,
      "start_time": 0,
      "end_time": 6,
      "arrival_time": 0,
      "processing_time": 6
    },
    "V002": {
      "berth": 1,
      "start_time": 2,
      "end_time": 10,
      "arrival_time": 2,
      "processing_time": 8
    }
  },
  "makespan": 10,
  "solving_time": 0.00234,
  "timestamp": "2026-01-06T12:34:56.789012"
}
```

**Error Response** (400 Bad Request):
```json
{
  "detail": "Error message describing what went wrong"
}
```

---

### POST /upload-json
Upload a JSON file and solve immediately.

**Request**:
- Content-Type: `multipart/form-data`
- Field: `file` (JSON file)

**Sample curl**:
```bash
curl -X POST "http://localhost:8000/upload-json" \
  -H "accept: application/json" \
  -F "file=@data/test_instance.json"
```

**Response**: Same as `/solve` endpoint

---

## Solutions Management

### GET /solutions
Retrieve list of recent solutions.

**Query Parameters**:
- `limit` (optional, default: 10): Maximum number of solutions to return

**Request**:
```
GET /solutions?limit=20
```

**Response** (200 OK):
```json
{
  "solutions": [
    {
      "problem_id": "uuid-1",
      "timestamp": "2026-01-06T12:34:56.789012",
      "makespan": 32,
      "solving_time": "0.00234",
      "num_vessels": 10
    },
    {
      "problem_id": "uuid-2",
      "timestamp": "2026-01-06T11:20:45.123456",
      "makespan": 45,
      "solving_time": "0.00198",
      "num_vessels": 15
    }
  ]
}
```

---

### GET /solution/{problem_id}
Retrieve full details of a specific solution.

**Path Parameters**:
- `problem_id` (required): UUID of the problem

**Request**:
```
GET /solution/550e8400-e29b-41d4-a716-446655440000
```

**Response** (200 OK):
```json
{
  "problem_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-01-06T12:34:56.789012",
  "makespan": 32,
  "solving_time": "0.00234",
  "num_vessels": 10,
  "schedule": {
    "V001": {
      "berth": 0,
      "start_time": 0,
      "end_time": 6,
      "arrival_time": 0,
      "processing_time": 6
    }
  },
  "vessels": [
    {
      "vessel_id": "V001",
      "arrival_time": 0,
      "processing_time": 6
    }
  ]
}
```

**Error Response** (404 Not Found):
```json
{
  "detail": "Solution not found"
}
```

---

### DELETE /solution/{problem_id}
Delete a saved solution.

**Path Parameters**:
- `problem_id` (required): UUID of the problem

**Request**:
```
DELETE /solution/550e8400-e29b-41d4-a716-446655440000
```

**Response** (200 OK):
```json
{
  "message": "Solution deleted successfully"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "detail": "Error message describing what went wrong"
}
```

---

## Data Models

### Vessel
```typescript
{
  vessel_id: string      // Unique identifier (e.g., "V001")
  arrival_time: number   // Contractual arrival time in hours (0-72)
  processing_time: number // Required processing time in hours (1+)
}
```

### Schedule Entry
```typescript
{
  berth: number          // Assigned berth number (0, 1, ...)
  start_time: number     // Start time in hours (0-72)
  end_time: number       // End time in hours (start_time + processing_time)
  arrival_time: number   // Contractual arrival time (reference)
  processing_time: number // Required processing time (reference)
}
```

### Solution
```typescript
{
  problem_id: string              // Unique problem identifier (UUID)
  vessels: Vessel[]               // List of vessels
  schedule: Record<string, Schedule> // Mapping of vessel_id -> schedule
  makespan: number                // Latest departure time (objective value)
  solving_time: number            // Time to solve in seconds
  timestamp: string               // ISO 8601 timestamp of solution
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid input data |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Example Workflow

### 1. Upload and Solve
```bash
curl -X POST "http://localhost:8000/upload-json" \
  -F "file=@data/test_instance.json"
```

Response includes `problem_id`, `schedule`, `makespan`

### 2. Save the problem_id

### 3. Retrieve Solution Later
```bash
curl "http://localhost:8000/solution/{problem_id}"
```

### 4. List All Solutions
```bash
curl "http://localhost:8000/solutions?limit=10"
```

### 5. Delete Solution
```bash
curl -X DELETE "http://localhost:8000/solution/{problem_id}"
```

---

## Rate Limiting

Currently no rate limiting. In production, implement:
- API key authentication
- Rate limiting by IP/user
- Request throttling

---

## CORS Configuration

CORS is enabled for all origins in development:
```python
allow_origins=["*"]
```

For production, restrict to:
```python
allow_origins=["https://your-frontend-domain.com"]
```

---

## Testing with cURL

**Solve endpoint**:
```bash
curl -X POST "http://localhost:8000/solve" \
  -H "Content-Type: application/json" \
  -d '{
    "vessels": [
      {"vessel_id": "V1", "arrival_time": 0, "processing_time": 5},
      {"vessel_id": "V2", "arrival_time": 2, "processing_time": 8}
    ]
  }'
```

**Health check**:
```bash
curl "http://localhost:8000/health"
```

**List solutions**:
```bash
curl "http://localhost:8000/solutions?limit=5"
```

---

## Interactive API Documentation

When backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These pages provide interactive API testing.

---

**Version**: 1.0.0
**Last Updated**: January 2026
