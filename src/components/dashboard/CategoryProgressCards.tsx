import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Binary, Globe, Layers, Sparkles, FolderGit2 } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

export const CategoryProgressCards: React.FC = () => {
  const { roadmap } = useLearning();

  // Calculate real progress for categories
  const categoryStats = roadmap.map((cat) => {
    let total = 0;
    let completed = 0;
    let learning = 0;

    cat.subcategories.forEach((sub) => {
      sub.topics.forEach((t) => {
        total++;
        if (t.status === 'COMPLETED') completed++;
        else if (t.status === 'LEARNING') learning++;
      });
    });

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      id: cat.id,
      name: cat.name,
      total,
      completed,
      learning,
      percentage,
      path: cat.id === 'project-development' ? '/projects' : `/category/${cat.id}`,
    };
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 tracking-tight">Category Progress</h3>
        <NavLink to="/roadmap" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
          <span>View all categories</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {categoryStats.map((cat) => {
          return (
            <NavLink
              key={cat.id}
              to={cat.path}
              className="group p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all hover:shadow-lg hover:shadow-black/20 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-violet-300 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {cat.completed} of {cat.total} topics completed
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-slate-100 font-mono">{cat.percentage}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                  <span>{cat.learning} in learning</span>
                  <span className="group-hover:text-violet-400 flex items-center transition-colors">
                    Explore <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
