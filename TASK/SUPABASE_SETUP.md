# Supabase Database Setup Guide

This guide will walk you through setting up your Supabase database for the Global Web Work application.

## Prerequisites

- Supabase project already created (you have URL: https://hpjyveazvrhrtscmszih.supabase.co)
- Python 3.8+
- Backend dependencies installed

## Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Step 2: Configure Environment Variables

A `.env` file has been created in the backend folder with your Supabase credentials.

**Verify that `.env` contains:**
```
SUPABASE_URL=https://hpjyveazvrhrtscmszih.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwanl2ZWF6dnJocnRzY21zemloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzE1MzQsImV4cCI6MjA4MDI0NzUzNH0.7TNHqREAOr6AIHPBx1yeq0SkLGkd-9jW6iMig-AIUOs
JWT_SECRET_KEY=your-secret-key-change-in-production
```

## Step 3: Create Database Tables

There are two ways to create the required tables:

### Option A: Using the Setup Script (Recommended)

Run the Python setup script:

```bash
python setup_db.py
```

This will:
1. Test the connection to your Supabase instance
2. Try to create tables programmatically
3. If tables don't exist, it will print the SQL schema

### Option B: Manual SQL Setup via Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy and paste the SQL schema from `setup_db.py` output or use this:

```sql
-- Create users table
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

-- Create tasks table
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

-- Create teams table
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

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255),
  action TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_unique_id ON users(unique_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
```

6. Click **Run** to execute the SQL

## Step 4: Verify Connection

Test the connection with:

```bash
python setup_db.py
```

You should see:
```
✓ Connection successful!
✓ Tables already exist or are accessible.
Database is ready!
```

Or via the health check endpoint (once the backend is running):

```bash
curl http://localhost:5000/api/supabase/health
```

## Step 5: Start the Backend

```bash
python app.py
```

The backend should start on `http://localhost:5000`

## Testing the Integration

### Test User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "uniqueId": "1234",
    "name": "Test User",
    "email": "test@example.com",
    "password": "password1",
    "role": "employee",
    "department": "IT"
  }'
```

### Test User Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "uniqueId": "1234",
    "password": "password1"
  }'
```

## Troubleshooting

### "Connection refused" error

- Make sure Supabase URL is correct: `https://hpjyveazvrhrtscmszih.supabase.co`
- Ensure API key is correct (should start with `eyJhbGc...`)
- Check that the Supabase project is active in the dashboard

### "Table does not exist" error

- Run the SQL schema from Step 3 in your Supabase SQL Editor
- Verify table names match exactly (case-sensitive)

### "Permission denied" error

- Make sure you're using the correct API key (anon key or service role key)
- Check table RLS (Row Level Security) policies in Supabase dashboard
- Temporarily disable RLS for testing: `ALTER TABLE <table> DISABLE ROW LEVEL SECURITY;`

## File Structure

```
backend/
├── .env                          # Your Supabase credentials (DON'T COMMIT THIS)
├── .env.example                  # Template for .env
├── app.py                        # Flask backend with Supabase integration
├── supabase_client.py            # Supabase helper functions
├── setup_db.py                   # Database setup and migration script
└── requirements.txt              # Python dependencies
```

## Next Steps

1. ✅ Install dependencies: `pip install -r requirements.txt`
2. ✅ Set up `.env` file with credentials
3. ✅ Create database tables (Step 3)
4. ✅ Test connection (Step 4)
5. ✅ Start backend: `python app.py`
6. Test endpoints with curl or Postman
7. Start frontend: `cd ../frontend && npm start`

## Security Notes

- **Never commit `.env` file to git** — it contains sensitive credentials
- `.env.example` shows what variables are needed but without actual values
- In production, use environment variables from your deployment platform
- Consider using Row Level Security (RLS) policies in Supabase for fine-grained access control
- Rotate your API keys periodically

## Support

For issues:
1. Check Supabase status at https://status.supabase.com
2. Review Supabase logs in the dashboard under Settings → Logs
3. Verify API key has correct permissions (check auth_token scope)
