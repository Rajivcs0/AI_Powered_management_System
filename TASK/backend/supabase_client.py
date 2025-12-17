import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables FIRST
load_dotenv()

# Import supabase client factory
try:
    from supabase import create_client, Client
except Exception:
    # If package is not installed, we don't want to crash import time; caller should handle missing dependency.
    create_client = None
    Client = None

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

_supabase_client = None


def get_supabase_client():
    """Return a Supabase client instance or None if configuration is missing.

    Do NOT store secrets in source code. Set SUPABASE_URL and SUPABASE_KEY
    in your environment (or use a .env file loaded by python-dotenv).
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if not SUPABASE_URL or not SUPABASE_KEY:
        return None

    if create_client is None:
        raise RuntimeError(
            "supabase package is not installed. Run `pip install supabase` and try again."
        )

    _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _supabase_client


# Helper convenience functions (small and safe):
def health_check():
    """Simple connectivity check against Supabase (returns dict) or None if not configured."""
    client = get_supabase_client()
    if client is None:
        return {'configured': False, 'message': 'Supabase credentials not set'}

    try:
        # Try to query the users table (or any public table) to verify connectivity
        resp = client.table('users').select('*').limit(1).execute()
        return {'ok': True, 'configured': True, 'message': 'Connected to Supabase', 'data': resp.data}
    except Exception as e:
        return {'ok': False, 'configured': True, 'error': str(e), 'message': 'Failed to connect to Supabase'}


def table(table_name):
    """Get a reference to a Supabase table."""
    client = get_supabase_client()
    if client is None:
        raise RuntimeError('Supabase not configured. Set SUPABASE_URL and SUPABASE_KEY environment variables.')
    return client.table(table_name)


def insert_user(user_data):
    """Insert a user into the users table."""
    try:
        resp = table('users').insert(user_data).execute()
        return resp.data[0] if resp.data else None
    except Exception as e:
        print(f'Error inserting user: {e}')
        return None


def get_user_by_id(unique_id):
    """Get a user by their unique ID."""
    try:
        resp = table('users').select('*').eq('unique_id', unique_id).execute()
        return resp.data[0] if resp.data else None
    except Exception as e:
        print(f'Error fetching user: {e}')
        return None


def get_all_users():
    """Get all users."""
    try:
        resp = table('users').select('*').execute()
        return resp.data
    except Exception as e:
        print(f'Error fetching users: {e}')
        return []


def insert_task(task_data):
    """Insert a task into the tasks table."""
    try:
        resp = table('tasks').insert(task_data).execute()
        return resp.data[0] if resp.data else None
    except Exception as e:
        print(f'Error inserting task: {e}')
        return None


def get_tasks():
    """Get all tasks."""
    try:
        resp = table('tasks').select('*').execute()
        return resp.data
    except Exception as e:
        print(f'Error fetching tasks: {e}')
        return []


def get_task_by_id(task_id):
    """Get a task by ID."""
    try:
        resp = table('tasks').select('*').eq('id', task_id).execute()
        return resp.data[0] if resp.data else None
    except Exception as e:
        print(f'Error fetching task: {e}')
        return None


def update_task(task_id, updates):
    """Update a task."""
    try:
        resp = table('tasks').update(updates).eq('id', task_id).execute()
        return resp.data[0] if resp.data else None
    except Exception as e:
        print(f'Error updating task: {e}')
        return None
