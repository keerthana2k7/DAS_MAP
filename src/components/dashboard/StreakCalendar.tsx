import React, { useMemo } from 'react';
import { Flame, Calendar, Info } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { generateActivityCalendar } from '../../utils/streak';

export const StreakCalendar: React.FC = () => {
  const { studySessions, streakInfo } = useLearning();

  // 12 weeks (~84 days) of activity
  const activities = useMemo(() => {
    return generateActivityCalendar(studySessions, 84);
  }, [studySessions]);

  const levelColors: Record<number, string> = {
    0: 'bg-slate-800/80 hover:bg-slate-700/80 border-transparent',
    1: 'bg-violet-900/60 hover:bg-violet-800/80 border-violet-800/50',
    2: 'bg-violet-700/80 hover:bg-violet-600 border-violet-600',
    3: 'bg-violet-500 hover:bg-violet-400 border-violet-400',
    4: 'bg-emerald-400 hover:bg-emerald-300 border-emerald-300',
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Study Streak & Activity
            </h3>
            <p className="text-xs text-slate-400">
              {streakInfo.totalStudyDays} total study day{streakInfo.totalStudyDays === 1 ? '' : 's'} recorded
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">Current:</span>
            <span className="font-bold text-amber-400">{streakInfo.currentStreak} Days</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">Longest:</span>
            <span className="font-bold text-violet-400">{streakInfo.longestStreak} Days</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-full">
          {activities.map((act) => {
            return (
              <div
                key={act.date}
                className={`w-3.5 h-3.5 rounded-sm border transition-all cursor-pointer ${
                  levelColors[act.level]
                }`}
                title={`${act.date}: ${act.minutes}m studied, ${act.sessionCount} sessions, ${act.topicsCount} topics`}
              />
            );
          })}
        </div>
      </div>

      {/* Legend & Note */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
        <span className="flex items-center gap-1 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5" />
          A day counts toward your streak when you log at least 1 study session.
        </span>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-slate-800" />
          <div className="w-3 h-3 rounded-sm bg-violet-900/60" />
          <div className="w-3 h-3 rounded-sm bg-violet-700/80" />
          <div className="w-3 h-3 rounded-sm bg-violet-500" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
