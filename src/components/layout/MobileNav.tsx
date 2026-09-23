import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, BookOpen, RotateCcw, Timer } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const MobileNav: React.FC = () => {
  const { openTimer, topicsDueForRevision } = useLearning();

  const dueCount = topicsDueForRevision.filter(
    (t) => t.urgency === 'OVERDUE' || t.urgency === 'DUE_TODAY'
  ).length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2">
      <div className="flex items-center justify-around text-[10px] font-medium text-slate-400">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
              isActive ? 'text-violet-400 font-semibold' : 'hover:text-slate-200'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/roadmap"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
              isActive ? 'text-violet-400 font-semibold' : 'hover:text-slate-200'
            }`
          }
        >
          <Map className="w-5 h-5" />
          <span>Roadmap</span>
        </NavLink>

        {/* Center Floating Timer Trigger */}
        <button
          onClick={() => openTimer()}
          className="flex flex-col items-center -mt-5 bg-violet-600 hover:bg-violet-500 text-white p-3 rounded-full shadow-lg shadow-violet-900/40 border-2 border-slate-900 transition-transform active:scale-95"
          aria-label="Start study session"
        >
          <Timer className="w-5 h-5" />
        </button>

        <NavLink
          to="/revision"
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
              isActive ? 'text-violet-400 font-semibold' : 'hover:text-slate-200'
            }`
          }
        >
          <RotateCcw className="w-5 h-5" />
          <span>Revision</span>
          {dueCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-slate-900" />
          )}
        </NavLink>

        <NavLink
          to="/study-log"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
              isActive ? 'text-violet-400 font-semibold' : 'hover:text-slate-200'
            }`
          }
        >
          <BookOpen className="w-5 h-5" />
          <span>Study Log</span>
        </NavLink>
      </div>
    </div>
  );
};
