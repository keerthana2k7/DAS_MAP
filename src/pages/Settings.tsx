import React, { useState, useRef } from 'react';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  RotateCcw,
  Moon,
  Sun,
  Target,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { exportDevTrackData, parseAndApplyImportData } from '../utils/exportImport';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const Settings: React.FC = () => {
  const {
    roadmap,
    studySessions,
    revisionLogs,
    projects,
    settings,
    updateSettings,
    resetAllData,
    toggleDarkMode,
    setRoadmapDirectly,
    setSessionsDirectly,
    setRevisionsDirectly,
    setProjectsDirectly,
    setSettingsDirectly,
    overallStats,
  } = useLearning();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportDevTrackData(roadmap, studySessions, revisionLogs, projects, settings);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const result = parseAndApplyImportData(content, {
        setRoadmap: setRoadmapDirectly,
        setSessions: setSessionsDirectly,
        setRevisions: setRevisionsDirectly,
        setProjects: setProjectsDirectly,
        setSettings: setSettingsDirectly,
      });

      if (result.success) {
        setImportStatus({ type: 'success', message: result.message });
      } else {
        setImportStatus({ type: 'error', message: result.message });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure learning targets, spaced repetition intervals, backup your data, or switch themes.
        </p>
      </div>

      {/* Import Status Alert */}
      {importStatus && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs animate-fadeIn ${
            importStatus.type === 'success'
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
              : 'bg-rose-950/40 text-rose-300 border-rose-800/60'
          }`}
        >
          <div className="flex items-center gap-2">
            {importStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
          <button
            onClick={() => setImportStatus(null)}
            className="text-slate-400 hover:text-white text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Theme Configuration */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20">
            {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Appearance Theme</h3>
            <p className="text-xs text-slate-400">Choose between dark charcoal developer theme or clean light mode</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => updateSettings({ darkMode: true })}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              settings.darkMode
                ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-900/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            Dark Theme (Developer)
          </button>
          <button
            type="button"
            onClick={() => updateSettings({ darkMode: false })}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              !settings.darkMode
                ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-900/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            Light Theme
          </button>
        </div>
      </div>

      {/* 2. Study Goals */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Study Goals & Targets</h3>
            <p className="text-xs text-slate-400">Customize daily study hours and velocity milestones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Daily Study Goal (Minutes)
            </label>
            <input
              type="number"
              min="15"
              max="720"
              step="15"
              value={settings.dailyStudyGoalMinutes}
              onChange={(e) => updateSettings({ dailyStudyGoalMinutes: Number(e.target.value) || 120 })}
              className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-violet-500 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              {(settings.dailyStudyGoalMinutes / 60).toFixed(1)} hours / day
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Weekly Topic Goal
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={settings.weeklyTopicsGoal}
              onChange={(e) => updateSettings({ weeklyTopicsGoal: Number(e.target.value) || 15 })}
              className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-violet-500 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Topics to complete per week</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Monthly Topic Goal
            </label>
            <input
              type="number"
              min="5"
              max="200"
              value={settings.monthlyTopicsGoal}
              onChange={(e) => updateSettings({ monthlyTopicsGoal: Number(e.target.value) || 50 })}
              className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-violet-500 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Topics to complete per month</span>
          </div>
        </div>
      </div>

      {/* 3. Spaced Repetition Intervals */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Spaced Repetition Schedule (Days)</h3>
            <p className="text-xs text-slate-400">
              Days elapsed after completion for Revision 1, Revision 2, Revision 3, Revision 4, Revision 5
            </p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 pt-2">
          {(settings.revisionIntervals || [1, 3, 7, 14, 30]).map((days, idx) => (
            <div key={idx}>
              <span className="text-[10px] text-slate-400 block mb-1">Rev #{idx + 1}</span>
              <input
                type="number"
                min="1"
                max="365"
                value={days}
                onChange={(e) => {
                  const newIntervals = [...settings.revisionIntervals];
                  newIntervals[idx] = Number(e.target.value) || 1;
                  updateSettings({ revisionIntervals: newIntervals });
                }}
                className="w-full p-2 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs text-center font-mono focus:outline-none focus:border-violet-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block text-center">+{days}d</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Data Persistence & Backup */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Data Persistence & Backup</h3>
            <p className="text-xs text-slate-400">Export your data to JSON or restore a previous backup</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30 transition-all"
          >
            <Download className="w-4 h-4" />
            Export My Data (.json)
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <Upload className="w-4 h-4" />
            Import Data (.json)
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1">
          <span>{overallStats.totalTopics} curriculum topics mapped</span>
          <span>•</span>
          <span>{studySessions.length} sessions logged</span>
          <span>•</span>
          <span>{revisionLogs.length} revisions stored</span>
        </div>
      </div>

      {/* 5. Danger Zone: Reset Progress */}
      <div className="p-5 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-red-400">Reset Roadmap Progress</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Permanently wipe all topic completion statuses, study sessions, notes, and revision history.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/30 transition-all shrink-0"
          >
            Reset Progress
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset All Progress?"
        message="Are you sure? This will permanently reset your roadmap progress, study sessions, notes and revision history back to 0%."
        confirmLabel="Reset Progress"
        cancelLabel="Cancel"
        isDanger={true}
        onConfirm={() => {
          resetAllData();
          setIsResetModalOpen(false);
          setImportStatus({
            type: 'success',
            message: 'All roadmap progress has been reset to default clean state.',
          });
        }}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
