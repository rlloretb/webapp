# Project File Index

Complete guide to all files in the Berth Scheduling Webapp project.

## Root Directory

### Configuration & Setup
- **`docker-compose.yml`** (88 lines)
  - Multi-container orchestration
  - Defines DynamoDB, Backend, Frontend services
  - Volume mounting and networking
  - Environment variable injection

- **`init-aws.sh`** (11 lines)
  - DynamoDB initialization script
  - Creates DynamoDB table automatically
  - Run on container startup

- **`.python-version`**
  - Python version specification for pyenv

- **`.gitignore`**
  - Git ignore patterns for common files
  - Python, Node, IDE, build artifacts

### Documentation
- **`README.md`** (Main project documentation)
  - Features overview
  - Problem definition
  - Technology stack
  - Project structure
  - Getting started guide
  - API endpoints summary
  - Deployment instructions

- **`QUICKSTART.md`** (Quick start guide)
  - Fastest way to get running
  - Docker Compose instructions
  - Accessing the application
  - Testing with sample data
  - Troubleshooting

- **`PROJECT_SUMMARY.md`** (Comprehensive summary)
  - Complete deliverables checklist
  - Detailed feature list
  - Architecture overview
  - Technology breakdown
  - Next steps for enhancement

- **`API_REFERENCE.md`** (Complete API documentation)
  - Endpoint specifications
  - Request/response examples
  - Error codes
  - Data models
  - cURL examples
  - Interactive documentation info

- **`FRONTEND_USER_GUIDE.md`** (User documentation)
  - UI component guide
  - Page-by-page walkthrough
  - Design features
  - Interaction workflows
  - Tips and best practices
  - Accessibility info

- **`.env.local`** (Environment configuration guide)
  - AWS credentials setup
  - Backend configuration
  - Frontend configuration
  - Local dev notes

### Setup Scripts
- **`setup-backend.sh`** (Bash script)
  - Automated backend environment setup
  - Creates virtual environment
  - Installs dependencies
  - Creates .env file

- **`setup-backend.bat`** (Windows batch script)
  - Windows equivalent of setup-backend.sh
  - Creates venv and installs packages

- **`setup-frontend.sh`** (Bash script)
  - Automated frontend setup
  - Installs npm dependencies

- **`setup-frontend.bat`** (Windows batch script)
  - Windows equivalent of setup-frontend.sh

---

## Backend Directory (`/backend`)

### Application Code
- **`main.py`** (420 lines)
  - FastAPI application entry point
  - Route definitions:
    - GET `/health` - Health check
    - POST `/solve` - Direct solving
    - POST `/upload-json` - File upload
    - GET `/solutions` - List solutions
    - GET `/solution/{id}` - Get details
    - DELETE `/solution/{id}` - Delete
  - CORS configuration
  - Request/response models
  - Error handling

- **`solver.py`** (185 lines)
  - Core optimization algorithm
  - Classes:
    - `VesselData` - Vessel information
    - `BerthSchedulingProblem` - Problem instance
  - Functions:
    - `solve_berth_scheduling()` - Greedy heuristic
    - `solve_berth_scheduling_mip()` - MIP solver (optional)
  - Algorithm description and comments

- **`database.py`** (228 lines)
  - DynamoDB integration
  - `DynamoDBManager` class:
    - `create_table()` - Table initialization
    - `save_solution()` - Save results
    - `get_solution()` - Retrieve solution
    - `list_solutions()` - Browse solutions
    - `delete_solution()` - Remove solution
  - Local/AWS endpoint support

### Configuration
- **`requirements.txt`**
  - Python package dependencies:
    - fastapi==0.104.1
    - uvicorn==0.24.0
    - pydantic==2.5.0
    - boto3==1.29.7
    - python-multipart==0.0.6
    - pulp==2.7.0
    - pytest==7.4.3
    - python-dotenv==1.0.0

- **`.env.example`**
  - Template for environment variables
  - AWS configuration
  - LocalStack endpoint
  - Debug settings

### Containerization
- **`Dockerfile`**
  - Python 3.11-slim base image
  - Dependency installation
  - Application copy
  - Port 8000 exposure
  - Uvicorn startup command

---

## Frontend Directory (`/frontend`)

### Configuration
- **`package.json`**
  - Project metadata
  - React dependencies
  - npm scripts (start, build, test)
  - Proxy configuration for API
  - Browser compatibility list

### Containerization
- **`Dockerfile`**
  - Node 18-alpine base image
  - Dependency installation
  - Application copy
  - Port 3000 exposure
  - React development server startup

### HTML Entry Point
- **`public/index.html`**
  - HTML5 boilerplate
  - Meta tags
  - Root div for React
  - Title and description

### React Application

#### Main Application
- **`src/index.js`** (12 lines)
  - React entry point
  - Renders App component

- **`src/App.jsx`** (45 lines)
  - Main application component
  - State management for pages
  - Navigation between views
  - Solution persistence

#### Styling
- **`src/index.css`** (700+ lines)
  - Complete design system
  - CSS custom properties (variables)
  - Global styles
  - Component classes:
    - `.app-*` - Main layout
    - `.header-*` - Header styling
    - `.sidebar-*` - Navigation styling
    - `.card-*` - Card components
    - `.btn-*` - Button variants
    - `.form-*` - Form styling
    - `.table-*` - Table styling
    - `.modal-*` - Modal dialogs
    - `.badge-*` - Badge variants
    - `.alert-*` - Alert messages
  - Animations and transitions
  - Responsive breakpoints
  - Blue and grey color palette

#### Components
- **`src/components/Header.jsx`**
  - App header with title
  - Status badge
  - Sticky positioning

- **`src/components/Sidebar.jsx`**
  - Navigation menu
  - Active page highlight
  - Icon + label items
  - Dashboard, Solver, History

- **`src/components/Footer.jsx`**
  - Copyright footer
  - Auto-updating year

- **`src/components/Modal.jsx`**
  - Reusable modal dialog
  - Close functionality
  - Custom footer content
  - Backdrop click handling

#### Pages
- **`src/pages/Dashboard.jsx`** (95 lines)
  - KPI cards (3 metrics)
  - Recent solutions table
  - Getting started guide
  - Real-time data from API

- **`src/pages/Solver.jsx`** (300+ lines)
  - File upload section
  - Manual vessel entry table
  - Form validation
  - Error handling
  - Success messages
  - Solve button with loading state
  - Results modal with schedule
  - API integration

- **`src/pages/History.jsx`** (200+ lines)
  - Solutions table with all data
  - View details modal
  - Delete with confirmation
  - Date formatting
  - Badge components

---

## Data Directory (`/data`)

- **`test_instance.json`** (73 lines)
  - Sample problem with 10 vessels
  - Vessel data structure:
    - V001-V010: Unique IDs
    - Arrival times: 0-48 hours
    - Processing times: 5-9 hours
  - 3-day planning horizon
  - 2 berths available
  - Ready for testing

---

## File Statistics

| Category | Count | LOC |
|----------|-------|-----|
| Backend Python | 3 | ~830 |
| Frontend React | 8 | ~2000+ |
| Configuration | 6 | - |
| Documentation | 7 | ~1500 |
| Scripts | 4 | - |
| Docker | 3 | - |
| **Total** | **31** | **~4300+** |

---

## Quick File References

### To Modify Styling
→ `frontend/src/index.css`

### To Change API Logic
→ `backend/main.py`, `backend/solver.py`

### To Add Database Operations
→ `backend/database.py`

### To Edit UI Components
→ `frontend/src/components/*`
→ `frontend/src/pages/*`

### To Update Problem Instance
→ `data/test_instance.json`

### To Configure Services
→ `docker-compose.yml`

### To Setup Environment
→ `setup-backend.*`, `setup-frontend.*`

### To Understand System
→ `README.md` (overview)
→ `PROJECT_SUMMARY.md` (details)

### To Use API
→ `API_REFERENCE.md`

### To Use Frontend
→ `FRONTEND_USER_GUIDE.md`

---

## File Dependency Graph

```
docker-compose.yml
├── backend/Dockerfile
│   ├── backend/main.py
│   ├── backend/solver.py
│   ├── backend/database.py
│   └── backend/requirements.txt
├── frontend/Dockerfile
│   ├── frontend/package.json
│   ├── frontend/public/index.html
│   └── frontend/src/
│       ├── App.jsx
│       ├── index.js
│       ├── index.css
│       ├── components/
│       └── pages/
└── init-aws.sh

.env
├── backend/.env
└── frontend/.env (via proxy)

data/test_instance.json
→ Used by Solver page
```

---

## Document Cross-References

| Want to... | Read... |
|-----------|---------|
| Get started quickly | QUICKSTART.md |
| Understand architecture | README.md |
| See what's built | PROJECT_SUMMARY.md |
| Use the API | API_REFERENCE.md |
| Use the frontend | FRONTEND_USER_GUIDE.md |
| Understand environment | .env.local |
| See all deliverables | PROJECT_SUMMARY.md |

---

**Version**: 1.0.0
**Last Updated**: January 2026
**Total Files**: 31
**Total Lines of Code**: ~4300+
