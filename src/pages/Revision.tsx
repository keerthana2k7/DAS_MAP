import React, { useState } from 'react';
import { RotateCcw, Calendar, CheckCircle2, Info } from 'lucide-react';
import { RevisionDueList } from '../components/revision/RevisionDueList';
import { RevisionHistoryTable } from '../components/revision/RevisionHistoryTable';
import { useLearning } from '../context/LearningContext';

export const Revision: React.FC = () => {
  const { topicsDueForRevision, revisionLogs } = useLearning();
  const [activeTab, setActiveTab] = useState<'due' | 'history'>('due');

  const overdueOrDueTodayCount = topicsDueForRevision.filter(
    (t) => t.urgency === 'OVERDUE' || t.urgency === 'DUE_TODAY'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            Spaced Repetition System
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain active recall and prevent knowledge decay with scientifically spaced intervals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {overdueOrDueTodayCount > 0 ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/60 text-rose-300 border border-rose-800/60 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {overdueOrDueTodayCount} Revision{overdueOrDueTodayCount === 1 ? '' : 's'} Due Now
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Zero Overdue Revisions
            </span>
          )}
        </div>
      </div>

      {/* Interval Info Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-violet-400 shrink-0" />
          <span>Default Spaced Interval: Rev 1 (+1d) → Rev 2 (+3d) → Rev 3 (+7d) → Rev 4 (+14d) → Rev 5 (+30d)</span>
        </div>
        <span className="text-[11px] text-slate-500">Customizable in Settings</span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('due')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'due'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          Topics Due for Revision ({topicsDueForRevision.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'history'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Revision History ({revisionLogs.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'due' ? <RevisionDueList /> : <RevisionHistoryTable />}
    </div>
  );
};
