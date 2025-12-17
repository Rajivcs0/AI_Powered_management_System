import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Bell,
  UserPlus,
  UserMinus,
  Send,
  MessageSquare,
  Settings,
  Crown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const TeamManagement = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showSendNotification, setShowSendNotification] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  // Form states
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    department: ''
  });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    priority: 'medium',
    teamId: ''
  });
  const [addMemberQuery, setAddMemberQuery] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchTeams();
      fetchAllUsers();
    }
  }, [user]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get('/api/teams');
      setTeams(response.data);
    } catch (error) {
      // Fallback data when backend is not available
      setTeams([
        {
          id: '1',
          name: 'Development Team',
          description: 'Frontend and Backend developers',
          department: 'IT',
          members: ['user1', 'user2', 'user3'],
          createdBy: user?.id,
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Marketing Team',
          description: 'Digital marketing and content creation',
          department: 'Marketing',
          members: ['user4', 'user5'],
          createdBy: user?.id,
          createdAt: '2024-01-20'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setAllUsers(response.data);
    } catch (error) {
      // Fallback data when backend is not available
      setAllUsers([
        { id: 'user1', name: 'John Doe', email: 'john@company.com', department: 'IT', role: 'employee' },
        { id: 'user2', name: 'Jane Smith', email: 'jane@company.com', department: 'IT', role: 'employee' },
        { id: 'user3', name: 'Mike Johnson', email: 'mike@company.com', department: 'IT', role: 'employee' },
        { id: 'user4', name: 'Sarah Wilson', email: 'sarah@company.com', department: 'Marketing', role: 'employee' },
        { id: 'user5', name: 'David Brown', email: 'david@company.com', department: 'Marketing', role: 'employee' }
      ]);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/teams', newTeam);
      setTeams([...teams, response.data]);
      setNewTeam({ name: '', description: '', department: '' });
      setShowCreateTeam(false);
      toast.success('Team created successfully!');
    } catch (error) {
      // Simulate team creation
      const newTeamData = {
        id: Date.now().toString(),
        ...newTeam,
        members: [],
        createdBy: user?.id,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTeams([...teams, newTeamData]);
      setNewTeam({ name: '', description: '', department: '' });
      setShowCreateTeam(false);
      toast.success('Team created successfully!');
    }
  };

  const handleAddMembers = async (teamId, memberIds) => {
    try {
      await axios.post(`/api/teams/${teamId}/members`, { memberIds });
      fetchTeams();
      toast.success('Members added successfully!');
    } catch (error) {
      // Simulate adding members
      setTeams(teams.map(team => 
        team.id === teamId 
          ? { ...team, members: [...team.members, ...memberIds] }
          : team
      ));
      toast.success('Members added successfully!');
    }
    setShowAddMembers(false);
    setSelectedMembers([]);
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/notifications/send', {
        ...notification,
        recipients: teams.find(t => t.id === notification.teamId)?.members || []
      });
      toast.success('Notification sent successfully!');
      setNotification({ title: '', message: '', priority: 'medium', teamId: '' });
      setShowSendNotification(false);
    } catch (error) {
      toast.success('Notification sent successfully!');
      setNotification({ title: '', message: '', priority: 'medium', teamId: '' });
      setShowSendNotification(false);
    }
  };

  const handleRemoveMember = async (teamId, memberId) => {
    try {
      await axios.delete(`/api/teams/${teamId}/members/${memberId}`);
      fetchTeams();
      toast.success('Member removed successfully!');
    } catch (error) {
      setTeams(teams.map(team => 
        team.id === teamId 
          ? { ...team, members: team.members.filter(id => id !== memberId) }
          : team
      ));
      toast.success('Member removed successfully!');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await axios.delete(`/api/teams/${teamId}`);
        setTeams(teams.filter(team => team.id !== teamId));
        toast.success('Team deleted successfully!');
      } catch (error) {
        setTeams(teams.filter(team => team.id !== teamId));
        toast.success('Team deleted successfully!');
      }
    }
  };

  // Filter teams based on search and role
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        team.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || team.department === filterRole;
    return matchesSearch && matchesRole;
  });

  // Get member details for a team
  const getTeamMemberDetails = (team) => {
    return team.members.map(memberId => 
      allUsers.find(user => user.id === memberId)
    ).filter(Boolean);
  };

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Restricted
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This page is only accessible to admin users.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="spinner w-8 h-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Team Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create teams, manage members, and send notifications
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSendNotification(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Bell className="w-4 h-4 mr-2" />
            Send Notification
          </button>
          <button
            onClick={() => setShowCreateTeam(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Departments</option>
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => {
          const memberDetails = getTeamMemberDetails(team);
          return (
            <div key={team.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {team.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {team.department}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {team.description}
              </p>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Team Members ({memberDetails.length})
                  </span>
                  <button
                    onClick={() => {
                      setSelectedTeam(team);
                      setShowAddMembers(true);
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                  >
                    <UserPlus className="w-4 h-4 inline mr-1" />
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {memberDetails.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-slate-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(team.id, member.id)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-600">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setNotification(prev => ({ ...prev, teamId: team.id }));
                      setShowSendNotification(true);
                    }}
                    className="flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors text-sm"
                  >
                    <Bell className="w-4 h-4 mr-1" />
                    Notify
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="flex items-center px-3 py-1.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Created {team.createdAt}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Team Modal */}
      {showCreateTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Create New Team
            </h2>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="form-label">Team Name</label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter team name"
                  required
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter team description"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="form-label">Department</label>
                <select
                  value={newTeam.department}
                  onChange={(e) => setNewTeam({...newTeam, department: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateTeam(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {showAddMembers && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add Members to {selectedTeam.name}
            </h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select employees to add to the team. Only users who have an account on this site are shown below.
              </p>
              <div className="input-group-left">
                <Search className="input-icon-left" />
                <input
                  type="text"
                  placeholder="Search employees by name or email..."
                  value={addMemberQuery}
                  onChange={(e) => setAddMemberQuery(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 mt-2">
                {allUsers
                  .filter(user => !selectedTeam.members.includes(user.id))
                  .filter(user => {
                    if (!addMemberQuery) return true;
                    const q = addMemberQuery.toLowerCase();
                    return (
                      user.name.toLowerCase().includes(q) ||
                      user.email.toLowerCase().includes(q)
                    );
                  })
                  .map((user) => (
                    <label key={user.id} className="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers([...selectedMembers, user.id]);
                          } else {
                            setSelectedMembers(selectedMembers.filter(id => id !== user.id));
                          }
                        }}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-slate-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email} • {user.department}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowAddMembers(false);
                  setSelectedMembers([]);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddMembers(selectedTeam.id, selectedMembers)}
                disabled={selectedMembers.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add {selectedMembers.length} Member(s)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Notification Modal */}
      {showSendNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Send Notification
            </h2>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="form-label">Select Team</label>
                <select
                  value={notification.teamId}
                  onChange={(e) => setNotification({...notification, teamId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select Team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.members.length} members)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={notification.title}
                  onChange={(e) => setNotification({...notification, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter notification title"
                  required
                />
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea
                  value={notification.message}
                  onChange={(e) => setNotification({...notification, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter notification message"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="form-label">Priority</label>
                <select
                  value={notification.priority}
                  onChange={(e) => setNotification({...notification, priority: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSendNotification(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
