// pages/index.js
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Play, RotateCcw, CheckCircle, Edit3, Zap, Target, TrendingUp, Plus, Eye, EyeOff, Lock, User, Shield, Calendar, Dumbbell, Clock, Trophy, Users, ChevronRight, Timer, Star } from 'lucide-react';
import Head from 'next/head';
import Tesseract from 'tesseract.js';

// Predefined users
const SYSTEM_USERS = [
  {
    id: 'akshay',
    name: 'Akshay',
    avatar: '💪',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'ravish',
    name: 'Ravish',
    avatar: '🔥',
    color: 'from-orange-500 to-red-500'
  }
];

// Predefined workouts for each day
const WEEKLY_WORKOUTS = {
  Monday: {
    name: "Chest & Triceps Blast",
    exercises: [
      "Bench Press 4x8",
      "Incline Dumbbell Press 3x10",
      "Chest Flyes 3x12",
      "Tricep Dips 3x12",
      "Close Grip Bench Press 3x10",
      "Tricep Extensions 3x15"
    ],
    focus: "Upper Body Push",
    duration: "45-60 min"
  },
  Tuesday: {
    name: "Back & Biceps Power",
    exercises: [
      "Deadlifts 4x6",
      "Pull-ups 3x8",
      "Barbell Rows 4x8",
      "Lat Pulldowns 3x10",
      "Bicep Curls 3x12",
      "Hammer Curls 3x10"
    ],
    focus: "Upper Body Pull",
    duration: "50-65 min"
  },
  Wednesday: {
    name: "Leg Day Domination",
    exercises: [
      "Squats 4x10",
      "Romanian Deadlifts 3x10",
      "Bulgarian Split Squats 3x12",
      "Leg Press 4x15",
      "Leg Curls 3x12",
      "Calf Raises 4x20"
    ],
    focus: "Lower Body",
    duration: "55-70 min"
  },
  Thursday: {
    name: "Shoulders & Core",
    exercises: [
      "Military Press 4x8",
      "Lateral Raises 3x12",
      "Rear Delt Flyes 3x12",
      "Arnold Press 3x10",
      "Planks 3x60 seconds",
      "Russian Twists 3x20"
    ],
    focus: "Shoulders & Core",
    duration: "40-50 min"
  },
  Friday: {
    name: "Full Body HIIT",
    exercises: [
      "Burpees 4x10",
      "Mountain Climbers 4x20",
      "Push-ups 3x15",
      "Jump Squats 4x12",
      "High Knees 4x30 seconds",
      "Plank Jacks 3x15"
    ],
    focus: "Cardio & Conditioning",
    duration: "30-40 min"
  },
  Saturday: {
    name: "Active Recovery",
    exercises: [
      "Light Yoga 20 minutes",
      "Walking 30 minutes",
      "Stretching 15 minutes",
      "Foam Rolling 10 minutes"
    ],
    focus: "Recovery & Mobility",
    duration: "60-75 min"
  },
  Sunday: {
    name: "Rest & Reflect",
    exercises: [
      "Meditation 15 minutes",
      "Light Stretching 20 minutes",
      "Meal Prep 60 minutes",
      "Plan Next Week 15 minutes"
    ],
    focus: "Mental & Preparation",
    duration: "90-120 min"
  }
};

// Login Component
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      showNotification('Please enter both username and password', 'error');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (username === 'Admintest' && password === 'Admin@123') {
        showNotification('Login successful! Welcome to Dire 🚀', 'success');
        setTimeout(() => {
          onLogin();
        }, 1500);
      } else {
        showNotification('Invalid credentials. Please try again.', 'error');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-black/20 backdrop-blur-sm px-6 py-3 flex justify-between items-center text-white text-sm">
        <span className="font-medium">
          {new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </span>
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
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Zap size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome to Dire</h1>
            <p className="text-white/70 text-lg">Secure access portal</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={24} className="text-purple-400" />
              <h2 className="text-xl font-bold text-white">Sign In</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-white/80 text-sm font-medium">Username</div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-white/40" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-white/80 text-sm font-medium">Password</div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-white/40" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    disabled={isLoading}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleLogin(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/70 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    Sign In
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-2xl">
              <p className="text-blue-200 text-sm text-center font-medium">Demo Credentials</p>
              <div className="mt-2 space-y-1 text-blue-200/80 text-xs text-center">
                <div>Username: <span className="font-mono text-blue-300">Admintest</span></div>
                <div>Password: <span className="font-mono text-blue-300">Admin@123</span></div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-white/50 text-sm">
              Powered by <span className="text-purple-400 font-semibold">Dire Security</span>
            </p>
          </div>
        </div>
      </div>

      <div className="fixed top-1/4 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-1/4 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>
  );
}

// User Selection Component
function UserSelection({ onUserSelect }) {
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleUserSelect = (user) => {
    showNotification(`Welcome ${user.name}! 👋`, 'success');
    setTimeout(() => {
      onUserSelect(user);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-black/20 backdrop-blur-sm px-6 py-3 flex justify-between items-center text-white text-sm">
        <span className="font-medium">
          {new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </span>
        <span className="font-bold text-lg">FitnessPro</span>
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
              <Users size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Select Your Profile</h1>
            <p className="text-white/70">Choose your account to continue</p>
          </div>

          <div className="space-y-4">
            {SYSTEM_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${user.color} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {user.name}
                    </h3>
                    <p className="text-white/60 text-sm">Tap to continue</p>
                  </div>
                  <ChevronRight size={24} className="text-white/40 group-hover:text-purple-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Workout Completion Component
function WorkoutCompletion({ currentUser, workoutData, onClose, onSaveLog }) {
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const handleSaveLog = () => {
    const logEntry = {
      user: currentUser.name,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      workout: workoutData.name,
      duration: formatDuration(workoutData.duration),
      totalExercises: workoutData.totalExercises,
      completedExercises: workoutData.completedExercises,
      completionRate: Math.round((workoutData.completedExercises / workoutData.totalExercises) * 100)
    };
    
    onSaveLog(logEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Workout Complete! 🎉</h2>
          <p className="text-white/70">Great job, {currentUser.name}!</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-black/20 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70">Duration</span>
              <span className="text-white font-bold">{formatDuration(workoutData.duration)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70">Exercises Completed</span>
              <span className="text-white font-bold">{workoutData.completedExercises}/{workoutData.totalExercises}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Completion Rate</span>
              <span className="text-green-400 font-bold">
                {Math.round((workoutData.completedExercises / workoutData.totalExercises) * 100)}%
              </span>
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-4">
            <div className="text-center">
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-white font-medium">Workout: {workoutData.name}</p>
              <p className="text-white/60 text-sm">{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all"
          >
            Skip Log
          </button>
          <button
            onClick={handleSaveLog}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all"
          >
            Save Log
          </button>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function WorkoutApp({ currentUser, onLogout, onUserChange }) {
  const [workouts, setWorkouts] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [activeTimers, setActiveTimers] = useState({});
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [workoutLogs, setWorkoutLogs] = useState([]);

  // Get current day
  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const currentDay = getCurrentDay();
  const todaysWorkout = WEEKLY_WORKOUTS[currentDay];

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const parseWorkoutLine = (line) => {
    const cleanedLine = line.toLowerCase().trim();
    const patterns = [
      /^(.+?)\s*(\d+)\s*[x*]\s*(\d+)$/,
      /^(.+?)\s*(\d+)\s+sets?\s+of\s+(\d+)$/,
      /^(.+?)\s*(\d+)\s*sets?\s*[\-–—]\s*(\d+)\s*reps?$/,
      /^(.+?)\s*(\d+)\s+(minutes?|seconds?)$/,
    ];

    for (let pattern of patterns) {
      const match = cleanedLine.match(pattern);
      if (match) {
        const isTimeBased = cleanedLine.includes('minute') || cleanedLine.includes('second');
        return {
          id: Date.now() + Math.random(),
          name: match[1].trim(),
          sets: isTimeBased ? 1 : parseInt(match[2], 10),
          reps: isTimeBased ? parseInt(match[2], 10) : parseInt(match[3], 10) || 1,
          restTime: getDefaultRestTime(match[1].trim()),
          completed: 0,
          isActive: false,
          weight: null
        };
      }
    }
    return null;
  };

  const getDefaultRestTime = (exerciseName) => {
    const exercise = exerciseName.toLowerCase();
    if (exercise.includes('bench') || exercise.includes('squat') || exercise.includes('deadlift') || exercise.includes('press')) {
      return 180;
    } else if (exercise.includes('curl') || exercise.includes('extension') || exercise.includes('raise') || exercise.includes('lunge')) {
      return 60;
    } else if (exercise.includes('run') || exercise.includes('jog') || exercise.includes('cardio') || exercise.includes('jump') || exercise.includes('burpee')) {
      return 30;
    }
    return 90;
  };

  const loadTodaysWorkout = () => {
    const parsedWorkouts = [];
    
    todaysWorkout.exercises.forEach(exercise => {
      const workout = parseWorkoutLine(exercise);
      if (workout) {
        parsedWorkouts.push(workout);
      }
    });

    if (parsedWorkouts.length > 0) {
      setWorkouts(parsedWorkouts);
      setCurrentWorkout({
        name: todaysWorkout.name,
        exercises: parsedWorkouts,
        totalExercises: parsedWorkouts.length,
        estimatedTime: todaysWorkout.duration,
        focus: todaysWorkout.focus
      });
      setWorkoutStartTime(Date.now());
      showNotification(`${todaysWorkout.name} loaded! 💪`, 'success');
    }
  };

  const startSet = (exerciseId) => {
    setWorkouts(prev => prev.map(w =>
      w.id === exerciseId ? { ...w, isActive: true } : w
    ));
  };

  const completeSet = (exerciseId) => {
    setWorkouts(prev => prev.map(w =>
      w.id === exerciseId ? {
        ...w,
        completed: Math.min(w.completed + 1, w.sets),
        isActive: false
      } : w
    ));

    const workout = workouts.find(w => w.id === exerciseId);
    if (workout) {
      if (workout.completed < workout.sets - 1) {
        startRestTimer(exerciseId, workout.restTime);
        showNotification('Set complete! Rest timer started.', 'success');
      } else {
        showNotification('Exercise complete! 🔥', 'success');
        
        // Check if all exercises are completed
        const updatedWorkouts = workouts.map(w =>
          w.id === exerciseId ? { ...w, completed: Math.min(w.completed + 1, w.sets) } : w
        );
        const allCompleted = updatedWorkouts.every(w => w.completed === w.sets);
        
        if (allCompleted) {
          setTimeout(() => {
            const workoutDuration = Math.floor((Date.now() - workoutStartTime) / 1000);
            const completedExercises = updatedWorkouts.filter(w => w.completed === w.sets).length;
            
            setShowCompletion(true);
            setCurrentWorkout(prev => ({
              ...prev,
              duration: workoutDuration,
              completedExercises: completedExercises
            }));
          }, 1000);
        }
      }
    }
  };

  const startRestTimer = (exerciseId, restTime) => {
    let timeLeft = restTime;
    const timerId = setInterval(() => {
      setActiveTimers(prev => ({
        ...prev,
        [exerciseId]: timeLeft
      }));

      timeLeft--;

      if (timeLeft < 0) {
        clearInterval(timerId);
        setActiveTimers(prev => {
          const newTimers = { ...prev };
          delete newTimers[exerciseId];
          return newTimers;
        });
        showNotification('Rest complete! Ready for next set 🚀', 'success');
      }
    }, 1000);
  };

  const resetExercise = (exerciseId) => {
    setWorkouts(prev => prev.map(w =>
      w.id === exerciseId ? { ...w, completed: 0, isActive: false } : w
    ));

    setActiveTimers(prev => {
      const newTimers = { ...prev };
      delete newTimers[exerciseId];
      return newTimers;
    });
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

  const handleSaveWorkoutLog = (logEntry) => {
    setWorkoutLogs(prev => [logEntry, ...prev]);
    showNotification('Workout logged successfully! 📊', 'success');
  };

  // Auto-load today's workout on component mount
  useEffect(() => {
    loadTodaysWorkout();
  }, []);

  return (
    <>
      <Head>
        <title>FitnessPro - AI Workout Scanner</title>
        <meta name="description" content="Transform handwritten routines into digital workouts with AI OCR scanning." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Status Bar */}
        <div className="bg-black/20 backdrop-blur-sm px-6 py-3 flex justify-between items-center text-white text-sm">
          <span className="font-medium">
            {new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </span>
          <span className="font-bold text-lg">FitnessPro</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onUserChange}
              className="text-blue-400 hover:text-blue-300 transition-colors text-xs"
            >
              Switch User
            </button>
            <button
              onClick={onLogout}
              className="text-red-400 hover:text-red-300 transition-colors text-xs"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-20 left-4 right-4 z-50 p-4 rounded-xl backdrop-blur-md border transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-500/20 border-green-400/30 text-green-100' :
            notification.type === 'error' ? 'bg-red-500/20 border-red-400/30 text-red-100' :
            'bg-blue-500/20 border-blue-400/30 text-blue-100'
          }`}>
            <p className="font-medium text-center">{notification.message}</p>
          </div>
        )}

        {/* User Info Bar */}
        <div className="px-4 pt-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${currentUser.color} rounded-full flex items-center justify-center text-lg`}>
              {currentUser.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Welcome back, {currentUser.name}!</h3>
              <p className="text-white/60 text-sm">Ready to crush today's workout?</p>
            </div>
            {workoutStartTime && (
              <div className="text-right">
                <div className="text-white/60 text-xs">Session Time</div>
                <div className="text-white font-mono text-sm">
                  {formatTime(Math.floor((Date.now() - workoutStartTime) / 1000))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Welcome Section */}
        <div className="px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Ready for {currentDay}? 🔥
            </h1>
            <p className="text-white/70 text-lg mb-6">
              Today's focus: <span className="text-purple-400 font-semibold">{todaysWorkout.focus}</span>
            </p>
          </div>

          {/* Today's Workout Card */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-3xl p-6 border border-purple-400/30 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Dumbbell size={24} className="text-purple-400" />
                <h2 className="text-2xl font-bold text-white">{todaysWorkout.name}</h2>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Clock size={16} />
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
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={loadTodaysWorkout}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 transition-all"
            >
              <Target size={20} />
              Start {currentDay}'s Workout
            </button>
          </div>

          {/* Exercise List */}
          {workouts.length > 0 && (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className={`bg-white/10 backdrop-blur-md rounded-2xl p-5 border transition-all duration-200 hover:translate-x-1 ${
                    workout.isActive
                      ? 'border-green-400/50 bg-green-500/10'
                      : 'border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white capitalize">{workout.name}</h3>
                      <p className="text-white/60">
                        {workout.sets} sets × {workout.reps} {workout.name.toLowerCase().includes('minutes') || workout.name.toLowerCase().includes('seconds') ? 'time' : 'reps'}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {workout.completed}/{workout.sets}
                      </div>
                      {activeTimers[workout.id] && (
                        <div className="text-orange-400 font-mono text-sm animate-pulse">
                          Rest: {formatTime(activeTimers[workout.id])}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Dots */}
                  <div className="flex gap-2 mb-4">
                    {[...Array(workout.sets)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          i < workout.completed
                            ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                            : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Controls */}
                  <div className="flex gap-3">
                    {workout.completed < workout.sets && (
                      <>
                        <button
                          onClick={() => startSet(workout.id)}
                          disabled={workout.isActive}
                          className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                            workout.isActive
                              ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                              : 'bg-blue-500 text-white shadow-lg hover:bg-blue-600 hover:-translate-y-0.5'
                          }`}
                        >
                          <Play size={16} />
                          {workout.isActive ? 'In Progress' : 'Start Set'}
                        </button>

                        <button
                          onClick={() => completeSet(workout.id)}
                          disabled={!workout.isActive}
                          className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 hover:-translate-y-0.5 transition-all"
                        >
                          <CheckCircle size={16} />
                          Complete
                        </button>
                      </>
                    )}

                    {workout.completed === workout.sets && (
                      <div className="flex-1 bg-green-500/20 text-green-400 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border border-green-400/30">
                        <CheckCircle size={16} />
                        Completed! 🎉
                      </div>
                    )}

                    <button
                      onClick={() => resetExercise(workout.id)}
                      className="px-4 bg-white/10 text-white py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Workout Logs Section */}
          {workoutLogs.length > 0 && (
            <div className="mt-8">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy size={24} className="text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">Recent Workouts</h3>
                </div>
                <div className="space-y-3">
                  {workoutLogs.slice(0, 3).map((log, index) => (
                    <div key={index} className="bg-black/20 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{log.workout}</span>
                        <span className="text-green-400 font-bold">{log.completionRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm text-white/60">
                        <span>{log.user} • {log.date}</span>
                        <span>{log.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Workout Completion Modal */}
        {showCompletion && currentWorkout && (
          <WorkoutCompletion
            currentUser={currentUser}
            workoutData={currentWorkout}
            onClose={() => setShowCompletion(false)}
            onSaveLog={handleSaveWorkoutLog}
          />
        )}
      </div>
    </>
  );
}

// Main Export Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleUserSelect = (user) => {
    setCurrentUser(user);
  };

  const handleUserChange = () => {
    setCurrentUser(null);
  };

  return (
    <>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
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
