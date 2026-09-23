import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Binary,
  Globe,
  ShieldCheck,
  Wrench,
  Server,
  Cpu,
  Layers,
  Sparkles,
  FolderGit2,
  BookOpen,
  RotateCcw,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Flame,
  Code2,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { streakInfo, topicsDueForRevision } = useLearning();
  const [roadmapOpen, setRoadmapOpen] = useState(true);
  const [studyOpen, setStudyOpen] = useState(true);

  const categories = [
    { id: 'dsa', name: 'DSA', icon: Binary, path: '/category/dsa' },
    { id: 'web-api', name: 'Web / API Coding', icon: Globe, path: '/category/web-api' },
    { id: 'security', name: 'Security', icon: ShieldCheck, path: '/category/security' },
    { id: 'developer-tools', name: 'Developer Tools', icon: Wrench, path: '/category/developer-tools' },
    { id: 'devops', name: 'DevOps / Deploy', icon: Server, path: '/category/devops' },
    { id: 'software-engineering', name: 'Software Eng.', icon: Cpu, path: '/category/software-engineering' },
    { id: 'system-design', name: 'System Design', icon: Layers, path: '/category/system-design' },
    { id: 'ai-developers', name: 'AI for Devs', icon: Sparkles, path: '/category/ai-developers' },
  ];

  const dueRevisionCount = topicsDueForRevision.filter(
    (t) => t.urgency === 'OVERDUE' || t.urgency === 'DUE_TODAY'
  ).length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo / Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-violet-900/30">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-slate-100 flex items-center gap-1.5">
                DevTrack
                <span className="text-[10px] bg-violet-950 text-violet-300 border border-violet-800 px-1.5 py-0.2 rounded font-mono">
                  v1.0
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">DSA & Full Stack Roadmap</p>
            </div>
          </NavLink>
        </div>

        {/* Streak & Status Pill */}
        <div className="px-4 pt-3 pb-1">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-amber-500/10 text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-slate-200">{streakInfo.currentStreak} Days</span>
                <span className="text-[10px] text-slate-400 block">Current Streak</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              <span>Best: {streakInfo.longestStreak}d</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 text-xs font-medium">
          {/* Dashboard */}
          <NavLink
            to="/"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </NavLink>

          {/* Full Roadmap Overview */}
          <NavLink
            to="/roadmap"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
              }`
            }
          >
            <Map className="w-4 h-4" />
            Full Roadmap (All 344)
          </NavLink>

          {/* Collapsible Roadmap Categories */}
          <div>
            <button
              onClick={() => setRoadmapOpen(!roadmapOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors uppercase text-[10px] tracking-wider font-semibold"
            >
              <span>Roadmap Categories</span>
              {roadmapOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {roadmapOpen && (
              <div className="pl-2 pr-1 pt-1 space-y-0.5 animate-fadeIn">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <NavLink
                      key={cat.id}
                      to={cat.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs ${
                          isActive
                            ? 'bg-slate-800 text-violet-400 font-semibold border-l-2 border-violet-500 pl-2.5'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`
                      }
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{cat.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          {/* Study Section */}
          <div className="pt-2">
            <button
              onClick={() => setStudyOpen(!studyOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors uppercase text-[10px] tracking-wider font-semibold"
            >
              <span>Study Tracker</span>
              {studyOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {studyOpen && (
              <div className="pl-2 pr-1 pt-1 space-y-0.5 animate-fadeIn">
                <NavLink
                  to="/study-log"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs ${
                      isActive
                        ? 'bg-slate-800 text-violet-400 font-semibold border-l-2 border-violet-500 pl-2.5'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  Study Log
                </NavLink>

                <NavLink
                  to="/revision"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-1.5 rounded-lg transition-all text-xs ${
                      isActive
                        ? 'bg-slate-800 text-violet-400 font-semibold border-l-2 border-violet-500 pl-2.5'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                    <span>Revision</span>
                  </div>
                  {dueRevisionCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-violet-600 text-white">
                      {dueRevisionCount}
                    </span>
                  )}
                </NavLink>
              </div>
            )}
          </div>

          {/* Projects Dashboard */}
          <div className="pt-2">
            <NavLink
              to="/projects"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                }`
              }
            >
              <FolderGit2 className="w-4 h-4" />
              Project Development (4)
            </NavLink>
          </div>

          {/* Analytics */}
          <NavLink
            to="/analytics"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
              }`
            }
          >
            <BarChart3 className="w-4 h-4" />
            Learning Analytics
          </NavLink>

          {/* Settings */}
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
              }`
            }
          >
            <Settings className="w-4 h-4" />
            Settings
          </NavLink>
        </nav>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          <p>DevTrack — Learn. Track. Revise. Build.</p>
        </div>
      </aside>
    </>
  );
};
