// pages/index.js
import React, { useState, useEffect, useCallback } from 'react';
import { Play, CheckCircle, RotateCcw, Eye, EyeOff, Lock, User, Shield, Calendar, Dumbbell, Clock, Trophy, Users, ChevronDown, Search, CalendarDays, BookOpen, Settings, Save, X, Target, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Head from 'next/head';

const SYSTEM_USERS = [
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
        <title>Dire Crossfit - Secure Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-black/20 backdrop-blur-sm px-6 py-3 flex justify-between items-center text-white text-sm">
          <span>{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
          <span className="font-bold text-lg">Dire Crossfit</span>
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
              {/* INCREASED SIZE HERE FROM w-32 h-32 to w-48 h-48 */}
              <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                <img 
                  src="/img.png"
                  alt="Dire Crossfit Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Removed: <h1 className="text-3xl font-bold text-white mb-2">Dire Crossfit</h1> */}
              {/* Removed: <p className="text-white/70">Secure access portal</p> */}
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


function UserSelection({ onUserSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
  };

  const filteredUsers = SYSTEM_USERS.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

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

              {isDropdownOpen && (
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
    // Allow navigating to future months, but not beyond today + 1 month for calendar demo purposes if desired.
    // For now, let's allow arbitrary future navigation in coach dashboard.
    // if (next <= new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())) {
    //   setCurrentDate(next);
    // }
    setCurrentDate(next);
  };
  
  const prevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    // For now, let's allow arbitrary past navigation in coach dashboard.
    // if (prev >= new Date(today.getFullYear(), today.getMonth())) {
    //   setCurrentDate(prev);
    // }
    setCurrentDate(prev);
  };
  
  const isToday = (day) => {
    const date = new Date(year, month, day);
    return date.toDateString() === today.toDateString();
  };
  
  const isPastDate = (day) => {
    const date = new Date(year, month, day);
    // Only disable if the date is strictly in the past, not including today
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };
  
  const getDateString = (day) => {
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  };
  
  const hasCustomWorkout = (day) => {
    return customWorkouts[getDateString(day)] !== undefined;
  };
  
  const handleDateClick = (day) => {
    // A coach should be able to assign workouts to past dates for logging/retroactive assignments.
    // Only disable if the day is in the past AND not today.
    // Or, remove the disable entirely for coaches. Let's keep it for now but clarify the behavior.
    const date = new Date(year, month, day);
    if (date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) { // Can click on today or future dates
      const dateString = getDateString(day);
      onDateSelect(dateString);
    } else {
      // Optionally show a notification that past dates can't be modified (if that's the desired rule)
      // For a coach dashboard, it's often desirable to allow editing past dates for logging.
      console.log("Past dates are not selectable for new assignments in this demo context.");
    }
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isPast = isPastDate(day);
      const isTodayDate = isToday(day);
      const hasWorkout = hasCustomWorkout(day);
      const isSelectable = !isPast || isTodayDate; // Can select today or future dates

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={!isSelectable} // Disable if not selectable
          className={`h-12 w-full flex items-center justify-center text-sm font-medium rounded-lg transition-all relative ${
            isTodayDate 
              ? 'bg-blue-500 text-white shadow-lg' 
              : !isSelectable // If disabled (past date and not today)
                ? 'text-white/30 cursor-not-allowed'
                : hasWorkout // Has workout and is selectable
                  ? 'bg-green-500/30 text-green-300 border border-green-400/50 hover:bg-green-500/40'
                  : 'text-white/70 hover:bg-white/10 hover:text-white' // Selectable and no workout
          }`}
        >
          {day}
          {hasWorkout && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>
          )}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          // Allowing previous month navigation for coach to view past assigned workouts
          // disabled={currentDate <= new Date(today.getFullYear(), today.getMonth())} 
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-lg font-bold text-white">
          {monthNames[month]} {year}
        </h2>
        
        <button
          onClick={nextMonth}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          // Allowing future month navigation for coach
          // disabled={currentDate >= new Date(today.getFullYear(), today.getMonth() + 1)}
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

function CoachDashboard({ onLogout, customWorkouts, setCustomWorkouts, workoutPackages, setWorkoutPackages, users, setUsers }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState(['']);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('calendar'); // Default to calendar view
  const [showDateModal, setShowDateModal] = useState(false);
  const [isCreatingManualWorkout, setIsCreatingManualWorkout] = useState(false); // New state for manual creation within modal

  const [newUserName, setNewUserName] = useState('');
  const [newUserAvatar, setNewUserAvatar] = useState('');
  const [newUserColor, setNewUserColor] = useState('from-gray-500 to-gray-600');

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
  };

  const saveWorkoutPackage = () => {
    if (!workoutName.trim() || exercises.filter(e => e.trim()).length === 0) {
      showNotification('Please fill all fields for the package', 'error');
      return;
    }

    const workoutPackage = {
      id: Date.now(),
      name: workoutName,
      exercises: exercises.filter(e => e.trim()),
      focus: 'Custom',
      duration: '30-45 min', // Default for custom packages
      createdBy: 'Coach',
      createdAt: new Date().toISOString()
    };

    setWorkoutPackages(prev => [...prev, workoutPackage]);
    showNotification(`Workout package "${workoutName}" created! 💪`, 'success');
    setWorkoutName('');
    setExercises(['']);
  };

  const deleteWorkoutPackage = (packageId) => {
    setWorkoutPackages(prev => prev.filter(pkg => pkg.id !== packageId));
    showNotification('Workout package deleted', 'success');
  };

  const assignPackageToDate = (date, packageData) => {
    setCustomWorkouts(prev => ({ ...prev, [date]: packageData }));
    showNotification(`Workout assigned to ${new Date(date).toLocaleDateString()}! 📅`, 'success');
    setShowDateModal(false);
    setIsCreatingManualWorkout(false); // Reset this state when done
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setWorkoutName(''); // Clear previous input for manual creation
    setExercises(['']); // Clear previous input for manual creation
    setIsCreatingManualWorkout(false); // Default to package selection view when modal opens
    setShowDateModal(true);
  };

  const createManualWorkoutForDate = () => {
    if (!selectedDate || !workoutName.trim() || exercises.filter(e => e.trim()).length === 0) {
      showNotification('Please fill all fields for the manual workout', 'error');
      return;
    }
    const workout = {
      name: workoutName,
      exercises: exercises.filter(e => e.trim()),
      focus: 'Custom', // Default for manual custom workouts
      duration: '30-45 min', // Default for manual custom workouts
      createdBy: 'Coach'
    };
    setCustomWorkouts(prev => ({ ...prev, [selectedDate]: workout }));
    showNotification(`Manual workout created for ${new Date(selectedDate).toLocaleDateString()}! 💪`, 'success');
    setShowDateModal(false);
    setIsCreatingManualWorkout(false); // Reset state after creation
    setSelectedDate('');
    setWorkoutName('');
    setExercises(['']);
  };


  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserAvatar.trim()) {
      showNotification('Please enter user name and avatar', 'error');
      return;
    }
    const newUser = {
      id: newUserName.toLowerCase().replace(/\s/g, '-'), // Simple ID generation
      name: newUserName,
      avatar: newUserAvatar,
      color: newUserColor
    };
    // Check if user already exists (simple check by name)
    if (users.some(user => user.name.toLowerCase() === newUserName.trim().toLowerCase())) {
        showNotification(`User "${newUserName}" already exists.`, 'error');
        return;
    }
    setUsers(prev => [...prev, newUser]);
    showNotification(`User "${newUserName}" added!`, 'success');
    setNewUserName('');
    setNewUserAvatar('');
    setNewUserColor('from-gray-500 to-gray-600');
  };

  const handleDeleteUser = (userId) => {
    // Prevent deletion of SYSTEM_USERS by checking if their IDs match
    if (SYSTEM_USERS.some(u => u.id === userId)) {
      showNotification('Cannot delete system users (Akshay, Ravish).', 'error');
      return;
    }
    setUsers(prev => prev.filter(user => user.id !== userId));
    showNotification('User deleted!', 'success');
  };


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
            { id: 'calendar', label: 'Calendar', icon: CalendarDays },
            { id: 'packages', label: 'Workout Packages', icon: BookOpen },
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
                          className="flex-1 bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:border-purple-4
