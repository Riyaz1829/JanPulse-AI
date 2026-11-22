# JanPulse AI

### Your Voice. Your City. Your Change.

**JanPulse AI** is an AI-powered civic grievance reporting platform designed to help citizens report local infrastructure and public-service issues through image-based complaint submission.

It uses Google's Gemini Vision AI to analyze uploaded images, identify civic issues, assess severity, and recommend the appropriate department.

## Project Overview

Citizens can submit complaints about civic issues such as:

- Road damage and potholes
- Garbage accumulation
- Drainage and sewage problems
- Water-related infrastructure issues
- Other public infrastructure problems

JanPulse AI analyzes submitted images and provides AI-generated insights to support complaint assessment.

## Key Features

### 1. AI-Powered Image Analysis
- Upload civic issue images.
- Analyze images using Gemini Vision.
- Identify and classify civic issues.
- Generate AI-based descriptions.

### 2. Severity Assessment
- Assess the severity of reported issues.
- Identify potential public safety risks.
- Provide AI-generated recommendations.

### 3. Department Recommendation
- Recommend the relevant department based on the identified issue.
- Support better complaint categorization and routing.

### 4. Complaint Management
- Generate a unique complaint ID.
- Store complaint information in SQLite.
- Maintain complaint status.

### 5. Complaint Tracking
- Track submitted complaints using the complaint ID.
- View complaint details and AI analysis.
- Check the current complaint status.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, CSS |
| Backend | Python, FastAPI |
| AI Integration | Google Gemini API |
| Database | SQLite |
| ORM | SQLAlchemy |
| API Testing | Swagger UI |
| Version Control | Git, GitHub |

## System Architecture

```text
Citizen
   |
   v
React Frontend
   |
   v
FastAPI Backend
   |
   +----> Image Validation
   |
   +----> Gemini Vision AI
   |          |
   |          v
   |     Issue Analysis
   |     Severity Assessment
   |     Department Recommendation
   |
   v
SQLite Database
   |
   v
Complaint ID & Tracking
```

## Project Structure

```text
JanPulse-AI/
|
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |   |-- complaints.py
|   |   |
|   |   |-- services/
|   |   |   |-- gemini_service.py
|   |   |
|   |   |-- main.py
|   |   |-- database.py
|   |   |-- models.py
|   |
|   |-- requirements.txt
|   |-- .env
|
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- pages/
|   |   |   |-- Report.jsx
|   |   |   |-- Track.jsx
|   |   |
|   |   |-- App.jsx
|   |   |-- App.css
|   |   |-- index.css
|   |   |-- main.jsx
|   |
|   |-- package.json
|
|-- .gitignore
|-- README.md
```

## Installation and Setup

### Prerequisites

- Python 3.10+
- Node.js and npm
- Google Gemini API key
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Riyaz1829/JanPulse-AI.git

cd JanPulse-AI
```

### 2. Backend Setup

```bash
cd backend

python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend URL:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

`http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/health` | Backend health check |
| POST | `/api/complaints/submit` | Submit a civic complaint |
| GET | `/api/complaints/{complaint_id}` | Track a complaint |

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |

Never commit API keys, `.env` files, or other sensitive credentials to GitHub.

## Current Project Scope

The current MVP focuses on:

- Civic complaint submission
- Image validation
- Gemini Vision analysis
- Severity and public-risk assessment
- Department recommendations
- Complaint ID generation
- Complaint tracking

The following are potential future enhancements:

- Telugu voice-based complaint submission
- Duplicate complaint detection
- Administrative dashboard
- Human approval workflows
- Before-and-after repair verification
- Persistent cloud image storage
- Advanced complaint-processing automation

## Important Limitations

- AI-generated assessments are recommendations and should not replace official human decisions.
- Department recommendations do not represent actual government routing or integration.
- Uploaded image files are currently analyzed but their binary contents are not permanently stored.
- SQLite is currently used for development. Its data may be lost when deployed on an ephemeral hosting filesystem.

## Deployment

Planned deployment architecture:

- Frontend: Vercel
- Backend: Render
- AI: Google Gemini API

Production deployment requires configuring the frontend API URL, backend CORS origin, and Gemini API key.

## Project Information

**Project Name:** JanPulse AI  
**Tagline:** Your Voice. Your City. Your Change.  
**Domain:** Civic Tech / Digital Governance  
**AI Integration:** Google Gemini Vision

## Author

**Riyaz Shaik**

GitHub: https://github.com/Riyaz1829

---

*JanPulse AI — Empowering citizens through AI-driven civic intelligence.*