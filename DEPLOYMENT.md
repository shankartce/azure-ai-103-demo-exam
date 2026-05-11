# Deployment Guide

This is a monorepo with two applications that need to be deployed separately:
- **Frontend (Next.js)**: `apps/web`
- **Backend (FastAPI)**: `apps/api`

## Frontend Deployment (Vercel) ✅

The frontend is already deployed to Vercel. To update:

```bash
cd apps/web
vercel --prod
```

## Backend Deployment (Required)

The backend API needs to be deployed to a Python-compatible platform. Here are the recommended options:

### Option 1: Render (Recommended)

1. Go to https://render.com and create an account
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `azure-ai-103-api`
   - **Root Directory**: `apps/api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`

5. Add a PostgreSQL database:
   - Click "New +" → "PostgreSQL"
   - Copy the Internal Database URL

6. Set environment variables in your web service:
   ```
   DATABASE_URL=<your-postgres-url>
   JWT_SECRET=<generate-a-secure-random-string>
   CORS_ORIGINS=https://azure-ai-103-demo-assessment.vercel.app
   AUTO_CREATE_TABLES=true
   AUTO_SEED_DEMO=true
   ```

7. Deploy and copy your API URL (e.g., `https://azure-ai-103-api.onrender.com`)

### Option 2: Railway

1. Go to https://railway.app
2. Create a new project from your GitHub repo
3. Add a PostgreSQL database
4. Configure the API service:
   - **Root Directory**: `apps/api`
   - **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
5. Set the same environment variables as above

### Option 3: Fly.io

1. Install flyctl: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Create `apps/api/fly.toml`:
   ```toml
   app = "azure-ai-103-api"
   
   [build]
   
   [env]
   PORT = "8080"
   
   [[services]]
   http_checks = []
   internal_port = 8080
   protocol = "tcp"
   
   [[services.ports]]
   handlers = ["http"]
   port = 80
   
   [[services.ports]]
   handlers = ["tls", "http"]
   port = 443
   ```
4. Deploy: `cd apps/api && fly launch`

## Connect Frontend to Backend

After deploying the backend, update the Vercel environment variable:

### Via Vercel Dashboard:
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add: `NEXT_PUBLIC_API_BASE_URL` = `<your-api-url>`
4. Redeploy the frontend

### Via Vercel CLI:
```bash
vercel env add NEXT_PUBLIC_API_BASE_URL production
# Enter your API URL when prompted
vercel --prod
```

## Local Development

### Backend:
```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your local database URL
uvicorn src.main:app --reload
```

### Frontend:
```bash
cd apps/web
npm install
cp .env.example .env.local
# Edit .env.local: NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
npm run dev
```

## Troubleshooting

### "Login/Signup not working"
- Ensure the backend API is deployed and running
- Verify `NEXT_PUBLIC_API_BASE_URL` is set in Vercel
- Check CORS_ORIGINS in backend includes your frontend URL

### "Exams not loading"
- Same as above - the frontend needs a working backend API
- Check browser console for API errors
- Verify the database is seeded with demo data

### Database Issues
- Ensure `AUTO_CREATE_TABLES=true` is set
- Ensure `AUTO_SEED_DEMO=true` is set for demo data
- Check database connection string is correct
