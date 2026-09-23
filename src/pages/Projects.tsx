import React from 'react';
import { useLearning } from '../context/LearningContext';
import { ProjectCard } from '../components/projects/ProjectCard';

export const Projects: React.FC = () => {
  const { projects } = useLearning();

  const totalFeatures = projects.reduce((acc, p) => acc + p.features.length, 0);
  const completedFeatures = projects.reduce(
    (acc, p) => acc + p.features.filter((f) => f.completed).length,
    0
  );
  const deployedCount = projects.filter((p) => p.status === 'DEPLOYED' || p.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            Project Development Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build production-grade projects spanning frontend, enterprise backend, full stack SaaS, and distributed cloud systems.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Features: </span>
            <strong className="text-violet-400">{completedFeatures}</strong> / {totalFeatures}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Shipped: </span>
            <strong className="text-emerald-400">{deployedCount}</strong> / 4
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((proj) => (
          <ProjectCard key={proj.id} project={proj} />
        ))}
      </div>
    </div>
  );
};
