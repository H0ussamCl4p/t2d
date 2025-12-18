---
# Safran Neural Hub
_Secure Edge-AI Platform for HR Analytics & Intelligent Assistance_

[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-async-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![GDPR Compliant](https://img.shields.io/badge/GDPR-Compliant-blueviolet)](https://gdpr.eu/)
[![Edge Ready](https://img.shields.io/badge/Edge-Ready-orange)](#)

---

## 🚀 Executive Summary

**Safran Neural Hub** is a privacy-first, industrial-grade prototype delivered for the "Safran Think to Deploy" Hackathon. It solves common HR operational pain points—manual CSV processing, slow insights, and unsafe third-party AI—by providing a secure, local Edge-AI platform that performs analytics and conversational assistance without sending sensitive data to third-party cloud services.

Key value:
- Local-first processing (air-gapped ready) to eliminate data exfiltration risk
- Rapid KPI generation and weak-signal detection for HR teams
- A semantic, RAG-powered assistant (“Bob”) that runs from local embeddings

---

## 🏗 Architecture (textual)

- Frontend: Next.js 14 (App Router) — Industrial-tailored UI with Tailwind CSS
- Backend: FastAPI (async Python) — Pydantic models, JWT authentication
- Intelligence: Local RAG using SentenceTransformers + Scikit-Learn for analytics
- Data: SQLite (local, recommended encrypted at rest for production)

This architecture is intentionally edge-first to guarantee data sovereignty and reduce operational surface area in industrial deployments.

---

## ✨ Key Features

- 📊 HR Analytics
	- CSV ingestion pipeline -> automated KPI generation (satisfaction, volume, trends)
	- Sentiment analysis and time-series insights
	- Weak-signal detection (anomaly/early-warning flags)

- 🤖 "Bob" — Local RAG Assistant
	- Embeddings generated with SentenceTransformers stored locally
	- Retrieval-Augmented Generation for context-rich responses
	- No outbound API calls: zero data exfiltration risk

- 🔒 Security Core
	- JWT authentication and role-ready design
	- Input sanitization to mitigate XSS / SQLi vectors
	- Air-gapped ready; GDPR-aligned data handling and minimization

---

## ⚡ Quick Start — Happy Path (Local Development)

Below are minimal steps to run the project locally in two terminals. These instructions assume Python 3.11+ and Node.js installed.

### Backend (Terminal A)

```bash
cd backend
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# Windows CMD: .venv\\Scripts\\activate.bat
source .venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Frontend (Terminal B)

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:3000

### Default Credentials (demo)
- Email: `admin@safran.com`
- Password: `admin123`

---

## 🧰 Tech Stack (selected libraries)

- Backend: FastAPI, Pydantic, SQLAlchemy, aiosqlite / asyncpg adapter-ready, PyJWT
- Intelligence: SentenceTransformers, scikit-learn, faiss (optional local index)
- Frontend: Next.js 14 (App Router), React 18, Tailwind CSS, Recharts, Lucide Icons
- DevOps & Runtime: Uvicorn, npm, Dockerfile (docker-ready but optional for air-gapped deployments)

---

## 🛡 Why this architecture? (Industrial / Cyber Rationale)

- Security & Sovereignty: Running embeddings and RAG locally removes external data dependencies and potential cloud-based exfiltration pathways.
- Predictable Latency: Local SQLite and in-process models deliver consistent, low-latency responses important for operational workflows.
- Minimal Attack Surface: Fewer moving parts and no cloud-managed storage simplify audit, compliance, and hardening.
- Practical Prototype Trade-offs: SQLite + local models accelerates development and reproducibility for a hackathon while remaining production-extensible.

---

## 📂 Project Structure (key folders)

```
.
├── backend/
│   ├── auth.py
│   ├── database.py
│   ├── init_db.py
│   ├── main.py                # FastAPI app + endpoints
│   ├── models.py
│   ├── services/
│   │   ├── analysis_service.py
│   │   └── chatbot_service.py
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── (dashboard)/
│   │   ├── login/
│   │   └── layout.tsx
│   ├── components/
│   ├── contexts/
│   └── package.json
├── data/
│   ├── RH_infos.csv
│   └── evaluation_formation.csv
└── README.md
---

## 🔭 Roadmap

- Role-Based Access Control (RBAC) & fine-grained permissions
- Mobile PWA for offline-first access
- Encrypted SQLite (at-rest) and key management
- Containerized industrial deployment (Docker Compose / Kubernetes)

---


_Prepared for the Safran Think to Deploy Hackathon — engineering-focused, privacy-first, and industrial-ready._

