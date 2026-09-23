import React from 'react';
import { AnalyticsCharts } from '../components/analytics/AnalyticsCharts';
import { BarChart3 } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const Analytics: React.FC = () => {
  const { overallStats } = useLearning();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            Learning Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Data-driven insights into your study habits, velocity, recall confidence, and subject distribution.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            Total Logged: <strong className="text-violet-400 font-bold">{(overallStats.totalStudyMinutes / 60).toFixed(1)}h</strong>
          </span>
        </div>
      </div>

      {/* Analytics Visualizations */}
      <AnalyticsCharts />
    </div>
  );
};
