#!/usr/bin/env python3
"""
Setup script to initialize Supabase tables for the Global Web Work application.
Run this once to create the schema.

Usage:
    SUPABASE_URL="..." SUPABASE_KEY="..." python setup_db.py
"""

import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import the supabase client helper
from supabase_client import get_supabase_client

def create_tables():
    """Create all required tables in Supabase."""
    client = get_supabase_client()
    if client is None:
        print("ERROR: Supabase credentials not set. Set SUPABASE_URL and SUPABASE_KEY.")
        sys.exit(1)

    print("Connecting to Supabase...")
    print(f"URL: {os.environ.get('SUPABASE_URL')}")

    # Test connection
    try:
        result = client.table('users').select('*').limit(1).execute()
        print("✓ Connection successful!")
        print("✓ Tables already exist or are accessible.")
        print("Database is ready!")
        return
    except Exception as e:
        print(f"✗ Connection failed: {e}")
        print("\n" + "="*80)
        print("IMPORTANT: Tables do not exist yet!")
        print("="*80)
        print("\nTo create the tables, copy and paste the following SQL into your Supabase SQL editor:")
        print("1. Go to https://app.supabase.com")
        print("2. Select your project")
        print("3. Go to SQL Editor → New Query")
        print("4. Copy and paste the SQL below:")
        print("5. Click Run")
        print("\n" + "="*80 + "\n")
        print_sql_schema()
        print("\n" + "="*80)
        print("After creating the tables, run this script again to verify.")
        print("="*80)


def print_sql_schema():
    """Print the SQL schema to create all tables."""
    sql = """
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_unique_id ON users(unique_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id); 

-- Disable RLS for development (you can enable and create policies later)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
"""
    print(sql)
if __name__ == '__main__':
    print("Global Web Work - Database Setup")
    print("=" * 50)
    create_tables()
