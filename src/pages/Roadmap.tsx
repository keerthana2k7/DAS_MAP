import React from 'react';
import { RoadmapTree } from '../components/roadmap/RoadmapTree';
import { useLearning } from '../context/LearningContext';

export const Roadmap: React.FC = () => {
  const { overallStats } = useLearning();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            Complete Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse and filter all {overallStats.totalTopics} curriculum topics across 9 software engineering domains.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-violet-950/60 text-violet-300 border border-violet-800/60 font-semibold">
            {overallStats.completedTopics} / {overallStats.totalTopics} Completed ({overallStats.completionPercentage}%)
          </span>
        </div>
      </div>

      {/* Roadmap Tree */}
      <RoadmapTree />
    </div>
  );
};
