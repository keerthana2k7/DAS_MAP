import React from 'react';
import {
  CheckCircle2,
  Clock,
  Flame,
  BookOpen,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const ProgressOverview: React.FC = () => {
  const { overallStats, streakInfo } = useLearning();

  const formatHours = (mins: number) => {
    const hrs = (mins / 60).toFixed(1);
    return `${hrs}h`;
  };

  const statCards = [
    {
      label: 'Overall Completion',
      value: `${overallStats.completionPercentage}%`,
      subtitle: `${overallStats.completedTopics} / ${overallStats.totalTopics} Topics`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-800/40',
    },
    {
      label: 'Study Time Logged',
      value: formatHours(overallStats.totalStudyMinutes),
      subtitle: `${Math.round(overallStats.totalStudyMinutes)} mins total`,
      icon: Clock,
      color: 'text-violet-400',
      bg: 'bg-violet-950/30',
      border: 'border-violet-800/40',
    },
    {
      label: 'Current Streak',
      value: `${streakInfo.currentStreak} Days`,
      subtitle: `Longest streak: ${streakInfo.longestStreak} days`,
      icon: Flame,
      color: 'text-amber-400',
      bg: 'bg-amber-950/30',
      border: 'border-amber-800/40',
    },
    {
      label: 'Learning In Progress',
      value: overallStats.learningTopics,
      subtitle: `${overallStats.pendingTopics} pending topics`,
      icon: BookOpen,
      color: 'text-blue-400',
      bg: 'bg-blue-950/30',
      border: 'border-blue-800/40',
    },
    {
      label: 'Needs Revision',
      value: overallStats.revisionTopics,
      subtitle: 'Scheduled spaced repetition',
      icon: RotateCcw,
      color: 'text-purple-400',
      bg: 'bg-purple-950/30',
      border: 'border-purple-800/40',
    },
    {
      label: 'Velocity (7 Days)',
      value: `+${overallStats.thisWeekCompleted}`,
      subtitle: `${overallStats.thisMonthCompleted} completed this month`,
      icon: TrendingUp,
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/30',
      border: 'border-cyan-800/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-sm hover:border-slate-700/80 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-400 truncate">{stat.label}</span>
              <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color} border ${stat.border}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 font-mono">
                {stat.value}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 truncate">{stat.subtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
