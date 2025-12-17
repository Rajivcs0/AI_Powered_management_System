# Disable Row Level Security (RLS) on Supabase

The registration endpoint is being blocked by RLS policies on the `users` table. Follow these steps to disable RLS for development:

## Option 1: Supabase Dashboard (Recommended for Quick Fix)

1. Go to: https://app.supabase.com
2. Log in to your project (if not already logged in)
3. Navigate to **SQL Editor** (left sidebar)
4. Run these SQL commands:

```sql
-- Disable RLS on all tables for development
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
```

5. Click **Run** button
6. You should see "Success" message

## Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
supabase db pull  # Pull your remote schema
# Edit the migration file to disable RLS
supabase db push  # Push changes
```

## Verification

After disabling RLS, test with:

```bash
cd backend
python -c "
from supabase_client import insert_user, get_all_users
import bcrypt

password_hash = bcrypt.hashpw(b'testpass8', bcrypt.gensalt()).decode('utf-8')
user_data = {
    'unique_id': '5678',
    'name': 'Test User',
    'email': 'test@example.com',
    'password_hash': password_hash,
    'role': 'employee',
    'department': 'General'
}
result = insert_user(user_data)
print(f'Insert result: {result}')

users = get_all_users()
print(f'Total users: {len(users)}')
"
```

## Important Notes

- **For Development Only**: Disabling RLS is fine for development/testing
- **For Production**: You should enable RLS and create proper policies that allow:
  - Anonymous users to INSERT their own registration
  - Authenticated users to READ/UPDATE/DELETE their own tasks
  - Team leads to manage team data
  
See `RLS_POLICIES_PRODUCTION.md` for production security setup.
