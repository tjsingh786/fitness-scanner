// pages/index.js
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Play, RotateCcw, CheckCircle, Edit3, Zap, Target, TrendingUp, Plus } from 'lucide-react';
import Head from 'next/head';
import Tesseract from 'tesseract.js'; // Import Tesseract.js directly

export default function WorkoutScannerApp() {
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

  // --- OCR Utility Function (Integrated) ---
  const recognizeTextWithTesseract = async (image) => {
    try {
      const { data: { text } } = await Tesseract.recognize(
        image,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text' && m.progress) {
              const progress = Math.round(m.progress * 100);
              showNotification(`Reading text... ${progress}%`, 'info');
            } else if (m.status === 'loading tesseract core') {
              showNotification(`Loading OCR engine...`, 'info');
            } else if (m.status === 'loading language traineddata') {
              showNotification(`Loading language data...`, 'info');
            }
            console.log(m); // Keep this for detailed Tesseract debugging
          }
        }
      );
      console.log("RAW OCR Result:", text); // <-- Crucial for debugging!
      return text;
    } catch (error) {
      console.error("Error during OCR recognition:", error);
      return null;
    }
  };


  // --- PARSING LOGIC: Adjusted to fit existing parseWorkoutText ---
  const parseWorkoutText = (text) => {
    if (!text || text.trim() === '') {
      showNotification('No text to parse.', 'error');
      setWorkouts([]);
      setCurrentWorkout(null);
      return;
    }

    const lines = text.split('\n').filter(line => line.trim());
    const parsedWorkouts = [];

    lines.forEach(line => {
      const workout = parseWorkoutLine(line.trim());
      if (workout) {
        parsedWorkouts.push(workout);
      } else {
        // Log lines that failed to parse for debugging
        console.warn(`Line failed to parse: "${line}"`);
      }
    });

    if (parsedWorkouts.length > 0) {
      setWorkouts(parsedWorkouts);
      setCurrentWorkout({
        name: "Scanned Workout", // Default name for scanned workouts
        exercises: parsedWorkouts,
        totalExercises: parsedWorkouts.length,
        estimatedTime: Math.round(parsedWorkouts.reduce((acc, w) => acc + (w.sets * (w.restTime + 30)), 0) / 60)
      });
      showNotification(`${parsedWorkouts.length} exercises loaded! 💪`, 'success');

    } else {
      showNotification('No valid workout lines found. Try format: "Exercise 3x10"', 'error');
    }
  };

  const parseWorkoutLine = (line) => {
    // Step 1: Aggressive cleaning of the line before pattern matching
    // Convert to lowercase for case-insensitivity in regex matching
    let cleanedLine = line.toLowerCase();
    // Remove zero-width spaces and other non-printable characters that OCR might introduce
    cleanedLine = cleanedLine.replace(/[\u200B-\u200D\uFEFF]/g, '');
    // Remove specific leading non-alphanumeric chars that might be bullet points or noise
    cleanedLine = cleanedLine.replace(/^[^\w\d\s]*/, '');
    // Remove common punctuation/symbols that are not part of the set/rep scheme (like parentheses)
    cleanedLine = cleanedLine.replace(/[()\[\]{}.!?,;:"']/g, ''); // Added . ! ? , ; : " '
    // Replace multiple spaces with single space and trim leading/trailing whitespace
    cleanedLine = cleanedLine.replace(/\s+/g, ' ').trim();

    // Example of expected cleaned input from handwritten:
    // "push-press 3x3"
    // "db flat bench 4x4"
    // "tricep overhead ext 3x12"
    // "military press 3x5"

    // Patterns are ordered from most common/specific to least specific.
    const patterns = [
      // Pattern 1: ExerciseName SetsX/Sets*Reps (e.g., "Bench Press 3x10", "Lunges 5*10")
      // Captures: Group 1 (Exercise Name), Group 2 (Sets), Group 3 (Reps)
      // `.+?` non-greedy match for exercise name, `\s*` for flexible whitespace
      /^(.+?)\s*(\d+)\s*[x*]\s*(\d+)$/,

      // Pattern 2: ExerciseName Sets of Reps (e.g., "Squats 3 sets of 12")
      // Covers variations like "set" or "sets"
      /^(.+?)\s*(\d+)\s+sets?\s+of\s+(\d+)$/,

      // Pattern 3: ExerciseName Sets - Reps (e.g., "Deadlift 3 sets - 5 reps")
      // Handles different dash characters (hyphen, en-dash, em-dash)
      /^(.+?)\s*(\d+)\s*sets?\s*[\-–—]\s*(\d+)\s*reps?$/,

      // Pattern 4: ExerciseName Duration (e.g., "Running 30 minutes")
      /^(.+?)\s*(\d+)\s+minutes?$/,
    ];

    for (let pattern of patterns) {
      const match = cleanedLine.match(pattern);
      if (match) {
        const isTimeBased = cleanedLine.includes('minutes'); // Check against cleaned line
        return {
          id: Date.now() + Math.random(),
          name: match[1].trim(), // Trim potential extra spaces from captured name
          sets: isTimeBased ? 1 : parseInt(match[2], 10), // For time-based, consider 1 set
          reps: isTimeBased ? parseInt(match[2], 10) : parseInt(match[3], 10) || 1, // reps become minutes for time-based
          restTime: getDefaultRestTime(match[1].trim()), // Use the original matched name for rest time logic
          completed: 0,
          isActive: false,
          weight: null
        };
      }
    }
    return null; // No match found
  };


  // Initialize Tesseract.js
  useEffect(() => {
    setTesseractReady(true);
  }, []);

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
      console.log('Starting camera...');

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      console.log('Stream obtained:', stream);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        setTimeout(async () => {
          try {
            await videoRef.current.play();
            console.log('Video playing successfully');
          } catch (playError) {
            console.log('Play error, trying again...', playError);
            setTimeout(() => {
              videoRef.current.play().catch(console.error);
            }, 500);
          }
        }, 100);
      }

      setIsScanning(true);
      showNotification('Camera started! 📸', 'success');

    } catch (error) {
      console.error('Camera error:', error);
      showNotification('Camera unavailable - check permissions', 'error');
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

  const uploadPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('Please select an image file', 'error');
      return;
    }

    setIsUploading(true);
    showNotification('Processing image... 📖', 'info');

    try {
      const text = await recognizeTextWithTesseract(file);

      if (text && text.trim()) {
        setInputText(text.trim());
        parseWorkoutText(text.trim());
        setActiveTab('workout');
        showNotification('✅ Photo scanned successfully!', 'success');
      } else {
        showNotification('No text found in image. Try a clearer photo.', 'error');
        loadDemoWorkout('No text found from upload');
      }
    } catch (error) {
      console.error('Upload OCR Error:', error);
      showNotification('Failed to process image. Try again.', 'error');
      loadDemoWorkout('OCR processing error on upload');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const countExercises = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    let count = 0;
    lines.forEach(line => {
      // Use the parsing logic to determine if it's a valid exercise line
      if (parseWorkoutLine(line)) {
        count++;
      }
    });
    return count;
  };


  const captureAndScan = async () => {
    if (!videoRef.current) {
      showNotification('Camera not available', 'error');
      return;
    }

    setIsProcessing(true);
    showNotification('Capturing image... 📸', 'info');

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      canvas.toBlob(async (blob) => {
        try {
          showNotification('Running OCR on captured image...', 'info');

          const text = await recognizeTextWithTesseract(blob);

          if (text && text.trim()) {
            setInputText(text.trim());
            parseWorkoutText(text.trim());
            setActiveTab('workout');
            showNotification('✅ Text captured successfully!', 'success');
          } else {
            showNotification('No text detected. Position camera closer to text.', 'error');
            loadDemoWorkout('No text found from camera');
          }
        } catch (ocrError) {
          console.error('Camera OCR Error:', ocrError);
          showNotification('Scan failed. Try uploading a photo instead.', 'error');
          loadDemoWorkout('Camera OCR processing error');
        } finally {
          setIsProcessing(false);
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Capture error:', error);
      showNotification('Failed to capture image', 'error');
      setIsProcessing(false);
      loadDemoWorkout('Failed to capture image');
    }
  };


  const getDefaultRestTime = (exerciseName) => {
    const exercise = exerciseName.toLowerCase();
    if (exercise.includes('bench') || exercise.includes('squat') || exercise.includes('deadlift') || exercise.includes('press')) {
      return 180;
    } else if (exercise.includes('curl') || exercise.includes('extension') || exercise.includes('raise') || exercise.includes('lunge')) {
      return 60;
    } else if (exercise.includes('run') || exercise.includes('jog') || exercise.includes('cardio') || exercise.includes('jump')) {
      return 0;
    }
    else {
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
    if (workout) {
      if (workout.completed < workout.sets) {
        startRestTimer(exerciseId, workout.restTime);
        showNotification('Set complete! Rest timer started.', 'success');
      } else {
        showNotification('Exercise complete! 🔥', 'success');
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

  // Quick demo workout function
  const loadDemoWorkout = (reason = '') => {
    console.log(`Loading demo workout. Reason: ${reason}`);
    const demoText = "Bench Press 3*10\nSquats 4*12\nPush-ups 3*15\nDeadlift 5*5\nPull-ups 3*8";
    setInputText(demoText);
    parseWorkoutText(demoText);
    setActiveTab('workout');
    showNotification('Demo workout loaded!', 'info');
  };

  // NEW: Reset All Workouts Function
  const resetAllWorkouts = () => {
    setWorkouts([]); // Clear the main workouts array
    setCurrentWorkout(null); // Clear the current workout object
    setInputText(''); // Clear any text in the manual input box
    setActiveTimers({}); // Clear any active timers
    showNotification('All workouts reset! Start a new one.', 'info');
    setActiveTab('scanner'); // Optionally navigate back to the scanner tab
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
        <canvas ref={canvasRef} style={{ display: 'none' }} />

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

              {/* Demo Quick Start */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-3xl p-6 border border-orange-400/30">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white mb-2">🚀 Quick Demo</h3>
                  <p className="text-white/70 mb-4">Try the app instantly with a sample workout</p>
                  <button
                    onClick={() => loadDemoWorkout('User clicked Quick Demo')}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all"
                  >
                    Load Demo Workout
                  </button>
                </div>
              </div>

              {/* Camera Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <div className="aspect-video bg-black/30 rounded-2xl mb-4 overflow-hidden relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    controls={false}
                    className="w-full h-full object-cover"
                    style={{
                      display: isScanning ? 'block' : 'none',
                      backgroundColor: '#1a1a1a',
                      minWidth: '100%',
                      minHeight: '100%'
                    }}
                  />

                  {!isScanning && (
                    <div className="flex items-center justify-center h-full absolute inset-0">
                      <div className="text-center">
                        <Camera size={48} className="text-white/50 mx-auto mb-2" />
                        <p className="text-white/70">Camera preview</p>
                        <p className="text-white/50 text-sm mt-1">
                          {tesseractReady ? 'OCR Ready' : 'Initializing OCR...'}
                        </p>
                      </div>
                    </div>
                  )}

                  {isScanning && (
                    <div className="absolute inset-0 border-4 border-purple-400 rounded-2xl pointer-events-none">
                      <div className="absolute top-4 left-4 right-4 h-1 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-center">
                        <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                          {tesseractReady ? 'Point camera at workout text' : 'Loading OCR...'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mb-4">
                  {!isScanning ? (
                    <>
                      <button
                        onClick={startCamera}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 transition-all"
                      >
                        <Camera size={20} />
                        Start Camera
                      </button>

                      <button
                        onClick={uploadPhoto}
                        disabled={isUploading || !tesseractReady}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="9" cy="9" r="2"/>
                          <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                        </svg>
                        {isUploading ? 'Processing...' : 'Upload Photo'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={captureAndScan}
                        disabled={isProcessing || !tesseractReady}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                      >
                        <Target size={20} />
                        {isProcessing ? 'Scanning...' : 'Scan Text'}
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

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
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
                  placeholder="Enter workout (e.g., 'Bench Press 3*10' or 'Running 30 minutes')"
                  className="w-full bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-2xl p-4 mb-4 resize-none focus:outline-none focus:border-purple-400 transition-colors"
                  rows={4}
                />

                <button
                  onClick={() => parseWorkoutText(inputText)}
                  disabled={!inputText.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50"
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
                    <div className="flex justify-between items-center mb-2"> {/* Added flex container */}
                      <h2 className="text-2xl font-bold text-white">{currentWorkout.name}</h2>
                      <button
                        onClick={resetAllWorkouts}
                        className="bg-red-500/20 text-red-300 px-4 py-2 rounded-xl font-medium text-sm hover:bg-red-500/30 transition-colors border border-red-400/30"
                      >
                        Reset All
                      </button>
                    </div>
                    <div className="flex gap-4 text-sm text-white/70">
                      <span>{currentWorkout.totalExercises} exercises</span>
                      <span>~{currentWorkout.estimatedTime} min</span>
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
                              {workout.sets} sets × {workout.reps} {workout.name.toLowerCase().includes('minutes') ? 'minutes' : 'reps'}
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
                </>
              ) : (
                <div className="text-center py-12">
                  <Zap size={64} className="text-white/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Active Workout</h3>
                  <p className="text-white/60 mb-6">Scan or create a workout to get started</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setActiveTab('scanner')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-purple-500/25 hover:-translate-y-0.5 transition-all"
                    >
                      Create Workout
                    </button>
                    <button
                      onClick={() => loadDemoWorkout('No active workout, user clicked Load Demo')}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all"
                    >
                      Load Demo
                    </button>
                  </div>
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
                      <div className="text-3xl font-bold text-green-400">{getProgressPercentage()}%</div>
                      <div className="text-white/60">Overall Progress</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-black/20 rounded-2xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {workouts.reduce((acc, w) => acc + w.completed, 0)}
                      </div>
                      <div className="text-white/60 text-sm">Sets Completed</div>
                    </div>
                    <div className="bg-black/20 rounded-2xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {workouts.filter(w => w.completed === w.sets).length}
                      </div>
                      <div className="text-white/60 text-sm">Exercises Done</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-white/60 mb-4">Complete workouts to see progress</div>
                  <button
                    onClick={() => loadDemoWorkout('No progress, user clicked Try Demo Workout')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-purple-500/25 hover:-translate-y-0.5 transition-all"
                  >
                    Try Demo Workout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Help */}
        {!tesseractReady && (
          <div className="fixed bottom-4 left-4 right-4 bg-blue-500/20 backdrop-blur-md rounded-2xl p-3 border border-blue-400/30 text-center">
            <p className="text-blue-200 text-sm">
              📦 Initializing OCR engine... This might take a moment on first load!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
