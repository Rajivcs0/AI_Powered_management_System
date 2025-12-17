# ⚡ QUICK START - Supabase Setup in 10 Minutes

## Step-by-Step Visual Guide

### ✅ STEP 1: Create Database Tables (5 min)

1. Open: https://app.supabase.com
2. Login and select project: **hpjyveazvrhrtscmszih**
3. Click **SQL Editor** (left sidebar)
   ```
   Dashboard → SQL Editor → New Query
   ```
4. Copy **ALL** this code:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_id VARCHAR(8) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'employee',
  department VARCHAR(100) DEFAULT 'General',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to VARCHAR(255),
  created_by VARCHAR(255) NOT NULL,
  priority VARCHAR(50) DEFAULT 'Medium',
  due_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  ai_priority_score VARCHAR(50),
  predicted_completion_time FLOAT,
  urgency INT DEFAULT 5,
  complexity INT DEFAULT 5,
  department VARCHAR(100) DEFAULT 'General',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  department VARCHAR(100),
  members JSONB DEFAULT '[]',
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255),
  action TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_unique_id ON users(unique_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
```

5. Paste in the text area
6. Click **▶ RUN** button
7. Wait for ✅ **Success**
8. ✅ Tables created!

---

### ✅ STEP 2: Verify Connection (2 min)

Open **PowerShell** and run:

```powershell
cd c:\Users\Rajiv Chandrasekar\Pictures\TASK\backend
python setup_db.py
```

**Expected output:**
```
Global Web Work - Database Setup
==================================================
Connecting to Supabase...
URL: https://hpjyveazvrhrtscmszih.supabase.co
✓ Connection successful!
✓ Tables already exist or are accessible.
Database is ready!
```

If you see this ✅ → Everything is working!

---

### ✅ STEP 3: Start Backend (1 min)

**New PowerShell window:**

```powershell
cd c:\Users\Rajiv Chandrasekar\Pictures\TASK\backend
python app.py
```

**Should see:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

Leave this running.

---

### ✅ STEP 4: Test Connection (1 min)

**Another PowerShell window:**

```powershell
curl http://localhost:5000/api/supabase/health
```

**Expected:**
```json
{"ok":true,"configured":true,"message":"Connected to Supabase","data":[]}
```

✅ Backend is working!

---

### ✅ STEP 5: Start Frontend (1 min)

**Another PowerShell window:**

```powershell
cd c:\Users\Rajiv Chandrasekar\Pictures\TASK\frontend
npm install
npm start
```

Wait for browser to open at `http://localhost:3000`

---

### ✅ STEP 6: Test the App (1 min)

1. Click **Sign Up**
2. Enter:
   - Unique ID: `1234` (must be 4-8 digits)
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password1` (must be exactly 8 chars)
3. Click **Sign Up**
4. You should see dashboard!

---

## 🎉 Success!

Your app is now connected to Supabase! 

**What's happening:**
- ✅ Users registered → stored in Supabase
- ✅ Tasks created → stored in Supabase
- ✅ Data persists → database is real!

---

## 📊 Verify Data in Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your project
3. Click **Table Editor** (left sidebar)
4. Select **users**
5. You should see your test user!

---

## 🔧 Common Issues

| Problem | Fix |
|---------|-----|
| `Connection failed` | Wait 10 seconds, Supabase might be initializing |
| `Table does not exist` | Run SQL again in SQL Editor |
| `Port 5000 already in use` | Kill process: `Get-Process python \| Stop-Process` |
| `Module not found: supabase` | Run: `pip install -r requirements.txt` |
| `Frontend won't start` | Run: `npm cache clean --force` then `npm install` |

---

## 📁 Files You'll Need

All files are in:
```
c:\Users\Rajiv Chandrasekar\Pictures\TASK
```

Key files:
- `backend/.env` - ✅ Has your Supabase credentials
- `backend/app.py` - ✅ Updated for Supabase
- `frontend/src/lib/supabaseClient.js` - ✅ Ready for frontend
- `SUPABASE_SETUP.md` - Detailed troubleshooting guide
- `SUPABASE_INTEGRATION_SUMMARY.md` - Complete overview

---

## ⏱️ Timeline

```
Step 1: SQL Setup          ... 5 min  ✅
Step 2: Verify Connection  ... 2 min  ✅
Step 3: Start Backend      ... 1 min  ✅
Step 4: Test Health        ... 1 min  ✅
Step 5: Start Frontend     ... 1 min  ✅
Step 6: Test Registration  ... 1 min  ✅
─────────────────────────────────────
TOTAL:                      ~11 min ✅
```

---

## 🚀 You're Ready!

Follow the steps above and you'll have:
- ✅ Real database (Supabase PostgreSQL)
- ✅ Working backend (Flask + Supabase)
- ✅ Working frontend (React)
- ✅ Data persistence (everything saved!)

---

**Questions?** See `SUPABASE_SETUP.md` for detailed troubleshooting.

**Next?** After testing, check out:
- Analytics dashboard
- Team management features
- Task creation and filtering

Happy coding! 🎉
