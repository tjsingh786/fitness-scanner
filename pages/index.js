// pages/index.js - PART 1 (First Half)
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Play, RotateCcw, CheckCircle, Edit3, Zap, Target, TrendingUp, Plus } from 'lucide-react';
import Head from 'next/head';
import Script from 'next/script';

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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [tesseractLoaded, setTesseractLoaded] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition and Tesseract
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText(prev => prev + ' ' + transcript);
          showNotification('Voice input received! 🎉', 'success');
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          showNotification('Voice recognition error', 'error');
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
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

  const startVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setIsListening(true);
        recognitionRef.current.start();
        showNotification('Listening... 🎤', 'info');
      } catch (error) {
        showNotification('Voice input not supported', 'error');
        setIsListening(false);
      }
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      showNotification('🔊 Speaking...', 'info');
    } else {
      showNotification('Text-to-speech not supported', 'error');
    }
  };

  const readWorkoutAloud = () => {
    if (inputText.trim()) {
      const workoutText = inputText.replace(/(\d+)[x*](\d+)/g, '$1 sets of $2 reps');
      speakText(`Your workout: ${workoutText}`);
    } else {
      speakText('No workout text to read');
    }
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
      if (tesseractLoaded && window.Tesseract) {
        showNotification('Running OCR on your image...', 'info');
        
        const { data: { text } } = await window.Tesseract.recognize(file, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text') {
              const progress = Math.round(m.progress * 100);
              showNotification(`Reading text... ${progress}%`, 'info');
            }
          }
        });
        
        console.log('OCR Result from upload:', text);
        
        if (text.trim()) {
          setInputText(text.trim());
          parseWorkoutText(text.trim());
          setActiveTab('workout');
          showNotification('✅ Photo scanned successfully!', 'success');
          
          // Count exercises and speak result
          const exerciseCount = countExercises(text.trim());
          setTimeout(() => {
            speakText(`Photo processed successfully! Found ${exerciseCount} exercises in your workout.`);
          }, 1000);
        } else {
          showNotification('No text found in image. Try a clearer photo.', 'error');
          speakText('No workout text found. Please try a clearer photo.');
        }
      } else {
        // Fallback demo mode if Tesseract not loaded
        showNotification('OCR not ready. Using demo scan...', 'info');
        setTimeout(() => {
          let demoText;
          if (file.name.toLowerCase().includes('cardio')) {
            demoText = "Running 30 minutes\nJumping Jacks 3x20\nBurpees 3x10\nMountain Climbers 3x15";
          } else if (file.name.toLowerCase().includes('leg')) {
            demoText = "Squats 4x12\nLunges 3x10\nCalf Raises 3x15\nLeg Press 4x10";
          } else {
            demoText = "Bench Press 3x10\nSquats 4x12\nPush-ups 3x15\nDeadlift 5x5\nPull-ups 3x8";
          }
          
          setInputText(demoText);
          parseWorkoutText(demoText);
          setActiveTab('workout');
          showNotification(`✅ Demo scan complete for ${file.name}!`, 'success');
          
          const exerciseCount = demoText.split('\n').length;
          speakText(`Demo scan complete! Found ${exerciseCount} exercises.`);
        }, 2000);
      }
    } catch (error) {
      console.error('Upload OCR Error:', error);
      showNotification('Failed to process image. Try again.', 'error');
      speakText('Failed to process image. Please try again.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const countExercises = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.filter(line => {
      const patterns = [
        /\d+\s*[x*]\s*\d+/i,
        /\d+\s+sets?\s+of\s+\d+/i,
        /\d+\s*sets?\s*[\-–]\s*\d+\s*reps?/i,
      ];
      return patterns.some(pattern => pattern.test(line));
    }).length;
  };

// CONTINUE WITH PART 2...

// pages/index.js - PART 2 (Second Half)
// CONTINUE FROM PART 1...

  const captureAndScan = async () => {
    if (!videoRef.current) {
      showNotification('Camera not available', 'error');
      return;
    }

    setIsProcessing(true);
    showNotification('Capturing image... 📸', 'info');

    try {
      if (tesseractLoaded && window.Tesseract) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob(async (blob) => {
          try {
            showNotification('Running OCR on captured image...', 'info');
            
            const { data: { text } } = await window.Tesseract.recognize(blob, 'eng', {
              logger: m => {
                if (m.status === 'recognizing text') {
                  const progress = Math.round(m.progress * 100);
                  showNotification(`Reading text... ${progress}%`, 'info');
                }
              }
            });
            
            console.log('Camera OCR Result:', text);
            
            if (text.trim()) {
              setInputText(text.trim());
              parseWorkoutText(text.trim());
              setActiveTab('workout');
              showNotification('✅ Text captured successfully!', 'success');
              
              const exerciseCount = countExercises(text.trim());
              setTimeout(() => {
                speakText(`Camera scan complete! Found ${exerciseCount} exercises.`);
              }, 1000);
            } else {
              showNotification('No text detected. Position camera closer to text.', 'error');
              speakText('No workout text detected. Please position camera closer to the text.');
            }
          } catch (ocrError) {
            console.error('Camera OCR Error:', ocrError);
            showNotification('Scan failed. Try uploading a photo instead.', 'error');
            speakText('Camera scan failed. Try uploading a photo instead.');
          } finally {
            setIsProcessing(false);
          }
        }, 'image/jpeg', 0.95);
      } else {
        // Demo mode fallback
        setTimeout(() => {
          const demoText = "Bench Press 3x10\nSquats 4x12\nPush-ups 3x15\nDeadlift 5x5\nPull-ups 3x8";
          setInputText(demoText);
          parseWorkoutText(demoText);
          setActiveTab('workout');
          setIsProcessing(false);
          speakText('Demo scan complete! Found 5 exercises.');
        }, 1500);
      }
    } catch (error) {
      console.error('Capture error:', error);
      showNotification('Failed to capture image', 'error');
      setIsProcessing(false);
    }
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
        estimatedTime: Math.round(parsedWorkouts.reduce((acc, w) => acc + (w.sets * (w.restTime + 30)), 0) / 60)
      });
      showNotification(`${parsedWorkouts.length} exercises loaded! 💪`, 'success');
      
      const exerciseNames = parsedWorkouts.map(w => w.name).join(', ');
      setTimeout(() => {
        speakText(`Workout created with ${parsedWorkouts.length} exercises: ${exerciseNames}`);
      }, 500);
    } else {
      showNotification('Invalid format. Try: "Exercise 3x10"', 'error');
      speakText('Invalid workout format. Please try again.');
    }
  };

  const parseWorkoutLine = (line) => {
    const patterns = [
      /^(.+?)\s+(\d+)\s*[x*]\s*(\d+)$/i,
      /^(.+?)\s+(\d+)\s+sets?\s+of\s+(\d+)$/i,
      /^(.+?)\s+(\d+)\s*sets?\s*[\-–]\s*(\d+)\s*reps?$/i,
      /^(.+?)\s+(\d+)\s+minutes?$/i, // For cardio
    ];

    for (let pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        return {
          id: Date.now() + Math.random(),
          name: match[1].trim(),
          sets: parseInt(match[2]),
          reps: parseInt(match[3]) || 1, // For time-based exercises
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
    
    const workout = workouts.find(w => w.id === exerciseId);
    if (workout) {
      speakText(`Starting ${workout.name}. ${workout.reps} reps, go!`);
    }
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
      speakText(`Set complete! Rest for ${workout.restTime} seconds.`);
    } else {
      showNotification('Exercise complete! 🔥', 'success');
      speakText(`Excellent! ${workout.name} completed!`);
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
        speakText('Rest complete! Ready for your next set!');
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
  const loadDemoWorkout = () => {
    const demoText = "Bench Press 3x10\nSquats 4x12\nPush-ups 3x15\nDeadlift 5x5\nPull-ups 3x8";
    setInputText(demoText);
    parseWorkoutText(demoText);
    setActiveTab('workout');
    speakText('Demo workout loaded with 5 exercises!');
  };

  return (
    <>
      <Head>
        <title>FitnessPro - AI Workout Scanner</title>
        <meta name="description" content="Transform handwritten workouts into digital routines with AI OCR scanning, voice commands, and text-to-speech guidance" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script 
        src="https://unpkg.com/tesseract.js@v4.1.1/dist/tesseract.min.js"
        onLoad={() => setTesseractLoaded(true)}
        strategy="beforeInteractive"
      />

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
                <p className="text-white/50 text-sm mt-2">✨ With voice commands and text-to-speech!</p>
              </div>

              {/* Demo Quick Start */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-3xl p-6 border border-orange-400/30">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white mb-2">🚀 Quick Demo</h3>
                  <p className="text-white/70 mb-4">Try the app instantly with a sample workout</p>
                  <button
                    onClick={loadDemoWorkout}
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
                          {tesseractLoaded ? 'OCR Ready' : 'Loading OCR...'}
                        </p>
                      </div>
                    </div>
                  )}

                  {isScanning && (
                    <div className="absolute inset-0 border-4 border-purple-400 rounded-2xl pointer-events-none">
                      <div className="absolute top-4 left-4 right-4 h-1 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-center">
                        <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                          {tesseractLoaded ? 'Point camera at workout text' : 'Loading OCR...'}
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
                        disabled={isUploading}
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
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                      >
                        <Target size={20} />
                        {isProcessing ? 'Scanning...' : tesseractLoaded ? 'Scan Text' : 'Loading OCR...'}
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

              {/* Manual Input with Voice */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <Edit3 size={24} className="text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Manual Entry</h3>
                  <div className="ml-auto flex gap-2">
                    <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      🎤 Voice
                    </div>
                    <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                      🔊 TTS
                    </div>
                  </div>
                </div>
                
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter workout (e.g., 'Bench Press 3x10') or use voice input"
                  className="w-full bg-black/30 text-white placeholder-white/50 border border-white/20 rounded-2xl p-4 mb-4 resize-none focus:outline-none focus:border-purple-400 transition-colors"
                  rows={4}
                />
                
                {/* Voice and TTS Controls */}
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={isListening ? stopVoiceInput : startVoiceInput}
                    className={`flex-1 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all ${
                      isListening 
                        ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-green-500/25 hover:-translate-y-0.5'
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                    {isListening ? '🔴 Stop Listening' : '🎤 Voice Input'}
                  </button>
                  
                  <button
                    onClick={readWorkoutAloud}
                    disabled={isSpeaking || !inputText.trim()}
                    className={`flex-1 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 ${
                      isSpeaking 
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-indigo-500/25 hover:-translate-y-0.5'
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                    </svg>
                    {isSpeaking ? '🔊 Speaking...' : '🔊 Read Aloud'}
                  </button>
                </div>
                
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
                    <h2 className="text-2xl font-bold text-white mb-2">{currentWorkout.name}</h2>
                    <div className="flex gap-4 text-sm text-white/70">
                      <span>{currentWorkout.totalExercises} exercises</span>
                      <span>~{currentWorkout.estimatedTime} min</span>
                      <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">🎙️ Voice Enabled</span>
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
                            <p className="text-white/60">{workout.sets} sets × {workout.reps} reps</p>
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
                      onClick={loadDemoWorkout}
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
                      <div className="text-3xl font-bold text-white">{getProgressPercentage()}%</div>
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
                    onClick={loadDemoWorkout}
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
        {!tesseractLoaded && (
          <div className="fixed bottom-4 left-4 right-4 bg-blue-500/20 backdrop-blur-md rounded-2xl p-3 border border-blue-400/30 text-center">
            <p className="text-blue-200 text-sm">
              📦 Loading OCR engine... Demo mode available meanwhile!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
