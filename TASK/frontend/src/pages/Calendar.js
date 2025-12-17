import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.due_date);
      return isSameDay(taskDate, date);
    });
  };

  const getTasksForMonth = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return tasks.filter(task => {
      const taskDate = new Date(task.due_date);
      return taskDate >= monthStart && taskDate <= monthEnd;
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3 text-green-600" />;
      case 'overdue': return <AlertTriangle className="w-3 h-3 text-red-600" />;
      default: return <Clock className="w-3 h-3 text-blue-600" />;
    }
  };

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const monthTasks = getTasksForMonth();

    return days.map((day, index) => {
      const dayTasks = getTasksForDate(day);
      const isCurrentMonth = isSameMonth(day, currentDate);
      const isToday = isSameDay(day, new Date());
      const isSelected = isSameDay(day, selectedDate);

      return (
        <div
          key={index}
          className={`min-h-[120px] p-2 border border-gray-200 dark:border-slate-700 ${
            isCurrentMonth ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-900'
          } ${isToday ? 'ring-2 ring-blue-500' : ''} ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
          onClick={() => setSelectedDate(day)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'
            } ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
              {format(day, 'd')}
            </span>
            {dayTasks.length > 0 && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                {dayTasks.length}
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            {dayTasks.slice(0, 3).map((task, taskIndex) => (
              <div
                key={taskIndex}
                className={`text-xs p-1 rounded border-l-2 ${getPriorityColor(task.priority)} truncate`}
                title={task.title}
              >
                <div className="flex items-center space-x-1">
                  {getStatusIcon(task.status)}
                  <span className="truncate">{task.title}</span>
                </div>
              </div>
            ))}
            {dayTasks.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +{dayTasks.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const getSelectedDateTasks = () => {
    return getTasksForDate(selectedDate);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage your tasks by date
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <button
            onClick={() => setShowTaskModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="bg-gray-50 dark:bg-slate-700 p-3 text-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {day}
                  </span>
                </div>
              ))}
              
              {/* Calendar Days */}
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        {/* Sidebar - Selected Date Tasks */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tasks for {format(selectedDate, 'MMM dd, yyyy')}</h3>
            </div>
            
            <div className="space-y-3">
              {getSelectedDateTasks().length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No tasks for this date
                  </p>
                </div>
              ) : (
                getSelectedDateTasks().map((task) => (
                  <div key={task.id} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {task.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(task.status)}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {task.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(task.due_date), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
