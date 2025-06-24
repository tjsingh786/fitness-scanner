import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, RotateCcw, Eye, EyeOff, Lock, User, Shield, Calendar, Dumbbell, Clock, Trophy, Users, ChevronDown, Search, CalendarDays, BookOpen, Settings, Save, X, Target, Plus } from 'lucide-react';

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
  );
}

function CoachDashboard({ onLogout, customWorkouts, setCustomWorkouts }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState(['']);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('create');

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2000);
  };

  const getNextDays = (count = 14) => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const saveWorkout = () => {
    if (!selectedDate || !workoutName || exercises.filter(e => e.trim()).length === 0) {
      showNotification('Please fill all fields', 'error');
      return;
    }

    const workout = {
      name: workoutName,
      exercises: exercises.filter(e => e.trim()),
      focus: 'Custom',
      duration: '30-45 min',
      createdBy: 'Coach'
    };

    setCustomWorkouts(prev => ({ ...prev, [selectedDate]: workout }));
    showNotification(`Workout saved for ${selectedDate}! 💪`, 'success');
    setSelectedDate(''); setWorkoutName(''); setExercises(['']);
  };

  return (
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
        {[{ id: 'create', label: 'Create', icon: BookOpen }, { id: 'calendar', label: 'Calendar', icon: CalendarDays }].map(tab => {
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
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="px-4 pb-20">
        {activeTab === 'create' && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Create Workout</h1>
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
                  onClick={saveWorkout}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Save Workout
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Calendar</h1>
            </div>

            {getNextDays(7).map(date => {
              const dateObj = new Date(date);
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
              const customWorkout = customWorkouts[date];
              const defaultWorkout = DEFAULT_WORKOUTS[dayName];
              const workout = customWorkout || defaultWorkout;

              return (
                <div key={date} className={`bg-white/10 backdrop-blur-md rounded-xl p-4 border ${customWorkout ? 'border-green-400/30' : 'border-white/20'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold">{dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                      <p className="text-purple-400 text-sm">{workout.name}</p>
                      <p className="text-white/60 text-xs">{customWorkout ? '🏋️ Custom' : '📋 Default'}</p>
                    </div>
                    <div className="text-white/60 text-sm">{workout.exercises.length} exercises</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function WorkoutApp({ currentUser, onLogout, onUserChange, customWorkouts }) {
  const [workouts, setWorkouts] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [activeTimers, setActiveTimers] = useState({});
  const [workoutStartTime, setWorkoutStartTime] = useState(null);

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const getTodaysWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    const currentDay = getCurrentDay();
    return customWorkouts[today] || DEFAULT_WORKOUTS[currentDay];
  };

  const currentDay = getCurrentDay();
  const todaysWorkout = getTodaysWorkout();
  const isCustomWorkout = customWorkouts[new Date().toISOString().split('T')[0]] !== undefined;

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
          restTime: 60,
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
      setCurrentWorkout({ name: todaysWorkout.name, exercises: parsedWorkouts, totalExercises: parsedWorkouts.length });
      setWorkoutStartTime(Date.now());
      showNotification(`${todaysWorkout.name} loaded! 💪`, 'success');
    }
  };

  const startSet = (exerciseId) => {
    setWorkouts(prev => prev.map(w => w.id === exerciseId ? { ...w, isActive: true } : w));
  };

  const completeSet = (exerciseId) => {
    setWorkouts(prev => prev.map(w => w.id === exerciseId ? { ...w, completed: Math.min(w.completed + 1, w.sets), isActive: false } : w));
    showNotification('Set complete! 🔥', 'success');
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

  useEffect(() => {
    loadTodaysWorkout();
  }, [customWorkouts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-black/20 backdrop-blur-sm px-6 py-3 flex justify-between items-center text-white text-sm">
        <span>{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
        <span className="font-bold text-lg">FitnessPro</span>
        <div className="flex items-center gap-3">
          <button onClick={onUserChange} className="text-blue-400 hover:text-blue-300 text-xs">Switch</button>
          <button onClick={onLogout} className="text-red-400 hover:text-red-300 text-xs">Logout</button>
        </div>
      </div>

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
          <h1 className="text-3xl font-bold text-white mb-2">Ready for {currentDay}? 🔥</h1>
          <p className="text-white/70">Focus: <span className="text-purple-400">{todaysWorkout.focus}</span></p>
        </div>

        <div className={`backdrop-blur-md rounded-2xl p-4 border mb-6 ${
          isCustomWorkout ? 'bg-green-500/20 border-green-400/30' : 'bg-purple-500/20 border-purple-400/30'
        }`}>
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

          {currentWorkout && (
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
            Start {currentDay}'s Workout
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
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCoachLoggedIn, setIsCoachLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [customWorkouts, setCustomWorkouts] = useState({});

  const handleLogin = () => setIsLoggedIn(true);
  const handleCoachLogin = () => setIsCoachLoggedIn(true);
  const handleLogout = () => { setIsLoggedIn(false); setIsCoachLoggedIn(false); setCurrentUser(null); };
  const handleUserSelect = (user) => setCurrentUser(user);
  const handleUserChange = () => setCurrentUser(null);

  return (
    <>
      {!isLoggedIn && !isCoachLoggedIn ? (
        <LoginPage onLogin={handleLogin} onCoachLogin={handleCoachLogin} />
      ) : isCoachLoggedIn ? (
        <CoachDashboard onLogout={handleLogout} customWorkouts={customWorkouts} setCustomWorkouts={setCustomWorkouts} />
      ) : !currentUser ? (
        <UserSelection onUserSelect={handleUserSelect} />
      ) : (
        <WorkoutApp currentUser={currentUser} onLogout={handleLogout} onUserChange={handleUserChange} customWorkouts={customWorkouts} />
      )}
    </>
  );
}
