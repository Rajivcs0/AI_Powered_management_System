# Global Web Work - AI-Powered Task Management System

A comprehensive task management web application built with React frontend and Flask backend, featuring AI-powered task prioritization and analytics.

## 🌟 Features

### Authentication System
- **Login/Signup**: Secure authentication with unique ID (4-8 digits) and password (8 characters)
- **Password Management**: Change password functionality with validation
- **Role-based Access**: Admin and Employee roles with different permissions

### Task Management
- **AI-Powered Prioritization**: Automatic task priority assignment based on urgency, complexity, and deadlines
- **Task CRUD Operations**: Create, read, update, and delete tasks
- **Status Tracking**: Pending, completed, and overdue task states
- **Search & Filtering**: Advanced search and filter capabilities

### Analytics Dashboard
- **Real-time Metrics**: Task completion rates, productivity trends
- **Visual Charts**: Interactive charts using Recharts library
- **Department Performance**: Team and department analytics
- **AI Insights**: Smart suggestions and recommendations

### User Interface
- **Modern Design**: Clean, responsive UI with Tailwind CSS
- **Dark/Light Theme**: Theme customization with smooth transitions
- **Mobile Responsive**: Optimized for all device sizes
- **Interactive Components**: Smooth animations and transitions

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and context
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library
- **Lucide React**: Beautiful icon library
- **Axios**: HTTP client for API calls
- **React Hot Toast**: Notification system

### Backend
- **Flask**: Python web framework
- **Flask-CORS**: Cross-origin resource sharing
- **Flask-JWT-Extended**: JWT authentication
- **scikit-learn**: Machine learning library
- **pandas & NumPy**: Data processing
- **bcrypt**: Password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd global-web-work
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

This will start both the React frontend (port 3000) and Flask backend (port 5000) simultaneously.

### CSS Troubleshooting

If you're experiencing CSS styling issues:

1. **Ensure Tailwind CSS is properly installed:**
   ```bash
   cd frontend
   npm install -D tailwindcss@^3.4.0 postcss autoprefixer
   ```

2. **Verify Tailwind configuration:**
   - Check that `tailwind.config.js` exists in the frontend directory
   - Ensure `postcss.config.js` is present
   - Verify that CSS files include Tailwind directives:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

3. **Clear cache and restart:**
   ```bash
   # Stop the development server (Ctrl+C)
   # Clear npm cache
   npm cache clean --force
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   # Restart development server
   npm start
   ```

4. **Check browser developer tools:**
   - Open browser DevTools (F12)
   - Check Console for any CSS-related errors
   - Verify that Tailwind classes are being applied in the Elements tab

### Manual Setup

If you prefer to set up each part separately:

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📱 Usage

### Getting Started
1. **Sign Up**: Create a new account with a unique 4-8 digit ID
2. **Login**: Use your unique ID and 8-character password
3. **Dashboard**: View your tasks and AI-powered insights
4. **Create Tasks**: Add new tasks with AI-suggested priorities
5. **Analytics**: Monitor performance and productivity trends

### User Roles

#### Employee
- View and manage assigned tasks
- Create new tasks
- View personal analytics
- Update task status

#### Admin/Manager
- All employee permissions
- View all tasks across the organization
- Access comprehensive analytics
- Manage team performance

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
JWT_SECRET_KEY=your-secret-key-here
FLASK_ENV=development
```

### Supabase (optional)

This project includes lightweight helpers for integrating with Supabase. Secrets should never be committed to the repository — use environment variables or a local `.env` file.

1. Create a `.env` file in the `backend` folder (copy `backend/.env.example`):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-or-anon-key
```

2. Create a `.env` (or set environment variables) for the frontend (copy `frontend/.env.example`):

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_KEY=your-anon-or-service-role-key
```

3. Backend health check route (once env vars are set and dependencies are installed):

- `GET /api/supabase/health` — returns connection test information (or a message that Supabase is not configured).

IMPORTANT: Do NOT commit your actual Supabase keys. If you have a project URL and API key (anon or service role), set them in the `.env` files or in your CI secrets.

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change password

#### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/<id>` - Update task

#### Analytics
- `GET /api/analytics/dashboard` - Get dashboard data
- `GET /api/ai/suggestions` - Get AI suggestions

## 🎨 Customization

### Themes
The application supports light and dark themes. Toggle between themes using the theme switcher in the sidebar.

### Styling
The UI is built with Tailwind CSS. You can customize the design by modifying the CSS classes in the components.

### AI Models
The AI prioritization system can be customized by modifying the prediction algorithms in `backend/app.py`.

## 📊 Features in Detail

### AI Task Prioritization
- Analyzes task urgency, complexity, and deadline
- Automatically assigns High/Medium/Low priority
- Updates priorities based on changing conditions

### Analytics Dashboard
- Real-time task completion metrics
- Department performance comparison
- Individual productivity tracking
- Trend analysis and forecasting

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏢 About Global Analyst Technologies

Global Web Work is developed for Global Analyst Technologies as an internal task management solution to improve productivity and streamline workflow processes.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for Global Analyst Technologies**
