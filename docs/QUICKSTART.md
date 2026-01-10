# Quick Start Guide

## Local Development with Docker Compose

### 1. Prerequisites
- Docker Desktop installed and running
- Git (optional)

### 2. Start the Application

```bash
cd c:\Users\roger\Documents\webapp
docker-compose up
```

This will:
- Build and start LocalStack (DynamoDB emulator)
- Build and start FastAPI backend
- Build and start React frontend
- Initialize DynamoDB table

### 3. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### 4. Test with Sample Data

1. Go to the **Solver** tab
2. Click "Upload Problem Instance"
3. Upload `data/test_instance.json`
4. The solver will automatically solve the problem
5. View the schedule and metrics in the results modal
6. Go to **History** tab to review saved solutions

### 5. Manual Problem Entry

1. Go to **Solver** tab
2. Manually enter vessels:
   - Vessel ID: e.g., "V001"
   - Arrival Time: 0-72 (hours)
   - Processing Time: 1+ (hours)
3. Click "Solve Problem"

### 6. View Dashboard

The **Dashboard** shows:
- Total solutions
- Total vessels scheduled
- Average makespan
- Recent solutions table

### 7. Stop the Application

```bash
docker-compose down
```

## Development Notes

### Backend Development
- Backend code is mounted in container
- Changes are auto-loaded (hot reload via Uvicorn)
- Debug logs available: `docker-compose logs backend`

### Frontend Development
- Frontend code is mounted in container
- React will auto-reload on changes
- Debug logs available: `docker-compose logs frontend`

### Database
- DynamoDB (via LocalStack) emulates AWS DynamoDB
- Data persists in container (lost on `docker-compose down`)
- To persist data, add volume to dynamodb service

## Troubleshooting

### Port already in use
If ports 3000, 8000, or 4566 are in use:
1. Update port mappings in `docker-compose.yml`
2. Or stop other services using those ports

### Frontend can't connect to backend
- Ensure backend service is running: `docker-compose logs backend`
- Check proxy setting in `frontend/package.json` (should be `http://backend:8000`)
- Verify CORS is enabled in `backend/main.py`

### DynamoDB table not created
- Check DynamoDB logs: `docker-compose logs dynamodb`
- Verify `init-aws.sh` has execute permissions
- Manually create table using: `docker exec berth-dynamodb awslocal dynamodb create-table --table-name berth-scheduling-solutions --attribute-definitions AttributeName=problem_id,AttributeType=S AttributeName=timestamp,AttributeType=S --key-schema AttributeName=problem_id,KeyType=HASH AttributeName=timestamp,KeyType=RANGE --billing-mode PAY_PER_REQUEST --region us-east-1`

### "Failed to solve problem" or connection errors
- Ensure `frontend/package.json` has `"proxy": "http://backend:8000"` (not localhost)
- Restart frontend if you changed proxy: `docker-compose restart frontend`
- Verify backend is accessible: `docker-compose logs backend`

## Next Steps

1. ✅ Local development with Docker Compose
2. Next: Deploy backend to AWS EC2
3. Deploy frontend to AWS S3 + CloudFront
4. Set up CI/CD pipeline
5. Add authentication and multi-user support

---

See [README.md](./README.md) for comprehensive documentation.
