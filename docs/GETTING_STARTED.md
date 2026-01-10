# Getting Started - Command Reference

## Quick Start (1 minute)

### Option A: Docker Compose (Recommended - No Prerequisites Except Docker)

```bash
# Navigate to project
cd c:\Users\roger\Documents\webapp

# Start all services
docker-compose up

# Open browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

**That's it!** Services will be ready in ~30 seconds.

### Option B: Manual Setup (Requires Python 3.11+ and Node.js 18+)

```bash
# Terminal 1: Start Backend
cd c:\Users\roger\Documents\webapp\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
# Backend runs on http://localhost:8000

# Terminal 2: Start Frontend
cd c:\Users\roger\Documents\webapp\frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

---

## Detailed Docker Compose Guide

### Prerequisites
- Docker Desktop (download from https://www.docker.com/products/docker-desktop)
- ~2GB free disk space

### Step-by-Step

```powershell
# 1. Open PowerShell in the project directory
cd c:\Users\roger\Documents\webapp

# 2. Start Docker services
docker-compose up

# Output should show:
# Creating berth-backend ...
# Creating berth-frontend ...
# Creating berth-dynamodb ...
# 
# backend_1 | INFO:     Uvicorn running on http://0.0.0.0:8000
# frontend_1 | webpack compiled...
```

### First Run Only
- First run may take 2-3 minutes to build images
- Subsequent starts are much faster (~30 seconds)

### Stopping Services

```powershell
# Stop (containers still exist)
docker-compose stop

# Remove (clean up everything)
docker-compose down

# Remove with volumes (delete database)
docker-compose down -v
```

---

## Testing the Application

### 1. Test with Sample Data (Recommended)

```powershell
# With docker-compose still running:

# Open http://localhost:3000 in browser
# Click "Solver" in sidebar
# Click "Upload Problem Instance"
# Select: data/test_instance.json
# Result: Should solve in <100ms with 10 vessels
```

### 2. Manual Testing

```powershell
# In browser at http://localhost:3000:
# 1. Go to Solver tab
# 2. Enter vessel data:
#    - Vessel ID: V001
#    - Arrival Time: 0
#    - Processing Time: 5
# 3. Click "+ Add Vessel"
# 4. Add more vessels
# 5. Click "Solve Problem"
# 6. View results in modal
```

### 3. API Testing with cURL

```powershell
# Test health endpoint
curl http://localhost:8000/health

# Test solve endpoint
curl -X POST http://localhost:8000/solve `
  -H "Content-Type: application/json" `
  -d @"
{
  "vessels": [
    {"vessel_id": "V1", "arrival_time": 0, "processing_time": 5},
    {"vessel_id": "V2", "arrival_time": 2, "processing_time": 8}
  ]
}
"@

# Upload and solve JSON file
curl -F "file=@data/test_instance.json" `
  http://localhost:8000/upload-json

# List solutions
curl http://localhost:8000/solutions
```

### 4. Interactive API Docs

```
Visit: http://localhost:8000/docs
- Swagger UI with all endpoints
- Try each endpoint interactively
- See request/response examples
```

---

## Troubleshooting

### Issue: "docker-compose: command not found"
**Solution**: Install Docker Desktop or use `docker compose` (newer syntax)
```powershell
docker compose up  # Instead of docker-compose up
```

### Issue: Port 3000 or 8000 already in use
**Solution**: Edit docker-compose.yml and change ports:
```yaml
# Change this:
ports:
  - "3000:3000"

# To this:
ports:
  - "3001:3000"
```

### Issue: Frontend shows "Cannot connect to backend"
**Causes**:
- Backend not running (check terminal output)
- Port 8000 not accessible
- CORS blocked (check browser console)

**Solution**:
```powershell
# Check backend health
curl http://localhost:8000/health

# Check logs
docker-compose logs backend

# Restart services
docker-compose down
docker-compose up
```

### Issue: "Cannot find module react"
**Solution**: Frontend dependencies not installed
```powershell
cd frontend
npm install
npm start
```

### Issue: Database errors
**Solution**: DynamoDB not initialized
```powershell
# Restart everything
docker-compose down -v
docker-compose up
```

---

## Project Structure Quick Reference

```
webapp/
├── docker-compose.yml       # ← Run: docker-compose up
├── data/test_instance.json  # ← Test data to upload
├── backend/                 # ← FastAPI application
│   ├── main.py
│   ├── solver.py
│   └── requirements.txt
├── frontend/                # ← React application
│   ├── src/
│   └── package.json
└── Documentation (*.md)     # ← Read for details
```

---

## Common Tasks

### Run Backend Only
```powershell
docker-compose up backend
# Frontend won't work, but API is available at :8000
```

### Run Frontend Only
```powershell
docker-compose up frontend
# Connects to backend at localhost:8000
```

### View Logs
```powershell
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs dynamodb

# Follow logs (live)
docker-compose logs -f backend
```

### Reset Everything
```powershell
# Remove all containers and data
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Start fresh
docker-compose up
```

### Access Container Shell
```powershell
# Backend Python shell
docker-compose exec backend bash

# Frontend Node shell
docker-compose exec frontend sh
```

---

## Browser URLs

| What | URL |
|------|-----|
| **Application** | http://localhost:3000 |
| **Backend API** | http://localhost:8000 |
| **API Swagger UI** | http://localhost:8000/docs |
| **API ReDoc** | http://localhost:8000/redoc |
| **Health Check** | http://localhost:8000/health |

---

## Keyboard Shortcuts

In the application:
- **Tab** - Navigate between form fields
- **Enter** - Submit forms
- **Escape** - Close modals
- **Click outside modal** - Close modal

---

## Accessing Different Views

### Frontend Navigation
- **Dashboard** - System overview and metrics (default)
- **Solver** - Upload/enter problems and solve
- **History** - Browse saved solutions

Each view accessible from sidebar on left.

---

## File Upload Format

**Expected JSON structure**:
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
  ]
}
```

**Constraints**:
- vessel_id: Any string
- arrival_time: 0-72 (hours)
- processing_time: 1+ (hours)

---

## Performance Tips

- Clear browser cache if UI seems slow
- Use modern browser (Chrome, Edge, Firefox)
- Disable browser extensions if having issues
- Close unused tabs to free memory

---

## Next Steps

1. ✅ **Now**: Run `docker-compose up`
2. ✅ **Test**: Upload sample data from test_instance.json
3. ✅ **Explore**: Try Solver and History tabs
4. ✅ **Review**: Check documentation files
5. ➡️ **Deploy**: Follow README.md for AWS deployment

---

## Documentation Map

| Want to... | Read... |
|-----------|---------|
| Get running fast | **This file** ← You are here |
| See features | README.md |
| Understand architecture | ARCHITECTURE.md |
| Use API | API_REFERENCE.md |
| Use frontend | FRONTEND_USER_GUIDE.md |
| See all files | FILE_INDEX.md |
| See what's done | PROJECT_SUMMARY.md |
| Full project info | COMPLETION_SUMMARY.md |

---

## Support

If you encounter issues:

1. **Check logs**: `docker-compose logs`
2. **Read documentation**: Start with README.md
3. **Check console**: Browser F12 → Console tab
4. **Restart services**: `docker-compose down && docker-compose up`
5. **Clean rebuild**: `docker-compose down -v && docker-compose build --no-cache && docker-compose up`

---

## Quick Checklist

- [ ] Docker Desktop installed and running
- [ ] Terminal open in `c:\Users\roger\Documents\webapp`
- [ ] Ran `docker-compose up`
- [ ] Opened http://localhost:3000
- [ ] Uploaded test_instance.json or entered data
- [ ] Clicked Solve and got results
- [ ] Checked History tab
- [ ] Explored Dashboard tab

If all checked ✅, you're ready to go!

---

**Last Updated**: January 2026
**Version**: 1.0.0
