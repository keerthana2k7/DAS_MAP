import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { useLearning } from '../../context/LearningContext';
import { formatDateToYYYYMMDD } from '../../utils/streak';

export const AnalyticsCharts: React.FC = () => {
  const { studySessions, roadmap, revisionLogs, overallStats, streakInfo } = useLearning();

  // 1. Study Hours per Day (last 14 days)
  const studyHoursPerDay = useMemo(() => {
    const days: { date: string; displayDate: string; hours: number }[] = [];
    const today = new Date();

    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ymd = formatDateToYYYYMMDD(d);
      const display = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      let minutes = 0;
      studySessions.forEach((s) => {
        if (s.date === ymd) minutes += s.durationMinutes;
      });

      days.push({
        date: ymd,
        displayDate: display,
        hours: Number((minutes / 60).toFixed(1)),
      });
    }

    return days;
  }, [studySessions]);

  // 2. Study Hours per Week (last 6 weeks)
  const studyHoursPerWeek = useMemo(() => {
    const weeks: { weekLabel: string; hours: number }[] = [];
    const now = new Date();

    for (let w = 5; w >= 0; w--) {
      const end = new Date(now);
      end.setDate(end.getDate() - w * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);

      const label = `W-${w === 0 ? 'Current' : w}`;

      let minutes = 0;
      studySessions.forEach((s) => {
        const sDate = new Date(s.date + 'T00:00:00');
        if (sDate >= start && sDate <= end) {
          minutes += s.durationMinutes;
        }
      });

      weeks.push({
        weekLabel: label,
        hours: Number((minutes / 60).toFixed(1)),
      });
    }

    return weeks;
  }, [studySessions]);

  // 3. Category Progress (Horizontal bar data)
  const categoryProgressData = useMemo(() => {
    return roadmap.map((cat) => {
      let total = 0;
      let completed = 0;
      let minutes = 0;

      cat.subcategories.forEach((sub) => {
        sub.topics.forEach((t) => {
          total++;
          minutes += t.totalStudyMinutes || 0;
          if (t.status === 'COMPLETED') completed++;
        });
      });

      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        name: cat.name,
        completed,
        total,
        percentage,
        studyHours: Number((minutes / 60).toFixed(1)),
      };
    });
  }, [roadmap]);

  // 4. Confidence Distribution (Count of topics by confidence level 1-5)
  const confidenceData = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    roadmap.forEach((c) => {
      c.subcategories.forEach((s) => {
        s.topics.forEach((t) => {
          if (counts[t.confidence] !== undefined) {
            counts[t.confidence]++;
          }
        });
      });
    });

    const labels: Record<number, string> = {
      1: "1 - Don't understand",
      2: '2 - Basic',
      3: '3 - Comfortable',
      4: '4 - Good',
      5: '5 - Can explain',
    };

    const colors = ['#64748b', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

    return Object.entries(counts).map(([level, count], idx) => ({
      name: labels[Number(level)],
      count,
      color: colors[idx],
    }));
  }, [roadmap]);

  // 5. Revision Activity (last 6 weeks)
  const revisionActivity = useMemo(() => {
    const data: { weekLabel: string; count: number }[] = [];
    const now = new Date();

    for (let w = 5; w >= 0; w--) {
      const end = new Date(now);
      end.setDate(end.getDate() - w * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);

      let count = 0;
      revisionLogs.forEach((r) => {
        const rDate = new Date(r.date + 'T00:00:00');
        if (rDate >= start && rDate <= end) {
          count++;
        }
      });

      data.push({
        weekLabel: `W-${w === 0 ? 'Current' : w}`,
        count,
      });
    }

    return data;
  }, [revisionLogs]);

  // Most & Least Studied Categories
  const { mostStudied, leastStudied, avgDailyMinutes } = useMemo(() => {
    let most = { name: 'None', hours: 0 };
    let least = { name: 'None', hours: Infinity };

    categoryProgressData.forEach((c) => {
      if (c.studyHours > most.hours) {
        most = { name: c.name, hours: c.studyHours };
      }
      if (c.studyHours < least.hours) {
        least = { name: c.name, hours: c.studyHours };
      }
    });

    if (least.hours === Infinity) least = { name: 'None', hours: 0 };

    const studyDays = streakInfo.totalStudyDays || 1;
    const avgMins = Math.round(overallStats.totalStudyMinutes / studyDays);

    return {
      mostStudied: most,
      leastStudied: least,
      avgDailyMinutes: avgMins,
    };
  }, [categoryProgressData, overallStats.totalStudyMinutes, streakInfo.totalStudyDays]);

  return (
    <div className="space-y-6">
      {/* High-level Analytics KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
            Average Study Time
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-slate-100 mt-1 block">
            {avgDailyMinutes} min / day
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Over {streakInfo.totalStudyDays} active study days
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
            Topics Remaining
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-violet-400 mt-1 block">
            {overallStats.totalTopics - overallStats.completedTopics}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            {overallStats.completionPercentage}% of roadmap completed
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
            Most Studied Category
          </span>
          <span className="text-lg font-bold text-slate-100 mt-1 truncate block">
            {mostStudied.name}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block font-mono">
            {mostStudied.hours} hours logged
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
            Least Studied Category
          </span>
          <span className="text-lg font-bold text-slate-100 mt-1 truncate block">
            {leastStudied.name}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block font-mono">
            {leastStudied.hours} hours logged
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Study Hours per Day (14 Days) */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-200">Study Hours (Past 14 Days)</h4>
            <span className="text-xs text-slate-500 font-mono">Hours / Day</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyHoursPerDay}>
                <defs>
                  <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="displayDate" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#studyGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Completion Progress */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-200">Category Progress (%)</h4>
            <span className="text-xs text-slate-500 font-mono">Completed %</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryProgressData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} unit="%" />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#64748b"
                  fontSize={10}
                  width={100}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Progress']}
                />
                <Bar dataKey="percentage" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Confidence Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-200">Confidence Distribution</h4>
            <span className="text-xs text-slate-500 font-mono">Topics by Confidence</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confidenceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-slate-400">
            {confidenceData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}:</span>
                <span className="font-semibold text-slate-200">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Revision Activity Trend */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-200">Revision Velocity (Past 6 Weeks)</h4>
            <span className="text-xs text-slate-500 font-mono">Revisions Completed</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revisionActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="weekLabel" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
