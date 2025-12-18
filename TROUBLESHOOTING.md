# Troubleshooting Guide

## Local Development Troubleshooting

### Error: Port already in use

**Problem:** Port 3000 or 8000 is already occupied.

**Solution:**
- **Option 1:** Stop the process using the port
  ```powershell
  # Find process using port 8000
  netstat -ano | findstr :8000
  # Kill the process (replace PID with actual process ID)
  taskkill /PID <PID> /F
  ```

- **Option 2:** Change the port in the frontend or backend run command

### Error: Build fails for frontend/backend

**Problem:** Missing dependencies or build context issues.

**Solution:**
1. Ensure all files are in the correct directories
2. Check that `backend/requirements.txt` and `frontend/package.json` exist
3. For backend, create and activate a venv and install requirements:
   ```powershell
   cd backend
   python -m venv .venv
   . .venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```
4. For frontend:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

### Error: Cannot find RH_infos.csv

**Problem:** The CSV file is not in the project root.

**Solution:**
1. Ensure `RH_infos.csv` is present in the project root
2. Check the file exists: `dir RH_infos.csv`

## Frontend Issues

### Error: Module not found

**Problem:** Node modules not installed.

**Solution:**
```powershell
cd frontend
npm install
```

### Error: API connection failed

**Problem:** Backend not running or CORS issues.

**Solution:**
1. Verify backend is running: `http://localhost:8000/health`
2. Check `NEXT_PUBLIC_API_URL` in frontend environment
3. Verify CORS settings in `backend/main.py`

## Backend Issues

### Error: Import errors

**Problem:** Dependencies not installed.

**Solution:**
```powershell
cd backend
pip install -r requirements.txt
```

### Error: JWT token invalid

**Problem:** Token expired or incorrect secret key.

**Solution:**
1. Clear browser localStorage
2. Log in again
3. Check token expiration in `backend/auth.py`

### Error: Chatbot returns empty responses

**Problem:** `RH_infos.csv` not loaded correctly.

**Solution:**
1. Verify CSV file exists and is accessible
2. Check CSV has columns: `domaine`, `question`, `reponse`
3. Check backend logs: `docker-compose logs backend`

## General Issues

### Services start but can't access

**Problem:** Firewall or network configuration.

**Solution:**
1. Check Windows Firewall settings
2. Verify ports 3000 and 8000 are not blocked
3. Try accessing `http://127.0.0.1:3000` instead of `localhost`

### Performance issues

**Problem:** Docker using too many resources.

**Solution:**
1. Adjust Docker Desktop resources (Settings > Resources)
2. Increase memory allocation (recommended: 4GB+)
3. Limit CPU usage if needed

## Quick Health Checks

```powershell
# Check Docker is running
docker ps

# Check backend health
curl http://localhost:8000/health

# Check frontend (should return HTML)
curl http://localhost:3000

# View logs
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart

# Stop all services
docker-compose down
```

