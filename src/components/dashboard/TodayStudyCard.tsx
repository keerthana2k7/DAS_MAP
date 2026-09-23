import React from 'react';
import { Target, Play, Clock, CheckCircle2 } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const TodayStudyCard: React.FC = () => {
  const { todayStudyStats, openTimer } = useLearning();

  const formatHoursAndMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  const progressPercent = Math.min(
    100,
    Math.round((todayStudyStats.todayStudyMinutes / (todayStudyStats.targetMinutes || 120)) * 100)
  );

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Today's Learning</h3>
              <p className="text-xs text-slate-400">Daily study goal tracking</p>
            </div>
          </div>

          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-violet-950/50 text-violet-300 border border-violet-800/60">
            {progressPercent}% Met
          </span>
        </div>

        {/* Goal metrics grid */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-center">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Today's Goal</span>
            <span className="text-sm font-bold text-slate-200 mt-0.5 block font-mono">
              {formatHoursAndMinutes(todayStudyStats.targetMinutes)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-violet-950/20 border border-violet-800/40">
            <span className="text-[10px] text-violet-400 uppercase tracking-wider block">Studied</span>
            <span className="text-sm font-bold text-violet-300 mt-0.5 block font-mono">
              {formatHoursAndMinutes(todayStudyStats.todayStudyMinutes)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Remaining</span>
            <span className="text-sm font-bold text-slate-200 mt-0.5 block font-mono">
              {formatHoursAndMinutes(todayStudyStats.remainingMinutes)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 mb-4">
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {todayStudyStats.todayCompletedCount} topic{todayStudyStats.todayCompletedCount === 1 ? '' : 's'} finished today
            </span>
            <span>{todayStudyStats.remainingMinutes === 0 ? 'Goal Completed!' : `${formatHoursAndMinutes(todayStudyStats.remainingMinutes)} left`}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => openTimer()}
        className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-lg shadow-violet-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        Start Study Session
      </button>
    </div>
  );
};
