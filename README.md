# Berth Scheduling Optimization Webapp

A professional, full-stack web application for solving berth scheduling problems using optimization algorithms.

## Features

- **Problem Formulation**: Mathematical formulation of the berth scheduling problem as a Mixed Integer Programming (MIP)
- **Heuristic Solver**: Simple, efficient greedy algorithm for scheduling vessels to berths
- **JSON Data Format**: Support for JSON input files with vessel arrival times and processing times
- **Professional UI**: Modern, responsive interface with blue and grey color scheme
- **Multi-view Dashboard**: 
  - Dashboard: KPI metrics and recent solutions
  - Solver: Upload or manually enter vessel data
  - History: Review and manage past solutions
- **Database Integration**: DynamoDB for persistent storage of solutions
- **Docker Setup**: Complete Docker Compose setup for local development

## Problem Definition

**Goal**: Minimize makespan (latest vessel departure time)

**Constraints**:
- Each vessel can occupy at most one berth
- Time is discrete (hourly intervals)
- Planning period: 3 days (72 hours)
- Multiple berths available

**Input Data**:
- Vessel ID
- Contractual arrival time (hours)
- Required processing time (hours)

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Solver**: Custom heuristic algorithm
- **Database**: DynamoDB (AWS) or LocalStack for development
- **API**: RESTful endpoints

### Frontend
- **Framework**: React 18
- **Styling**: CSS with custom design system
- **State Management**: React hooks
- **Responsive Design**: Mobile-first approach

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Local Development**: LocalStack for AWS service emulation
- **Deployment Ready**: AWS EC2, ECS, or similar

## Project Structure

```
webapp/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── solver.py               # Optimization algorithm
│   ├── database.py             # DynamoDB integration
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile              # Backend container
│   └── .env.example            # Environment variables
├── frontend/
│   ├── public/
│   │   └── index.html          # HTML entry point
│   ├── src/
│   │   ├── index.js            # React entry point
│   │   ├── index.css           # Global styles
│   │   ├── App.jsx             # Main component
│   │   ├── components/         # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Modal.jsx
│   │   └── pages/              # Page components
│   │       ├── Dashboard.jsx
│   │       ├── Solver.jsx
│   │       └── History.jsx
│   ├── package.json            # Node dependencies
│   └── Dockerfile              # Frontend container
├── data/
│   └── test_instance.json      # Sample problem instance
├── docker-compose.yml          # Local development setup
├── init-aws.sh                 # LocalStack initialization
└── README.md                   # This file
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Or: Python 3.11+, Node.js 18+

### Option 1: Using Docker Compose (Recommended)

1. **Start all services**:
   ```bash
   docker-compose up
   ```

   This will:
   - Start LocalStack with DynamoDB
   - Start FastAPI backend (http://localhost:8000)
   - Start React frontend (http://localhost:3000)

2. **Access the application**:
   - Open browser: http://localhost:3000

3. **Stop services**:
   ```bash
   docker-compose down
   ```

### Option 2: Manual Local Development

**Backend**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend runs on http://localhost:8000

**Frontend**:
```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000

## API Endpoints

### Health Check
- `GET /health` - System status

### Solver
- `POST /solve` - Solve with JSON payload
  ```json
  {
    "vessels": [
      {"vessel_id": "V1", "arrival_time": 0, "processing_time": 5},
      {"vessel_id": "V2", "arrival_time": 2, "processing_time": 8}
    ]
  }
  ```

- `POST /upload-json` - Upload JSON file and solve

### Solutions
- `GET /solutions?limit=10` - List recent solutions
- `GET /solution/{problem_id}` - Get solution details
- `DELETE /solution/{problem_id}` - Delete solution

## Sample Data

See `data/test_instance.json` for a sample problem with 10 vessels:
- 3-day planning horizon
- 2 berths available
- Vessels arriving at various times
- Processing times ranging from 5-9 hours

## Optimization Algorithm

The current implementation uses a **greedy heuristic**:

1. Sort vessels by arrival time
2. For each vessel:
   - Find the berth that becomes available earliest
   - Schedule vessel at max(arrival_time, berth_available_time)
3. Return schedule and makespan

This provides fast solutions suitable for real-time decision support.

## Design System

**Color Palette**:
- Primary Blue: #2c5aa0
- Dark Blue: #1e3a5f
- Light Blue: #4a7ba7
- Greys: #1f2937 to #f3f4f6

**Typography**:
- Font Family: System fonts (Segoe UI, Roboto, etc.)
- Responsive font sizes

**Components**:
- Cards with hover effects
- Modal dialogs
- Tables with alternating rows
- Responsive grid layouts
- Accessible buttons and forms

## Future Enhancements

1. **Advanced Solvers**:
   - Mixed Integer Programming solver (PuLP/Gurobi)
   - Constraint Programming
   - Metaheuristics (Tabu Search, Genetic Algorithms)

2. **Visualization**:
   - Gantt chart for berth schedules
   - Timeline visualization
   - Interactive scheduling

3. **Analytics**:
   - Performance metrics
   - Trend analysis
   - What-if scenarios

4. **Features**:
   - Multi-user support with authentication
   - Real-time collaboration
   - Export to PDF/Excel
   - API rate limiting and monitoring

## Deployment to AWS

1. **Backend**: Deploy FastAPI on EC2 or ECS
2. **Frontend**: Deploy React on S3 + CloudFront
3. **Database**: Use managed DynamoDB (remove LocalStack)
4. **Environment Variables**: Update with real AWS credentials

## Support

For issues or questions, please refer to the code documentation or contact the development team.

---

**Created**: January 2026
**Version**: 1.0.0
