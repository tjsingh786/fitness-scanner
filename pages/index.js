// pages/index.js
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Play, RotateCcw, CheckCircle, Edit3, Zap, Target, TrendingUp, Plus, Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import Head from 'next/head';
import Tesseract from 'tesseract.js';

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

    // Simulate loading delay
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
      {/* Status Bar */}
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

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-20 left-4 right-4 z-50 p-4 rounded-xl backdrop-blur-md border transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500/20 border-green-400/30 text-green-100' :
          notification.type === 'error' ? 'bg-red-500/20 border-red-400/30 text-red-100' :
          'bg-blue-500/20 border-blue-400/30 text-blue-100'
        }`} style={{ willChange: 'transform, opacity' }}>
          <p className="font-medium text-center">{notification.message}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Zap size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome to Dire</h1>
            <p className="text-white/70 text-lg">Secure access portal</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={24} className="text-purple-400" />
              <h2 className="text-xl font-bold text-white">Sign In</h2>
            </div>

            <div className="space-y-6">
              {/* Username Field */}
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

              {/* Password Field */}
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

              {/* Login Button */}
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

            {/* Demo Credentials Hint */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-2xl">
              <p className="text-blue-200 text-sm text-center font-medium">
                Demo Credentials
              </p>
              <div className="mt-2 space-y-1 text-blue-200/80 text-xs text-center">
                <div>Username: <span className="font-mono text-blue-300">Admintest</span></div>
                <div>Password: <span className="font-mono text-blue-300">Admin@123</span></div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/50 text-sm">
              Powered by <span className="text-purple-400 font-semibold">Dire Security</span>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-1/4 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-1/4 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>
  );
}

// Main App Component (Your existing WorkoutScannerApp)
function WorkoutScannerApp({ onLogout }) {
  // All your existing state and functions here...
  const [workouts, setWorkouts] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [inputText, setInputText] = useState('');
  const [activeTimers, setActiveTimers] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('scanner');
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [tesseractReady, setTesseractReady] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Add all your existing functions here (recognizeTextWithTesseract, parseWorkoutText, etc.)
  // I'll include just a few key ones for space...

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const loadDemoWorkout = (reason = '') => {
    console.log(`Loading demo workout. Reason: ${reason}`);
    const demoText = "Bench Press 3*10\nSquats 4*12\nPush-ups 3*15\nDeadlift 5*5\nPull-ups 3*8";
    setInputText(demoText);
    // parseWorkoutText(demoText); // Add your parsing logic
    setActiveTab('workout');
    showNotification('Demo workout loaded!', 'info');
  };

  return (
    <>
      <Head>
        <title>FitnessPro - AI Workout Scanner</title>
        <meta name="description" content="Transform handwritten routines into digital workouts with AI OCR scanning." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Status Bar with Logout */}
        <div className="bg-black/20 backdrop-blur-sm px-6 py-3 flex justify-between items-center text-white text-sm">
          <span className="font-medium">
            {new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </span>
          <span className="font-bold text-lg">FitnessPro</span>
          <button
            onClick={onLogout}
            className="text-red-400 hover:text-red-300 transition-colors text-xs"
          >
            Logout
          </button>
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

        {/* Your existing app content */}
        <div className="px-4 pb-20">
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to FitnessPro</h1>
            <p className="text-white/70">You're now logged in!</p>
            <button
              onClick={() => loadDemoWorkout('User clicked demo')}
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-purple-500/25 hover:-translate-y-0.5 transition-all"
            >
              Load Demo Workout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Main Export Component with Login State Management
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <WorkoutScannerApp onLogout={handleLogout} />
      )}
    </>
  );
}
