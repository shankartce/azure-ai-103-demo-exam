# Deployment Instructions

## Current Issues Fixed:
1. ✅ Added name field to signup
2. ✅ Dashboard greets user by name
3. ⚠️ Duplicate exams - **Requires backend deployment**
4. ⚠️ Login redirect - **Requires backend deployment**

## Deploy Backend (Render) - REQUIRED

The backend MUST be deployed for these features to work:
- Auto-login after signup
- Name field in user profile
- New diverse exam content (fixes duplicates)

### Steps:

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Find your service: `azure-ai-practice-exam`

2. **Deploy Latest Code**
   - Click "Manual Deploy"
   - Select branch: `002-practice-assessment`
   - Click "Deploy"

3. **Run Database Migration**
   After deployment, you need to add the `name` column to existing users:
   
   **Option A: Via Render Shell**
   - Go to your service → "Shell" tab
   - Run:
   ```bash
   alembic upgrade head
   ```

   **Option B: Via Database Client**
   - Connect to your PostgreSQL database
   - Run:
   ```sql
   ALTER TABLE users ADD COLUMN name VARCHAR(255) NOT NULL DEFAULT '';
   ```

4. **Clear Old Exams (Important!)**
   To get the new diverse exams instead of duplicates:
   
   - Connect to your PostgreSQL database
   - Run:
   ```sql
   DELETE FROM attempt_responses;
   DELETE FROM attempts;
   DELETE FROM options;
   DELETE FROM questions;
   DELETE FROM exams;
   ```
   - Restart the Render service to trigger auto-seeding

## Deploy Frontend (Vercel)

```bash
cd apps/web
vercel --prod
```

This will update your existing production URL:
- https://azure-ai-103-demo-assessment.vercel.app

## Verify Deployment

After both deployments:

1. **Test Signup**
   - Go to `/signup`
   - Fill in name, email, password
   - Should auto-redirect to dashboard
   - Dashboard should greet you by name

2. **Test Login**
   - Go to `/login`
   - Enter credentials
   - Should redirect to dashboard

3. **Check Exams**
   - Dashboard should show 4 different exams:
     - Azure AI Fundamentals (📚)
     - Azure OpenAI & Generative AI (🤖)
     - Computer Vision & Document Intelligence (👁️)
     - Full AI-103 Practice Exam (🎯)

## Troubleshooting

### "Signup doesn't redirect to dashboard"
- Backend not deployed yet
- Clear browser cookies and try again
- Check browser console for errors

### "Still seeing duplicate exams"
- Old exams not cleared from database
- Run the DELETE queries above
- Restart Render service

### "Name field not showing"
- Frontend not deployed yet
- Hard refresh browser (Ctrl+Shift+R)

### "Login doesn't work"
- Check CORS settings in Render
- Verify `CORS_ORIGINS` includes your Vercel URL
- Clear browser cookies

## Environment Variables

Make sure these are set in Render:
```
DATABASE_URL=<your-postgres-url>
JWT_SECRET=<your-secret>
CORS_ORIGINS=https://azure-ai-103-demo-assessment.vercel.app
AUTO_CREATE_TABLES=true
AUTO_SEED_DEMO=true
```

Make sure these are set in Vercel:
```
NEXT_PUBLIC_API_BASE_URL=https://azure-ai-practice-exam.onrender.com
```

## What's New

### Backend Changes:
- Added `name` field to User model
- Updated signup endpoint to accept name
- Returns name in user response
- New database migration (0003_add_user_name.py)
- Fixed exam seeding to create 4 diverse exams

### Frontend Changes:
- Signup form now has name field
- Dashboard greets user by name
- Shows user's name or email username
- Better form validation (min password length)

---

**Branch**: 002-practice-assessment
**Status**: Ready for deployment
**Priority**: Deploy backend first, then frontend
