from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt
import os
from datetime import datetime, timedelta
import json
import random
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Import Supabase helpers
from supabase_client import (
    get_supabase_client,
    health_check,
    insert_user,
    get_user_by_id,
    get_all_users,
    insert_task,
    get_tasks,
    get_task_by_id,
    update_task
)

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
jwt = JWTManager(app)
CORS(app)

# AI/ML Models (simplified for demo)
class TaskPriorityPredictor:
    def __init__(self):
        self.model = None
    
    def predict_priority(self, urgency, complexity, deadline_days):
        # Simple scoring algorithm
        score = (urgency * 0.4) + (complexity * 0.3) + (max(0, 10 - deadline_days) * 0.3)
        if score >= 8:
            return "High"
        elif score >= 5:
            return "Medium"
        else:
            return "Low"

class CompletionTimePredictor:
    def predict_completion_time(self, task_size, complexity, employee_efficiency=1.0):
        base_hours = task_size * complexity * 2
        return base_hours / employee_efficiency

priority_predictor = TaskPriorityPredictor()
completion_predictor = CompletionTimePredictor()

# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        unique_id = data.get('uniqueId')
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'employee')
        department = data.get('department', 'General')

        # Validate unique ID (4-8 digits only)
        if not unique_id or not unique_id.isdigit() or len(unique_id) < 4 or len(unique_id) > 8:
            return jsonify({'error': 'Unique ID must be 4-8 digits only'}), 400

        # Validate password (8 characters)
        if not password or len(password) != 8:
            return jsonify({'error': 'Password must be exactly 8 characters'}), 400

        # Check if unique ID already exists
        existing_user = get_user_by_id(unique_id)
        if existing_user:
            return jsonify({'error': 'Unique ID already exists'}), 400

        # Check if email already exists
        all_users = get_all_users()
        if any(user.get('email') == email for user in all_users):
            return jsonify({'error': 'Email already exists'}), 400

        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Create user in Supabase
        user_data = {
            'unique_id': unique_id,
            'name': name,
            'email': email,
            'password_hash': password_hash.decode('utf-8'),
            'role': role,
            'department': department,
            'created_at': datetime.now().isoformat()
        }
        
        created_user = insert_user(user_data)
        if not created_user:
            return jsonify({'error': 'Failed to create user'}), 500

        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'unique_id': unique_id,
                'name': name,
                'email': email,
                'role': role,
                'department': department
            }
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        unique_id = data.get('uniqueId')
        password = data.get('password')

        if not unique_id or not password:
            return jsonify({'error': 'Unique ID and password are required'}), 400

        user = get_user_by_id(unique_id)
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401

        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({'error': 'Invalid credentials'}), 401

        # Create access token
        access_token = create_access_token(identity=unique_id)

        return jsonify({
            'access_token': access_token,
            'user': {
                'unique_id': user['unique_id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role'],
                'department': user['department']
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/change-password', methods=['POST'])
@jwt_required()
def change_password():
    try:
        data = request.get_json()
        unique_id = get_jwt_identity()
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')

        if not current_password or not new_password:
            return jsonify({'error': 'Current password and new password are required'}), 400

        if len(new_password) != 8:
            return jsonify({'error': 'New password must be exactly 8 characters'}), 400

        user = get_user_by_id(unique_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        if not bcrypt.checkpw(current_password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({'error': 'Current password is incorrect'}), 400

        # Update password
        new_password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        update_task(user.get('id'), {'password_hash': new_password_hash.decode('utf-8')})

        return jsonify({'message': 'Password changed successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# TASK MANAGEMENT ROUTES
# ============================================================================

@app.route('/api/tasks', methods=['GET'])
@jwt_required()
def get_all_tasks():
    try:
        user_id = get_jwt_identity()
        user = get_user_by_id(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Get all tasks from Supabase
        all_tasks = get_tasks()
        
        # Filter tasks based on user role
        if user['role'] == 'admin':
            user_tasks = all_tasks
        else:
            user_tasks = [task for task in all_tasks if task.get('assigned_to') == user_id or task.get('created_by') == user_id]

        return jsonify({'tasks': user_tasks}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
@jwt_required()
def create_task():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        user = get_user_by_id(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        # AI prediction for priority
        urgency = data.get('urgency', 5)
        complexity = data.get('complexity', 5)
        due_date = datetime.fromisoformat(data.get('dueDate', datetime.now().isoformat()))
        deadline_days = (due_date - datetime.now()).days
        
        predicted_priority = priority_predictor.predict_priority(urgency, complexity, deadline_days)
        predicted_completion_time = completion_predictor.predict_completion_time(
            data.get('taskSize', 5), complexity
        )

        task_data = {
            'title': data['title'],
            'description': data['description'],
            'assigned_to': data.get('assignedTo', user_id),
            'created_by': user_id,
            'priority': predicted_priority,
            'due_date': data.get('dueDate'),
            'status': 'pending',
            'ai_priority_score': predicted_priority,
            'predicted_completion_time': predicted_completion_time,
            'urgency': urgency,
            'complexity': complexity,
            'department': data.get('department', user['department']),
            'created_at': datetime.now().isoformat()
        }

        created_task = insert_task(task_data)
        if not created_task:
            return jsonify({'error': 'Failed to create task'}), 500

        return jsonify({'task': created_task, 'message': 'Task created successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['PUT'])
@jwt_required()
def update_single_task(task_id):
    try:
        data = request.get_json()
        user_id = get_jwt_identity()

        task = get_task_by_id(task_id)
        if not task:
            return jsonify({'error': 'Task not found'}), 404

        # Update task in Supabase
        updates = {k: v for k, v in data.items() if k in ['title', 'description', 'assigned_to', 'status', 'priority']}
        updated_task = update_task(task_id, updates)

        if not updated_task:
            return jsonify({'error': 'Failed to update task'}), 500

        return jsonify({'task': updated_task, 'message': 'Task updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# ANALYTICS ROUTES
# ============================================================================

@app.route('/api/analytics/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    try:
        user_id = get_jwt_identity()
        user = get_user_by_id(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Get all tasks from Supabase
        all_tasks = get_tasks()

        # Calculate analytics
        total_tasks = len(all_tasks)
        completed_tasks = len([t for t in all_tasks if t.get('status') == 'completed'])
        pending_tasks = len([t for t in all_tasks if t.get('status') == 'pending'])
        overdue_tasks = len([t for t in all_tasks if t.get('status') != 'completed' and 
                           (datetime.fromisoformat(t.get('due_date', datetime.now().isoformat())) < datetime.now())])

        # Priority distribution
        priority_dist = {
            'high': len([t for t in all_tasks if t.get('priority') == 'High']),
            'medium': len([t for t in all_tasks if t.get('priority') == 'Medium']),
            'low': len([t for t in all_tasks if t.get('priority') == 'Low'])
        }

        # Department productivity
        dept_stats = {}
        for task in all_tasks:
            dept = task.get('department', 'General')
            if dept not in dept_stats:
                dept_stats[dept] = {'total': 0, 'completed': 0}
            dept_stats[dept]['total'] += 1
            if task.get('status') == 'completed':
                dept_stats[dept]['completed'] += 1

        return jsonify({
            'overview': {
                'total_tasks': total_tasks,
                'completed_tasks': completed_tasks,
                'pending_tasks': pending_tasks,
                'overdue_tasks': overdue_tasks
            },
            'priority_distribution': priority_dist,
            'department_stats': dept_stats
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# AI SUGGESTIONS ROUTE
# ============================================================================

@app.route('/api/ai/suggestions', methods=['GET'])
@jwt_required()
def get_ai_suggestions():
    try:
        user_id = get_jwt_identity()
        
        # Get all tasks from Supabase
        all_tasks = get_tasks()
        
        # Generate AI suggestions based on current tasks
        suggestions = []
        
        # Workload distribution suggestion
        user_tasks = [t for t in all_tasks if t.get('assigned_to') == user_id and t.get('status') != 'completed']
        if len(user_tasks) > 5:
            suggestions.append({
                'type': 'workload',
                'message': 'You have many pending tasks. Consider delegating some to team members.',
                'priority': 'high'
            })

        # Deadline warning
        upcoming_deadlines = [t for t in user_tasks if 
                            (datetime.fromisoformat(t.get('due_date', datetime.now().isoformat())) - datetime.now()).days <= 3]
        if upcoming_deadlines:
            suggestions.append({
                'type': 'deadline',
                'message': f'You have {len(upcoming_deadlines)} tasks due within 3 days.',
                'priority': 'medium'
            })

        return jsonify({'suggestions': suggestions}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# DATABASE & ADMIN ROUTES
# ============================================================================

@app.route('/api/supabase/health', methods=['GET'])
def supabase_health():
    try:
        result = health_check()
        if result and result.get('configured'):
            return jsonify(result), 200
        else:
            return jsonify({'configured': False, 'message': 'Supabase not configured'}), 200
    except Exception as e:
        return jsonify({'configured': False, 'error': str(e)}), 500

@app.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        user_id = get_jwt_identity()
        user = get_user_by_id(user_id)
        
        if not user or user.get('role') != 'admin':
            return jsonify({'error': 'Access denied. Only admins can view all users'}), 403

        all_users = get_all_users()
        # Remove password_hash from response
        safe_users = [
            {
                'id': u.get('id'),
                'unique_id': u.get('unique_id'),
                'name': u.get('name'),
                'email': u.get('email'),
                'role': u.get('role'),
                'department': u.get('department'),
                'created_at': u.get('created_at')
            }
            for u in all_users
        ]
        return jsonify(safe_users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
