# PowerShell script to start both backend and frontend for Strataero

# Start backend (FastAPI)
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    'cd backend; . .venv\Scripts\Activate.ps1; python -m uvicorn main:app --reload --port 8000'
) -WindowStyle Normal

Start-Sleep -Seconds 3 # Give backend a head start

# Start frontend (Next.js)
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    'cd frontend; npm run dev'
) -WindowStyle Normal

Write-Host "Both backend and frontend are starting in new windows."
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:3000 (or next available port)"
