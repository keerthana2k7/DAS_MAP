import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { RoadmapTree } from '../components/roadmap/RoadmapTree';
import { Binary, Globe, ShieldCheck, Wrench, Server, Cpu, Layers, Sparkles, FolderGit2 } from 'lucide-react';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Binary,
  Globe,
  ShieldCheck,
  Wrench,
  Server,
  Cpu,
  Layers,
  Sparkles,
  FolderGit2,
};

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { roadmap } = useLearning();

  const category = roadmap.find((c) => c.id === categoryId);

  if (!category) {
    return <Navigate to="/roadmap" replace />;
  }

  const Icon = category.iconName && iconMap[category.iconName] ? iconMap[category.iconName] : Binary;

  let totalTopics = 0;
  let completedTopics = 0;
  category.subcategories.forEach((sub) => {
    sub.topics.forEach((t) => {
      totalTopics++;
      if (t.status === 'COMPLETED') completedTopics++;
    });
  });

  const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-violet-600/15 text-violet-400 border border-violet-500/25 shrink-0">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        <div className="sm:text-right shrink-0">
          <div className="text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-200">{completedTopics}</span> / {totalTopics} Completed
          </div>
          <div className="w-36 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-violet-400 mt-1 block">{percentage}% Progress</span>
        </div>
      </div>

      {/* Filtered Roadmap Tree for this Category */}
      <RoadmapTree initialCategoryId={category.id} />
    </div>
  );
};
