import React, { useState } from 'react';
import {
  FolderGit2,
  CheckSquare,
  Square,
  ExternalLink,
  Calendar,
  Layers,
  ChevronDown,
  ChevronRight,
  Server,
} from 'lucide-react';
import { ProjectTrack, ProjectStatus } from '../../types/project';
import { useLearning } from '../../context/LearningContext';

interface ProjectCardProps {
  project: ProjectTrack;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { updateProject, toggleProjectFeature, toggleProjectAdvancedFeature } = useLearning();
  const [isExpanded, setIsExpanded] = useState(true);

  const statusOptions: ProjectStatus[] = [
    'NOT_STARTED',
    'PLANNING',
    'DEVELOPMENT',
    'TESTING',
    'COMPLETED',
    'DEPLOYED',
  ];

  const statusColors: Record<ProjectStatus, { bg: string; text: string; border: string }> = {
    NOT_STARTED: { bg: 'bg-slate-800', text: 'text-slate-400', border: 'border-slate-700' },
    PLANNING: { bg: 'bg-amber-950/50', text: 'text-amber-400', border: 'border-amber-800/60' },
    DEVELOPMENT: { bg: 'bg-blue-950/50', text: 'text-blue-400', border: 'border-blue-800/60' },
    TESTING: { bg: 'bg-purple-950/50', text: 'text-purple-400', border: 'border-purple-800/60' },
    COMPLETED: { bg: 'bg-emerald-950/50', text: 'text-emerald-400', border: 'border-emerald-800/60' },
    DEPLOYED: { bg: 'bg-violet-950/50', text: 'text-violet-300', border: 'border-violet-700/60' },
  };

  const completedFeatures = project.features.filter((f) => f.completed).length;
  const totalFeatures = project.features.length;
  const progressPercent = totalFeatures > 0 ? Math.round((completedFeatures / totalFeatures) * 100) : 0;

  const st = statusColors[project.status];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden transition-all">
      {/* Header */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20 shrink-0 mt-0.5">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100">{project.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{project.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            {/* Status Dropdown */}
            <select
              value={project.status}
              onChange={(e) => updateProject(project.id, { status: e.target.value as ProjectStatus })}
              className={`text-xs font-semibold px-2.5 py-1 rounded-xl border ${st.bg} ${st.text} ${st.border} focus:outline-none cursor-pointer`}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress Bar & Tech Badges */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Features Progress: {completedFeatures} of {totalFeatures} ({progressPercent}%)
            </span>
            <span className="font-mono font-bold text-violet-400">{progressPercent}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Body: Checklist & Special Tracker */}
      {isExpanded && (
        <div className="p-5 space-y-5">
          {/* Features Checklist */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Core Architecture & Features Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.features.map((feature) => (
                <div
                  key={feature.id}
                  onClick={() => toggleProjectFeature(project.id, feature.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    feature.completed
                      ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  {feature.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span className={feature.completed ? 'line-through text-slate-400' : 'font-medium'}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Special Distributed System Tracking for Project 4 */}
          {project.advancedFeatures && (
            <div className="pt-2 border-t border-slate-800/80">
              <h4 className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" />
                Advanced Distributed Systems Checklist (Project 4 Special)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(project.advancedFeatures).map(([key, isDone]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleProjectAdvancedFeature(project.id, key)}
                    className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all ${
                      isDone
                        ? 'bg-violet-950/40 border-violet-800 text-violet-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="font-medium truncate">{key}</span>
                    {isDone ? (
                      <CheckSquare className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* URLs & Dates */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">GitHub Repository URL</label>
              <input
                type="url"
                placeholder="https://github.com/your-username/repo"
                value={project.repoUrl}
                onChange={(e) => updateProject(project.id, { repoUrl: e.target.value })}
                className="w-full p-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Live Demo / Deployment URL</label>
              <input
                type="url"
                placeholder="https://my-app.vercel.app or AWS URL"
                value={project.liveUrl}
                onChange={(e) => updateProject(project.id, { liveUrl: e.target.value })}
                className="w-full p-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Project Notes & Architecture Decisions</label>
            <textarea
              rows={2}
              value={project.notes}
              onChange={(e) => updateProject(project.id, { notes: e.target.value })}
              placeholder="Record architectural insights, database schemas, deployment notes..."
              className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
