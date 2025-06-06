import React, { useState, useRef, useEffect } from 'react';
import { Camera, Play, Pause, RotateCcw, CheckCircle, Clock, Edit3, Zap, Target, TrendingUp, Plus } from 'lucide-react';

export default function WorkoutScannerApp() {
  const [workouts, setWorkouts] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [inputText, setInputText] = useState('');
  const [activeTimers, setActiveTimers] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('scanner');
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Cleanup video stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const startCamera = async () => {
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Force video to play
        await videoRef.current.play();
        streamRef.current = stream;
      }
      
      setIsScanning(true);
      showNotification('Camera ready 📸', 'success');
    } catch (error) {
      console.error('Camera error:', error);
      showNotification('Camera unavailable - use manual input', 'error');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const simulateOCR = () => {
    const demoText = "Bench Press 3x10\nSquats 4x12\nPush-ups 3x15\nDeadlift 5x5\nPull-ups 3x8";
    setInputText(demoText);
    parseWorkoutText(demoText);
    setActiveTab('workout');
  };

  const parseWorkoutText = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const parsedWorkouts = [];

    lines.forEach(line => {
      const workout = parseWorkoutLine(line.trim());
      if (workout) {
        parsedWorkouts.push(workout);
      }
    });

    if (parsedWorkouts.length > 0) {
      setWorkouts(parsedWorkouts);
      setCurrentWorkout({
        name: "Custom Workout",
        exercises: parsedWorkouts,
        totalExercises: parsedWorkouts.length,
        estimatedTime: parsedWorkouts.reduce((acc, w) => acc + (w.sets * (w.restTime + 30)), 0) / 60
      });
      showNotification(`${parsedWorkouts.length} exercises loaded! 💪`, 'success');
    } else {
      showNotification('Invalid format. Try: "Exercise 3x10"', 'error');
    }
  };

  const parseWorkoutLine = (line) => {
    const patterns = [
      /^(.+?)\s+(\d+)\s*[x*]\s*(\d+)$/i,
      /^(.+?)\s+(\d+)\s+sets?\s+of\s+(\d+)$/i,
    ];

    for (let pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        return {
          id: Date.now() + Math.random(),
          name: match[1].trim(),
          sets: parseInt(match[2]),
          reps: parseInt(match[3]),
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
    if (exercise.includes('bench') || exercise.includes('squat') || exercise.includes('deadlift')) {
      return 180;
    } else if (exercise.includes('curl') || exercise.includes('extension') || exercise.includes('raise')) {
      return 60;
    } else {
      return 90;
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
    if (workout && workout.completed + 1 < workout.sets) {
      startRestTimer(exerciseId, workout.restTime);
    } else {
      showNotification('Set complete! 🔥', 'success');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Status Bar */}
      <div className="bg-black/20 backdrop-blur-sm px-6 py-3 flex justify-between items-center text-white text-sm">
        <span className="font-medium">9:41 AM</span>
        <span className="font-bold text-lg">FitnessPro</span>
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
        }`}>
          <p className="font-medium text-center">{notification.message}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex bg-black/20 backdrop-blur-sm mx-4 my-4 rounded-2xl p-1">
        {[
          { id: 'scanner', label: 'Scanner', icon: Camera },
          { id: 'workout', label: 'Workout', icon: Zap },
          { id: 'progress', label: 'Progress', icon: TrendingUp }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'text-white/70'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="px-4 pb-20">
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Scan Your Workout</h1>
              <p className="text-white/70">Transform handwritten routines into digital workouts</p>
            </div>

            {/* Camera Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <div className="aspect-video bg-black/30 rounded-2xl mb-4 overflow-hidden relative">
                {isScanning ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    <div className="absolute inset-0 border-4 border-purple-400 rounded-2xl">
                      <div className="absolute top-4 left-4 right-4 h-1 bg-purple-400 rounded-full animate-pulse"></div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Camera size={48} className="text-white/50 mx-auto mb-2" />
                      <p className="text-white/70">Camera preview</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {!isScanning ? (
                  <button
                    onClick={startCamera}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 transition-all"
                  >
                    <Camera size={20} />
                    Start Camera
                  </button>
                ) : (
                  <>
                    <button
                      onClick={simulateOCR}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all"
                    >
                      <Target size={20} />
                      Scan Now
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-6 bg-red-500 text-white py-4 rounded-2xl font-semibold hover:bg-red-600 transition-all"
                    >
                      Stop
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Manual Input */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Edit3 size={24} className="text-purple-400" />
                <h3 className="text-xl font-bold text-white">Manual Entry</h3>
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter workout (e.g., 'Bench Press 3x10')"
                className="w-full bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-2xl p-4 mb-4 resize-none focus:outline-none focus:border-purple-400 transition-colors"
                rows={4}
              />
              
              <button
                onClick={() => parseWorkoutText(inputText)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all"
              >
                <Plus size={20} />
                Create Workout
              </button>
            </div>
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="space-y-6">
            {currentWorkout ? (
              <>
                {/* Workout Header */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-3xl p-6 border border-purple-400/30">
                  <h2 className="text-2xl font-bold text-white mb-2">{currentWorkout.name}</h2>
                  <div className="flex gap-4 text-sm text-white/70">
                    <span>{currentWorkout.totalExercises} exercises</span>
                    <span>~{Math.round(currentWorkout.estimatedTime)} min</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
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
                </div>

                {/* Exercise List */}
                <div className="space-y-4">
                  {workouts.map((workout, index) => (
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
                          <p className="text-white/60">{workout.sets} sets × {workout.reps} reps</p>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {workout.completed}/{workout.sets}
                          </div>
                          {activeTimers[workout.id] && (
                            <div className="text-orange-400 font-mono text-sm">
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
              </>
            ) : (
              <div className="text-center py-12">
                <Zap size={64} className="text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Active Workout</h3>
                <p className="text-white/60 mb-6">Scan or create a workout to get started</p>
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-purple-500/25 hover:-translate-y-0.5 transition-all"
                >
                  Create Workout
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <TrendingUp size={64} className="text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Your Progress</h2>
              <p className="text-white/60">Track your fitness journey</p>
            </div>

            {workouts.length > 0 ? (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Current Session</h3>
                <div className="space-y-3">
                  {workouts.map(workout => (
                    <div key={workout.id} className="flex justify-between items-center py-2">
                      <span className="text-white capitalize">{workout.name}</span>
                      <span className="text-purple-400 font-semibold">
                        {workout.completed}/{workout.sets} sets
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{getProgressPercentage()}%</div>
                    <div className="text-white/60">Overall Progress</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-white/60">Complete workouts to see progress</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
