import React from 'react';
import { ProgressOverview } from '../components/dashboard/ProgressOverview';
import { TodayStudyCard } from '../components/dashboard/TodayStudyCard';
import { ContinueLearningCard } from '../components/dashboard/ContinueLearningCard';
import { StreakCalendar } from '../components/dashboard/StreakCalendar';
import { CategoryProgressCards } from '../components/dashboard/CategoryProgressCards';
import { DashboardQuickActions } from '../components/dashboard/DashboardQuickActions';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
            Developer Learning Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track DSA problem solving, full stack mastery, and spaced repetition revisions.
          </p>
        </div>

        <DashboardQuickActions />
      </div>

      {/* Top Metrics Cards (Overall completion %, streak, hours, learning, revision) */}
      <ProgressOverview />

      {/* Hero Study Row: Today's Learning + Continue Learning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TodayStudyCard />
        <ContinueLearningCard />
      </div>

      {/* GitHub-style Study Activity Heatmap */}
      <StreakCalendar />

      {/* Live Category Progress Cards */}
      <CategoryProgressCards />
    </div>
  );
};
