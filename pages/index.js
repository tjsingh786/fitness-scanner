// pages/index.js (The full file)
import React, { useState, useEffect, useCallback } from 'react';
import { Play, CheckCircle, RotateCcw, Eye, EyeOff, Lock, User, Shield, Calendar, Dumbbell, Clock, Trophy, Users, ChevronDown, Search, CalendarDays, BookOpen, Settings, Save, X, Target, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Head from 'next/head';

const SYSTEM_USERS_SEED = [
  { id: 'akshay', name: 'Akshay', avatar: '💪', color: 'from-blue-500 to-cyan-500' },
  { id: 'ravish', name: 'Ravish', avatar: '🔥', color: 'from-orange-500 to-red-500' }
];

const DEFAULT_WORKOUTS = {
  Monday: { name: "Chest Day", exercises: ["Bench Press 4x8", "Push-ups 3x12"], focus: "Upper Push", duration: "30 min" },
  Tuesday: { name: "Back Day", exercises: ["Pull-ups 3x8", "Rows 4x10"], focus: "Upper Pull", duration: "30 min" },
  Wednesday: { name: "Leg Day", exercises: ["Squats 4x10", "Lunges 3x12"], focus: "Lower Body", duration: "30 min" },
  Thursday: { name: "Shoulders", exercises: ["Press 4x8", "Raises 3x12"], focus: "Shoulders", duration: "25 min" },
  Friday: { name: "HIIT", exercises: ["Burpees 4x10", "Jumping Jacks 3x15"], focus: "Cardio", duration: "20 min" },
  Saturday: { name: "Recovery", exercises: ["Yoga 20 minutes", "Walking 15 minutes"], focus: "Recovery", duration: "35 min" },
  Sunday: { name: "Rest", exercises: ["Stretching 15 minutes", "Meditation 10 minutes"], focus: "Mental", duration: "25 min" }
};

// LoginPage remains unchanged (copy from previous full file)
function LoginPage({ onLogin, onCoachLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      showNotification('Please enter credentials', 'error');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      if (username === 'Admintest' && password === 'Admin@123') {
        showNotification('Login successful! 🚀', 'success');
        setTimeout(() => onLogin(), 1000);
      } else if (username === 'coachlogin' && password === 'coach@123') {
        showNotification('Coach login successful! 🏋️‍♂️', 'success');
        setTimeout(() => onCoachLogin(), 1000);
      } else {
        showNotification('Invalid credentials', 'error');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Dire - Secure Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-black/20 backdrop-blur-sm px-6 py-3 flex justify-between items-center text-white text-sm">
          <span>{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
          <span className="font-bold text-lg">Dire</span>
          <div className="flex gap-1">
            <div className="w-4 h-2 bg-white rounded-sm"></div>
            <div className="w-6 h-2 bg-white/50 rounded-sm"></div>
          </div>
        </div>

        {notification.show && (
          <div className={`fixed top-20 left-4 right-4 z-50 p-4 rounded-xl backdrop-blur-md border transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-500/20 border-green-400/30 text-green-100' :
            notification.type === 'error' ? 'bg-red-500/20 border-red-400/30 text-red-100' :
            'bg-blue-500/20 border-blue-400/30 text-blue-100'
          }`}>
            <p className="font-medium text-center">{notification.message}</p>
          </div>
        )}

        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to Dire</h1>
              <p className="text-white/70">Secure access portal</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <Shield size={20} className="text-purple-400" />
                <h2 className="text-xl font-bold text-white">Sign In</h2>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-400"
                    disabled={isLoading}
                  />
                </div>

                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:border-purple-400"
                    disabled={isLoading}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Shield size={16} />}
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <div className="p-3 bg-blue-500/10 border border-blue-400/20 rounded-xl">
                  <p className="text-blue-200 text-xs text-center">User: <span className="font-mono">Admintest</span> / <span className="font-mono">Admin@123</span></p>
                </div>
                <div className="p-3 bg-orange-500/10 border border-orange-400/20 rounded-xl">
                  <p className="text-orange-200 text-xs text-center">Coach: <span className="font-mono">coachlogin</span> / <span className="font-mono">coach@123</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// UserSelection component (unchanged in its logic, still fetches users)
function UserSelection({ onUserSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
  };

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const usersData = await res.json();
        setAvailableUsers(usersData);
      } else {
        console.error('Failed to fetch users:', res.statusText);
        showNotification('Failed to load users.', 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Error loading users.', 'error');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = availableUsers.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleUserSelect = (user) => {
    showNotification(`Welcome ${user.name}! 👋`, 'success');
    setTimeout(() => onUserSelect(user), 800);
  };

  return (
    <>
      <Head>
        <title>FitnessPro - Select Profile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-black/20 backdrop-blur-sm px-6 py-3 flex justify-between items-center text-white text-sm">
          <span>{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
          <span className="font-bold text-lg">FitnessPro</span>
          <div className="flex gap-1">
            <div className="w-4 h-2 bg-white rounded-sm"></div>
            <div className="w-6 h-2 bg-white/50 rounded-sm"></div>
          </div>
        </div>

        {notification.show && (
          <div className={`fixed top-20 left-4 right-4 z-50 p-4 rounded-xl backdrop-blur-md border transition-all ${
            notification.type === 'success' ? 'bg-green-500/20 border-green-400/30 text-green-100' : 'bg-blue-500/20 border-blue-400/30 text-blue-100'
          }`}>
            <p className="font-medium text-center">{notification.message}</p>
          </div>
        )}

        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Select Profile</h1>
              <p className="text-white/70">Choose your account</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="relative mb-4">
                <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setIsDropdownOpen(true); }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Search profile..."
                  className="w-full bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40"
                >
                  <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {loadingUsers ? (
                <div className="p-4 text-center text-white/60">Loading users...</div>
              ) : isDropdownOpen && (
                <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/20 max-h-40 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    <div className="p-2">
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all"
                        >
                          <div className={`w-10 h-10 bg-gradient-to-r ${user.color} rounded-full flex items-center justify-center`}>
                            {user.avatar}
                          </div>
                          <span className="text-white font-medium">{user.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-white/60">No profiles found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// CalendarView component (unchanged)
function CalendarView({ customWorkouts, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  const nextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    if (next <= new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())) {
      setCurrentDate(next);
    }
  };
  
  const prevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth())) {
      setCurrentDate(prev);
    }
  };
  
  const isToday = (day) => {
    const date = new Date(year, month, day);
    return date.toDateString() === today.toDateString();
  };
  
  const isPastDate = (day) => {
    const date = new Date(year, month, day);
    const todayNoTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayNoTime;
  };
  
  const getDateString = (day) => {
    return new Date(year, month, day).toISOString().split('T')[0];
  };
  
  const hasCustomWorkout = (day) => {
    return customWorkouts[getDateString(day)] !== undefined;
  };
  
  const handleDateClick = (day) => {
    if (!isPastDate(day)) {
      const dateString = getDateString(day);
      onDateSelect(dateString);
    }
  };
  
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          disabled={currentDate <= new Date(today.getFullYear(), today.getMonth())}
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-lg font-bold text-white">
          {monthNames[month]} {year}
        </h2>
        
        <button
          onClick={nextMonth}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          disabled={currentDate >= new Date(today.getFullYear(), today.getMonth() + 1)}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-white/60">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-white/60">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500/30 border border-green-400/50 rounded-full"></div>
          <span className="text-white/60">Custom Workout</span>
        </div>
      </div>
    </div>
  );
}

// CoachDashboard component (unchanged in logic, but relies on new API imports)
function CoachDashboard({ onLogout }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState(['']);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('packages');
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [workoutPackages, setWorkoutPackages] = useState([]);
  const [customWorkouts, setCustomWorkouts] = useState({});
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [newUserName, setNewUserName] = useState('');
  const [newUserAvatar, setNewUserAvatar] = useState('');
  const [newUserColor, setNewUserColor] = useState('from-gray-500 to-gray-600');

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
  };

  const fetchWorkoutPackages = useCallback(async () => {
    try {
      const res = await fetch('/api/workout-packages');
      if (res.ok) {
        const data = await res.json();
        setWorkoutPackages(data);
      } else {
        console.error('Failed to fetch workout packages:', res.statusText);
        showNotification('Failed to load workout packages.', 'error');
      }
    } catch (error) {
      console.error('Error fetching workout packages:', error);
      showNotification('Error loading workout packages.', 'error');
    }
  }, []);

  const fetchCustomWorkouts = useCallback(async () => {
    try {
      const res = await fetch('/api/custom-workouts');
      if (res.ok) {
        const data = await res.json();
        setCustomWorkouts(data);
      } else {
        console.error('Failed to fetch custom workouts:', res.statusText);
        showNotification('Failed to load custom workouts.', 'error');
      }
    } catch (error) {
      console.error('Error fetching custom workouts:', error);
      showNotification('Error loading custom workouts.', 'error');
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const usersData = await res.json();
        setUsers(usersData);
      } else {
        console.error('Failed to fetch users:', res.statusText);
        showNotification('Failed to load users.', 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Error loading users.', 'error');
    }
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      setLoadingData(true);
      await Promise.all([fetchWorkoutPackages(), fetchCustomWorkouts(), fetchUsers()]);
      setLoadingData(false);
    };
    loadAllData();
  }, [fetchWorkoutPackages, fetchCustomWorkouts, fetchUsers]);

  const getNextDays = (count = 30) => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const saveWorkoutPackage = async () => {
    if (!workoutName.trim() || exercises.filter(e => e.trim()).length === 0) {
      showNotification('Please fill all fields', 'error');
      return;
    }

    const newPackage = {
      name: workoutName,
      exercises: exercises.filter(e => e.trim()),
      focus: 'Custom',
      duration: '30-45 min',
      createdBy: 'Coach',
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/workout-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPackage)
      });
      if (res.ok) {
        showNotification(`Workout package "${workoutName}" created! 💪`, 'success');
        setWorkoutName('');
        setExercises(['']);
        fetchWorkoutPackages();
      } else {
        console.error('Failed to save workout package:', res.statusText);
        showNotification('Failed to save package.', 'error');
      }
    } catch (error) {
      console.error('Error saving workout package:', error);
      showNotification('Error saving package.', 'error');
    }
  };

  const deleteWorkoutPackage = async (packageId) => {
    try {
      const res = await fetch(`/api/workout-packages?id=${packageId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showNotification('Workout package deleted', 'success');
        fetchWorkoutPackages();
      } else {
        console.error('Failed to delete workout package:', res.statusText);
        showNotification('Failed to delete package.', 'error');
      }
    } catch (error) {
      console.error('Error deleting workout package:', error);
      showNotification('Error deleting package.', 'error');
    }
  };

  const assignPackageToDate = async (date, packageData) => {
    const workoutToAssign = {
      date: date,
      workoutName: packageData.name,
      exercises: packageData.exercises,
      focus: packageData.focus,
      duration: packageData.duration,
      createdBy: packageData.createdBy || 'Coach'
    };

    try {
      const res = await fetch('/api/custom-workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workoutToAssign)
      });
      if (res.ok) {
        showNotification(`Workout assigned to ${new Date(date).toLocaleDateString()}! 📅`, 'success');
        setShowDateModal(false);
        setSelectedPackage(null);
        fetchCustomWorkouts();
      } else {
        console.error('Failed to assign workout:', res.statusText);
        showNotification('Failed to assign workout.', 'error');
      }
    } catch (error) {
      console.error('Error assigning workout:', error);
      showNotification('Error assigning workout.', 'error');
    }
  };

  const handleAddUser = async () => {
    if (!newUserName.trim() || !newUserAvatar.trim()) {
      showNotification('Please enter user name and avatar', 'error');
      return;
    }

    const newUserId = newUserName.toLowerCase().replace(/\s/g, '-');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newUserId,
          name: newUserName,
          avatar: newUserAvatar,
          color: newUserColor
        })
      });
      if (res.ok) {
        showNotification(`User "${newUserName}" added!`, 'success');
        setNewUserName('');
        setNewUserAvatar('');
        setNewUserColor('from-gray-500 to-gray-600');
        fetchUsers();
      } else {
        const errorData = await res.json();
        if (res.status === 409 && errorData.error.includes("ID conflict")) {
          showNotification(errorData.error, 'error');
        } else {
          console.error('Failed to add user:', errorData.error || res.statusText);
          showNotification('Failed to add user.', 'error');
        }
      }
    } catch (error) {
      console.error('Error adding user:', error);
      showNotification('Error adding user.', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    const isSystemUser = SYSTEM_USERS_SEED.some(u => u.id === userId);
    if (isSystemUser) {
      showNotification('Cannot delete default system users (Akshay, Ravish).', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${users.find(u => u.id === userId)?.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showNotification('User deleted!', 'success');
        fetchUsers();
      } else if (res.status === 403) {
        const errorData = await res.json();
        showNotification(errorData.error || 'Permission denied to delete user.', 'error');
      } else if (res.status === 404) {
        const errorData = await res.json();
        showNotification(errorData.error || 'User not found.', 'error');
      } else {
        console.error('Failed to delete user:', res.statusText);
        showNotification('Failed to delete user.', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('Error deleting user.', 'error');
    }
  };

  const createManualWorkout = async () => {
    if (!selectedDate || !workoutName.trim() || exercises.filter(e => e.trim()).length === 0) {
      showNotification('Please fill all fields', 'error');
      return;
    }
    const workout = {
      date: selectedDate,
      workoutName: workoutName,
      exercises: exercises.filter(e => e.trim()),
      focus: 'Custom',
      duration: '30-45 min',
      createdBy: 'Coach'
    };

    try {
      const res = await fetch('/api/custom-workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout)
      });
      if (res.ok) {
        showNotification(`Workout created for ${selectedDate}! 💪`, 'success');
        setSelectedDate('');
        setWorkoutName('');
        setExercises(['']);
        setShowDateModal(false);
        fetchCustomWorkouts();
      } else {
        console.error('Failed to create manual workout:', res.statusText);
        showNotification('Failed to create workout.', 'error');
      }
    } catch (error) {
      console.error('Error creating manual workout:', error);
      showNotification('Error creating workout.', 'error');
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white text-xl">
        Loading Coach Dashboard...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Coach Dashboard - FitnessPro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-black/20 backdrop-blur-sm px-6 py-3 flex justify-between items-center text-white text-sm">
          <span>{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
          <span className="font-bold text-lg">Coach Dashboard</span>
          <button onClick={onLogout} className="text-red-400 hover:text-red-300 text-xs">Logout</button>
        </div>

        {notification.show && (
          <div className={`fixed top-20 left-4 right-4 z-50 p-4 rounded-xl backdrop-blur-md border transition-all ${
            notification.type === 'success' ? 'bg-green-500/20 border-green-400/30 text-green-100' : 'bg-red-500/20 border-red-400/30 text-red-100'
          }`}>
            <p className="font-medium text-center">{notification.message}</p>
          </div>
        )}

        <div className="flex bg-black/20 mx-4 my-4 rounded-xl p-1">
          {[
            { id: 'packages', label: 'Workout Packages', icon: BookOpen }, 
            { id: 'calendar', label: 'Calendar', icon: CalendarDays },
            { id: 'manual', label: 'Manual Create', icon: Settings },
            { id: 'users', label: 'Users', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all ${
                  activeTab === tab.id ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-white/70'
                }`}
              >
                <Icon size={16} />
                <span className="font-medium text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="px-4 pb-20">
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Create Workout Package</h1>
                <p className="text-white/70">Define reusable workout templates</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="space-y-4">
                  <input
                    type="text"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    placeholder="Package name (e.g., Upper Body Strength)"
                    className="w-full bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-400"
                  />

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-sm">Exercises</span>
                      <button
                        onClick={() => setExercises([...exercises, ''])}
                        className="bg-purple-500 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1"
                      >
                        <Plus size={12} />
                        Add
                      </button>
                    </div>
                    {exercises.map((exercise, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={exercise}
                          onChange={(e) => {
                            const newExercises = [...exercises];
                            newExercises[index] = e.target.value;
                            setExercises(newExercises);
                          }}
                          placeholder="e.g., Bench Press 4x8 or Plank 30 seconds"
                          className="flex-1 bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:border-purple-400"
                        />
                        {exercises.length > 1 && (
                          <button
                            onClick={() => setExercises(exercises.filter((_, i) => i !== index))}
                            className="bg-red-500/20 text-red-400 px-2 py-2 rounded-lg"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={saveWorkoutPackage}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    Save Package
                  </button>
                </div>
              </div>

              {workoutPackages.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-white">Saved Packages</h2>
                  {workoutPackages.map((pkg) => (
                    <div key={pkg.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                          <p className="text-white/60 text-sm">{pkg.exercises.length} exercises</p>
                        </div>
                        <button
                          onClick={() => deleteWorkoutPackage(pkg.id)}
                          className="bg-red-500/20 text-red-400 px-2 py-2 rounded-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="bg-black/20 rounded-lg p-3">
                        {pkg.exercises.map((exercise, index) => (
                          <div key={index} className="text-white/80 text-sm">• {exercise}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Calendar View</h1>
                <p className="text-white/70">Click dates to assign workouts</p>
              </div>

              <CalendarView 
                customWorkouts={customWorkouts} 
                onDateSelect={handleDateSelect}
              />
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Manual Create</h1>
                <p className="text-white/70">Create workout for specific date</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="space-y-4">
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-black/30 text-white border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-400"
                  >
                    <option value="">Choose date...</option>
                    {getNextDays().map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    placeholder="Workout name"
                    className="w-full bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-400"
                  />

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-sm">Exercises</span>
                      <button
                        onClick={() => setExercises([...exercises, ''])}
                        className="bg-purple-500 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1"
                      >
                        <Plus size={12} />
                        Add
                      </button>
                    </div>
                    {exercises.map((exercise, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={exercise}
                          onChange={(e) => {
                            const newExercises = [...exercises];
                            newExercises[index] = e.target.value;
                            setExercises(newExercises);
                          }}
                          placeholder="e.g., Push-ups 3x10"
                          className="flex-1 bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:border-purple-400"
                        />
                        {exercises.length > 1 && (
                          <button
                            onClick={() => setExercises(exercises.filter((_, i) => i !== index))}
                            className="bg-red-500/20 text-red-400 px-2 py-2 rounded-lg"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={createManualWorkout}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    Create Workout
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Manage Users</h1>
                <p className="text-white/70">Add or remove user profiles</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Add New User</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="User Name"
                    className="w-full bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-400"
                  />
                  <input
                    type="text"
                    value={newUserAvatar}
                    onChange={(e) => setNewUserAvatar(e.target.value)}
                    placeholder="Avatar (e.g., 😄, 🌟, 🏋️‍♀️)"
                    className="w-full bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-400"
                  />
                  <select
                    value={newUserColor}
                    onChange={(e) => setNewUserColor(e.target.value)}
                    className="w-full bg-black/30 text-white border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="from-gray-500 to-gray-600">Gray (Default)</option>
                    <option value="from-blue-500 to-cyan-500">Blue</option>
                    <option value="from-orange-500 to-red-500">Red</option>
                    <option value="from-purple-500 to-pink-500">Purple</option>
                    <option value="from-teal-500 to-green-500">Green</option>
                  </select>
                  <button
                    onClick={handleAddUser}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Add User
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Existing Users</h2>
                {users.length > 0 ? (
                  users.map((user) => (
                    <div key={user.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${user.color} rounded-full flex items-center justify-center`}>
                          {user.avatar}
                        </div>
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className={`bg-red-500/20 text-red-400 px-2 py-2 rounded-lg ${
                          SYSTEM_USERS_SEED.some(u => u.id === user.id) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={SYSTEM_USERS_SEED.some(u => u.id === user.id)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60 text-center">No users added yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {showDateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Assign Workout</h2>
                <p className="text-white/70">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setShowDateModal(false);
                    setActiveTab('manual');
                    setWorkoutName('');
                    setExercises(['']);
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Settings size={16} />
                  Create Manual Workout
                </button>

                {workoutPackages.length > 0 && (
                  <>
                    <div className="text-center text-white/60 text-sm">OR</div>
                    
                    <div className="space-y-2">
                      <p className="text-white/80 text-sm font-medium">Choose from packages:</p>
                      {workoutPackages.map((pkg) => (
                        <button
                          key={pkg.id}
                          onClick={() => assignPackageToDate(selectedDate, pkg)}
                          className="w-full bg-white/10 text-white p-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all text-left"
                        >
                          <div className="font-medium">{pkg.name}</div>
                          <div className="text-white/60 text-xs">{pkg.exercises.length} exercises</div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setShowDateModal(false)}
                className="w-full mt-4 bg-white/10 text-white py-2 rounded-xl text-sm border border-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// WorkoutCompletion component (unchanged in logic, but uses updated fields)
function WorkoutCompletion({ currentUser, workoutData, onClose, onSaveLog }) {
  const [customTime, setCustomTime] = useState('');
  const [isCustomTime, setIsCustomTime] = useState(false);
  
  const actualDuration = Math.floor(workoutData.duration / 60);
  
  const handleSaveLog = () => {
    const finalTime = isCustomTime ? parseInt(customTime) || actualDuration : actualDuration;
    const logEntry = {
      user_id: currentUser.id,
      date: new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      workout_name: workoutData.name,
      duration_minutes: finalTime,
      actual_duration_seconds: workoutData.duration,
      total_exercises: workoutData.totalExercises,
      completed_exercises: workoutData.completedExercises,
      completion_rate: Math.round((workoutData.completedExercises / workoutData.totalExercises) * 100),
      is_custom_workout: workoutData.isCustom
    };
    
    onSaveLog(logEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Workout Complete! 🎉</h2>
          <p className="text-white/70">Great job, {currentUser.name}!</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-black/20 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-sm">Auto Time</span>
              <span className="text-white font-bold">{actualDuration} min</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-white/70 text-sm">Completion</span>
              <span className="text-green-400 font-bold">
                {Math.round((workoutData.completedExercises / workoutData.totalExercises) * 100)}%
              </span>
            </div>
            
            <div className="border-t border-white/20 pt-3">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="customTime"
                  checked={isCustomTime}
                  onChange={(e) => setIsCustomTime(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="customTime" className="text-white/80 text-sm">Set custom time</label>
              </div>
              
              {isCustomTime && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    placeholder={actualDuration.toString()}
                    className="flex-1 bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-purple-400"
                    min="1"
                    max="120"
                  />
                  <span className="text-white/60 text-sm">minutes</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-black/20 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">⭐</div>
            <p className="text-white text-sm font-medium">{workoutData.name}</p>
            <p className="text-white/60 text-xs">{new Date().toLocaleDateString()}</p>
            {workoutData.isCustom && (
              <p className="text-green-400 text-xs mt-1">🏋️ Coach Designed</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 text-white py-3 rounded-xl text-sm font-semibold border border-white/20 hover:bg-white/20 transition-all"
          >
            Skip
          </button>
          <button
            onClick={handleSaveLog}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-green-500/25 transition-all"
          >
            Save Time
          </button>
        </div>
      </div>
    </div>
  );
}

// WorkoutApp component (unchanged in logic, but uses updated fields)
function WorkoutApp({ currentUser, onLogout, onUserChange }) {
  const [workouts, setWorkouts] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [currentWorkoutDetails, setCurrentWorkoutDetails] = useState(null);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);

  const [customWorkouts, setCustomWorkouts] = useState({});
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const getTodaysWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    const currentDay = getCurrentDay();
    return customWorkouts[today] || DEFAULT_WORKOUTS[currentDay];
  };

  const todaysWorkout = getTodaysWorkout();
  const isCustomWorkout = customWorkouts[new Date().toISOString().split('T')[0]] !== undefined;

  const getTodaysLeader = () => {
    const todayFormatted = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const todaysLogs = workoutLogs.filter(log => log.date === todayFormatted && log.workoutName === todaysWorkout.name); // Changed log.workout_name to log.workoutName
    
    if (todaysLogs.length === 0) return null;
    
    const fastest = todaysLogs.reduce((prev, current) => 
      (prev.durationMinutes < current.durationMinutes) ? prev : current // Changed duration_minutes to durationMinutes
    );
    
    const leaderUserName = currentUser.id === fastest.userId ? currentUser.name : fastest.userId; // Changed fastest.user_id to fastest.userId

    return {
      name: leaderUserName,
      time: fastest.durationMinutes, // Changed duration_minutes to durationMinutes
      total: todaysLogs.length
    };
  };

  const fetchCustomWorkouts = useCallback(async () => {
    try {
      const res = await fetch('/api/custom-workouts');
      if (res.ok) {
        const data = await res.json();
        setCustomWorkouts(data);
      } else {
        console.error('Failed to fetch custom workouts:', res.statusText);
        showNotification('Failed to load custom workouts.', 'error');
      }
    } catch (error) {
      console.error('Error fetching custom workouts:', error);
      showNotification('Error loading custom workouts.', 'error');
    }
  }, []);

  const fetchWorkoutLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/workout-logs');
      if (res.ok) {
        const data = await res.json();
        setWorkoutLogs(data);
      } else {
        console.error('Failed to fetch workout logs:', res.statusText);
        showNotification('Failed to load workout logs.', 'error');
      }
    } catch (error) {
      console.error('Error fetching workout logs:', error);
      showNotification('Error loading workout logs.', 'error');
    }
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      setLoadingData(true);
      await Promise.all([fetchCustomWorkouts(), fetchWorkoutLogs()]);
      setLoadingData(false);
    };
    loadAllData();
  }, [fetchCustomWorkouts, fetchWorkoutLogs]);

  const leader = getTodaysLeader();

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
  };

  const parseWorkoutLine = (line) => {
    const patterns = [/^(.+?)\s*(\d+)\s*[x*]\s*(\d+)$/, /^(.+?)\s*(\d+)\s+(minutes?)$/];
    for (let pattern of patterns) {
      const match = line.toLowerCase().trim().match(pattern);
      if (match) {
        const isTimeBased = line.includes('minute');
        return {
          id: Date.now() + Math.random(),
          name: match[1].trim(),
          sets: isTimeBased ? 1 : parseInt(match[2], 10),
          reps: isTimeBased ? parseInt(match[2], 10) : parseInt(match[3], 10) || 1,
          completed: 0,
          isActive: false
        };
      }
    }
    return null;
  };

  const loadTodaysWorkout = () => {
    const parsedWorkouts = todaysWorkout.exercises.map(exercise => parseWorkoutLine(exercise)).filter(Boolean);
    if (parsedWorkouts.length > 0) {
      setWorkouts(parsedWorkouts);
      setCurrentWorkoutDetails({
        name: todaysWorkout.name,
        exercises: parsedWorkouts,
        totalExercises: parsedWorkouts.length,
        isCustom: isCustomWorkout
      });
      setWorkoutStartTime(Date.now());
      showNotification(`${todaysWorkout.name} loaded! 💪`, 'success');
    }
  };

  const startSet = (exerciseId) => {
    setWorkouts(prev => prev.map(w => w.id === exerciseId ? { ...w, isActive: true } : w));
  };

  const completeSet = (exerciseId) => {
    const updatedWorkouts = workouts.map(w => w.id === exerciseId ? { ...w, completed: Math.min(w.completed + 1, w.sets), isActive: false } : w);
    setWorkouts(updatedWorkouts);
    
    const allCompleted = updatedWorkouts.every(w => w.completed === w.sets);
    
    if (allCompleted) {
      setTimeout(() => {
        const workoutDuration = Math.floor((Date.now() - workoutStartTime) / 1000);
        const completedExercisesCount = updatedWorkouts.filter(w => w.completed === w.sets).length;
        
        setShowCompletion(true);
        setCurrentWorkoutDetails(prev => ({
          ...prev,
          duration: workoutDuration,
          completedExercises: completedExercisesCount
        }));
      }, 1000);
    } else {
      showNotification('Set complete! 🔥', 'success');
    }
  };

  const resetExercise = (exerciseId) => {
    setWorkouts(prev => prev.map(w => w.id === exerciseId ? { ...w, completed: 0, isActive: false } : w));
  };

  const getProgressPercentage = () => {
    if (workouts.length === 0) return 0;
    const totalSets = workouts.reduce((acc, w) => acc + w.sets, 0);
    const completedSets = workouts.reduce((acc, w) => acc + w.completed, 0);
    return Math.round((completedSets / totalSets) * 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveWorkoutLog = async (logEntry) => {
    try {
      const res = await fetch('/api/workout-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      });
      if (res.ok) {
        showNotification('Workout logged successfully! 📊', 'success');
        fetchWorkoutLogs();
      } else {
        console.error('Failed to log workout:', res.statusText);
        showNotification('Failed to log workout.', 'error');
      }
    } catch (error) {
      console.error('Error logging workout:', error);
      showNotification('Error logging workout.', 'error');
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white text-xl">
        Loading Workout Data...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>FitnessPro - Workout Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-black/20 backdrop-blur-sm px-6 py-3 flex justify-between items-center text-white text-sm">
          <span>{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
          <span className="font-bold text-lg">FitnessPro</span>
          <div className="flex items-center gap-3">
            <button onClick={onUserChange} className="text-blue-400 hover:text-blue-300 text-xs">Switch</button>
            <button onClick={onLogout} className="text-red-400 hover:text-red-300 text-xs">Logout</button>
          </div>
        </div>

        {leader && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border-b border-yellow-400/30 px-4 py-2">
            <div className="flex items-center justify-center gap-2">
              <Trophy size={16} className="text-yellow-400" />
              <span className="text-yellow-300 text-sm font-medium">
                🏆 Today's Leader: <span className="font-bold">{leader.name}</span> - {leader.time} min
                {leader.total > 1 && <span className="text-yellow-400/70"> ({leader.total} completed)</span>}
              </span>
            </div>
          </div>
        )}

        {notification.show && (
          <div className={`fixed top-20 left-4 right-4 z-50 p-4 rounded-xl backdrop-blur-md border transition-all ${
            notification.type === 'success' ? 'bg-green-500/20 border-green-400/30 text-green-100' : 'bg-blue-500/20 border-blue-400/30 text-blue-100'
          }`}>
            <p className="font-medium text-center">{notification.message}</p>
          </div>
        )}

        <div className="px-4 pt-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${currentUser.color} rounded-full flex items-center justify-center`}>
              {currentUser.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Welcome {currentUser.name}!</h3>
              <p className="text-white/60 text-sm">{isCustomWorkout ? '🏋️ Coach workout' : '📋 Standard workout'}</p>
            </div>
            {workoutStartTime && (
              <div className="text-right">
                <div className="text-white/60 text-xs">Time</div>
                <div className="text-white font-mono text-sm">{formatTime(Math.floor((Date.now() - workoutStartTime) / 1000))}</div>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Ready for {getCurrentDay()}? 🔥</h1>
            <p className="text-white/70">Focus: <span className="text-purple-400">{todaysWorkout.focus}</span></p>
          </div>

          <div className="`backdrop-blur-md rounded-2xl p-4 border mb-6 ${
            isCustomWorkout ? 'bg-green-500/20 border-green-400/30' : 'bg-purple-500/20 border-purple-400/30'
          }`}">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Dumbbell size={20} className={isCustomWorkout ? "text-green-400" : "text-purple-400"} />
                <h2 className="text-xl font-bold text-white">{todaysWorkout.name}</h2>
                {isCustomWorkout && <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">Coach</span>}
              </div>
              <div className="flex items-center gap-1 text-white/70">
                <Clock size={14} />
                <span className="text-sm">{todaysWorkout.duration}</span>
              </div>
            </div>

            {currentWorkoutDetails && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Progress</span>
                  <span>{getProgressPercentage()}%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCustomWorkout ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-purple-400 to-pink-400'
                    }`}
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={loadTodaysWorkout}
              className={`w-full text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                isCustomWorkout ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
            >
              <Target size={16} />
              Start {getCurrentDay()}'s Workout
            </button>
          </div>

          {workouts.length > 0 && (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className={`bg-white/10 backdrop-blur-md rounded-xl p-4 border transition-all ${
                    workout.isActive ? 'border-green-400/50 bg-green-500/10' : 'border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white capitalize">{workout.name}</h3>
                      <p className="text-white/60 text-sm">{workout.sets} sets × {workout.reps} reps</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">{workout.completed}/{workout.sets}</div>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-3">
                    {[...Array(workout.sets)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          i < workout.completed ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {workout.completed < workout.sets && (
                      <>
                        <button
                          onClick={() => startSet(workout.id)}
                          disabled={workout.isActive}
                          className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                            workout.isActive
                              ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          <Play size={14} />
                          {workout.isActive ? 'Active' : 'Start'}
                        </button>

                        <button
                          onClick={() => completeSet(workout.id)}
                          disabled={!workout.isActive}
                          className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <CheckCircle size={14} />
                          Complete
                        </button>
                      </>
                    )}

                    {workout.completed === workout.sets && (
                      <div className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 border border-green-400/30">
                        <CheckCircle size={14} />
                        Done! 🎉
                      </div>
                    )}

                    <button
                      onClick={() => resetExercise(workout.id)}
                      className="px-3 bg-white/10 text-white py-2 rounded-lg border border-white/20 hover:bg-white/20"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showCompletion && currentWorkoutDetails && (
          <WorkoutCompletion
            currentUser={currentUser}
            workoutData={currentWorkoutDetails}
            onClose={() => setShowCompletion(false)}
            onSaveLog={handleSaveWorkoutLog}
          />
        )}
      </div>
    </>
  );
}

// App component (unchanged in logic, just uses new imports)
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
    }
    return false;
  });
  const [isCoachLoggedIn, setIsCoachLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('isCoachLoggedIn') || 'false');
    }
    return false;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isCoachLoggedIn', JSON.stringify(isCoachLoggedIn));
    }
  }, [isCoachLoggedIn]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const handleLogin = () => setIsLoggedIn(true);
  const handleCoachLogin = () => setIsCoachLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsCoachLoggedIn(false);
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('isCoachLoggedIn');
      localStorage.removeItem('currentUser');
    }
  };
  const handleUserSelect = (user) => setCurrentUser(user);
  const handleUserChange = () => setCurrentUser(null);

  return (
    <>
      {!isLoggedIn && !isCoachLoggedIn ? (
        <LoginPage onLogin={handleLogin} onCoachLogin={handleCoachLogin} />
      ) : isCoachLoggedIn ? (
        <CoachDashboard 
          onLogout={handleLogout} 
        />
      ) : !currentUser ? (
        <UserSelection onUserSelect={handleUserSelect} />
      ) : (
        <WorkoutApp 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          onUserChange={handleUserChange} 
        />
      )}
    </>
  );
}
