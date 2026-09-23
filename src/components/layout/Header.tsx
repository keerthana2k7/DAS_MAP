import React from 'react';
import { Menu, Search, Timer, Moon, Sun, Flame, Sparkles } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { setSearchOpen, openTimer, settings, toggleDarkMode, streakInfo, todayStudyStats } = useLearning();

  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Left section: Hamburger button & Quick Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <span className="text-xs font-semibold text-slate-300">DevTrack</span>
          <span className="text-xs text-slate-500 ml-2">"Learn. Track. Revise. Build."</span>
        </div>
      </div>

      {/* Center section: Global Search shortcut trigger */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs text-slate-400 bg-slate-950/60 hover:bg-slate-800 hover:text-slate-200 border border-slate-800 rounded-xl transition-all w-48 sm:w-80 justify-between group"
      >
        <div className="flex items-center gap-2 truncate">
          <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400" />
          <span className="truncate">Search roadmap & notes...</span>
        </div>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded shadow-sm">
          Ctrl K
        </kbd>
      </button>

      {/* Right section: Today's progress pill, Start Timer, Dark Mode toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Today's study chip */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs">
          <span className="text-slate-400">Today:</span>
          <span className="font-semibold text-violet-400">{formatMinutes(todayStudyStats.todayStudyMinutes)}</span>
          <span className="text-slate-500">/ {formatMinutes(todayStudyStats.targetMinutes)}</span>
        </div>

        {/* Streak chip on mobile/tablet */}
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>{streakInfo.currentStreak}d</span>
        </div>

        {/* Start Study Timer CTA */}
        <button
          onClick={() => openTimer()}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-md shadow-violet-900/30 transition-all"
        >
          <Timer className="w-4 h-4" />
          <span className="hidden sm:inline">Start Timer</span>
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors border border-slate-800"
          title={settings.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {settings.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
