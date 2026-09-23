import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, X, Minimize2, Maximize2, Timer } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { SessionFinishModal } from './SessionFinishModal';
import { formatDateToYYYYMMDD } from '../../utils/streak';

export const StudyTimerWidget: React.FC = () => {
  const { isTimerOpen, closeTimer, timerPresetTopicId, recordStudySession, roadmap } = useLearning();

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const startTimeRef = useRef<string | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // When timer opens with a preset topic, auto start if not running
  useEffect(() => {
    if (isTimerOpen && !isActive && seconds === 0) {
      setIsActive(true);
      startTimeRef.current = new Date().toISOString();
    }
  }, [isTimerOpen]);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!startTimeRef.current) {
      startTimeRef.current = new Date().toISOString();
    }
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
    startTimeRef.current = null;
  };

  const handleStop = () => {
    setIsActive(false);
    if (seconds >= 10) {
      // Open finish dialog to log
      setIsFinishModalOpen(true);
    } else {
      // Dismiss if under 10 seconds
      handleReset();
      closeTimer();
    }
  };

  const handleSaveFinishedSession = (data: {
    durationMinutes: number;
    topicIds: string[];
    notes: string;
    confidence: any;
  }) => {
    const todayStr = formatDateToYYYYMMDD(new Date());
    recordStudySession({
      date: todayStr,
      startTime: startTimeRef.current || new Date().toISOString(),
      endTime: new Date().toISOString(),
      durationMinutes: data.durationMinutes,
      topicIds: data.topicIds,
      notes: data.notes,
      confidence: data.confidence,
    });
    handleReset();
    closeTimer();
  };

  if (!isTimerOpen) return null;

  // Preset topic name preview if available
  let presetTopicName = '';
  if (timerPresetTopicId) {
    for (const cat of roadmap) {
      for (const sub of cat.subcategories) {
        const found = sub.topics.find((t) => t.id === timerPresetTopicId);
        if (found) {
          presetTopicName = found.name;
          break;
        }
      }
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 animate-slideUp">
        <div
          className={`bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl transition-all duration-300 ${
            isMinimized ? 'p-3 w-64' : 'p-5 w-80'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-lg ${
                  isActive ? 'bg-violet-600/20 text-violet-400 timer-pulsing' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-200">Study Session Tracker</span>
                {presetTopicName && (
                  <p className="text-[10px] text-violet-400 truncate max-w-[140px]">{presetTopicName}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  if (isActive) {
                    if (window.confirm('Timer is running. Stop and save session?')) {
                      handleStop();
                    }
                  } else {
                    closeTimer();
                  }
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-center py-4">
            <div
              className={`font-mono font-bold tracking-tight text-slate-100 ${
                isMinimized ? 'text-2xl' : 'text-4xl'
              }`}
            >
              {formatTime(seconds)}
            </div>
            {!isMinimized && (
              <p className="text-xs text-slate-400 mt-1">
                {isActive ? 'Session in progress...' : seconds > 0 ? 'Paused' : 'Ready to start'}
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {!isActive ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-lg shadow-violet-900/30 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {seconds === 0 ? 'Start' : 'Resume'}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/60 rounded-xl transition-all"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                Pause
              </button>
            )}

            <button
              onClick={handleStop}
              disabled={seconds === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 rounded-xl border border-slate-700 transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-current text-red-400" />
              Stop
            </button>

            <button
              onClick={handleReset}
              disabled={seconds === 0 && !isActive}
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-xl border border-slate-700 transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <SessionFinishModal
        isOpen={isFinishModalOpen}
        durationSeconds={seconds}
        initialTopicId={timerPresetTopicId}
        onClose={() => setIsFinishModalOpen(false)}
        onSave={handleSaveFinishedSession}
      />
    </>
  );
};
