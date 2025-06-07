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

  // ... All your logic functions remain unchanged (as in your code) ...

  // (All your useEffect, showNotification, startCamera, stopCamera, etc...)

  // ... (All your functions here, unchanged) ...

  // (For brevity, not repeating all logic functions here, since you said not to change logic)

  // --- JSX Render ---
  return (
    <>
      <Head>
        <title>FitnessPro - AI Workout Scanner</title>
      </Head>
      <Script
        src="https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js"
        onLoad={() => setTesseractLoaded(true)}
        strategy="beforeInteractive"
      />

      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black py-8 px-2 sm:px-0">
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-white/50 text-xs font-mono">
            {new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </span>
          <span className="text-white font-bold text-lg tracking-wide">FitnessPro</span>
          <span className="text-xs text-white/40">AI</span>
        </div>

        {/* Notification */}
        {notification.show && (
          <div
            className={`mb-4 py-3 px-6 rounded-xl font-semibold shadow-lg text-center transition-all
              ${
                notification.type === 'success'
                  ? 'bg-green-500/90 text-white'
                  : notification.type === 'error'
                  ? 'bg-red-500/90 text-white'
                  : 'bg-purple-700/80 text-white'
              }`}
          >
            {notification.message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'scanner', label: 'Scanner', icon: Camera },
            { id: 'workout', label: 'Workout', icon: Zap },
            { id: 'progress', label: 'Progress', icon: TrendingUp },
          ].map((tab) => {
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
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'scanner' && (
            <div>
              {/* Hero Section */}
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Scan Your Workout</h1>
                <p className="text-white/70 mb-2">
                  Transform handwritten routines into digital workouts
                </p>
                <p className="text-white/50 text-sm">✨ With voice commands and text-to-speech!</p>
              </div>

              {/* Demo Quick Start */}
              <div className="mb-8 flex flex-col items-center">
                <div className="bg-gradient-to-r from-orange-500/90 to-pink-500/90 text-white px-6 py-4 rounded-2xl shadow-lg flex flex-col items-center mb-2">
                  <span className="text-lg font-bold mb-1">🚀 Quick Demo</span>
                  <span className="text-sm mb-2">Try the app instantly with a sample workout</span>
                  <button
                    onClick={loadDemoWorkout}
                    className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-2 rounded-xl shadow mt-1 transition-all"
                  >
                    Load Demo Workout
                  </button>
                </div>
              </div>

              {/* Camera Section */}
              <div className="mb-8">
                <div className="bg-black/30 rounded-2xl p-4 border border-white/10 mb-4">
                  <div className="flex flex-col items-center">
                    <video
                      ref={videoRef}
                      className="rounded-xl w-full max-w-md aspect-video bg-black mb-2"
                      autoPlay
                      playsInline
                      style={{ display: isScanning ? 'block' : 'none' }}
                    />
                    <canvas
                      ref={canvasRef}
                      style={{ display: 'none' }}
                    />
                    {!isScanning && (
                      <div className="text-center text-white/60 text-sm mb-2">
                        <div className="mb-1">Camera preview</div>
                        <div>
                          {tesseractLoaded ? 'OCR Ready' : 'Loading OCR...'}
                        </div>
                      </div>
                    )}
                    {isScanning && (
                      <div className="text-center text-white/60 text-sm mb-2">
                        <div className="mb-1">
                          {tesseractLoaded ? 'Point camera at workout text' : 'Loading OCR...'}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-2">
                    {!isScanning ? (
                      <>
                        <button
                          onClick={startCamera}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 transition-all"
                        >
                          <Camera size={20} />
                          Start Camera
                        </button>
                        <button
                          onClick={uploadPhoto}
                          disabled={isUploading}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                          />
                          <Edit3 size={20} />
                          {isUploading ? 'Processing...' : 'Upload Photo'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={captureAndScan}
                          disabled={isProcessing}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                        >
                          <Target size={20} />
                          {isProcessing ? 'Scanning...' : tesseractLoaded ? 'Scan Text' : 'Loading OCR...'}
                        </button>
                        <button
                          onClick={stopCamera}
                          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 transition-all"
                        >
                          Stop
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Manual Input with Voice */}
              <div className="bg-black/30 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white font-bold">Manual Entry</span>
                  <span className="flex-1" />
                  <button
                    onClick={isListening ? stopVoiceInput : startVoiceInput}
                    className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all
                      ${isListening
                        ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-green-500/25 hover:-translate-y-0.5'
                      }`}
                  >
                    <span role="img" aria-label="mic">
                      🎤
                    </span>
                    {isListening ? 'Stop' : 'Voice'}
                  </button>
                  <button
                    onClick={readWorkoutAloud}
                    disabled={isSpeaking || !inputText.trim()}
                    className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all disabled:opacity-50
                      ${isSpeaking
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-indigo-500/25 hover:-translate-y-0.5'
                      }`}
                  >
                    <span role="img" aria-label="speaker">
                      🔊
                    </span>
                    {isSpeaking ? 'Speaking...' : 'TTS'}
                  </button>
                </div>
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Enter workout (e.g., 'Bench Press 3x10') or use voice input"
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

          {/* Workout Tab */}
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

          {/* Progress Tab */}
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
