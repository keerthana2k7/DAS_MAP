import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Binary, Globe, ShieldCheck, Wrench, Server, Cpu, Layers, Sparkles, FolderGit2 } from 'lucide-react';
import { Category } from '../../types/roadmap';
import { SubcategorySection } from './SubcategorySection';

interface CategorySectionProps {
  category: Category;
  filteredTopicsMap?: Map<string, any[]>;
  defaultExpanded?: boolean;
}

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

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  filteredTopicsMap,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const Icon = category.iconName && iconMap[category.iconName] ? iconMap[category.iconName] : Binary;

  // Calculate category stats
  let totalTopics = 0;
  let completedTopics = 0;

  category.subcategories.forEach((sub) => {
    sub.topics.forEach((t) => {
      totalTopics++;
      if (t.status === 'COMPLETED') completedTopics++;
    });
  });

  const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const isDsa = category.id === 'dsa';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-sm overflow-hidden transition-all">
      {/* Category Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2 truncate">
              {category.name}
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-xl">{category.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-200">
              {completedTopics} / {totalTopics} Completed
            </div>
            <div className="w-28 h-2 rounded-full bg-slate-800 overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="text-right sm:hidden">
            <span className="text-xs font-mono font-bold text-violet-400">{percentage}%</span>
          </div>

          <button
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Subcategories list */}
      {isExpanded && (
        <div className="p-4 sm:p-5 pt-0 space-y-3 border-t border-slate-800/80">
          {category.subcategories.map((subcategory) => {
            const topicsToRender = filteredTopicsMap
              ? filteredTopicsMap.get(subcategory.id) || []
              : subcategory.topics;

            if (topicsToRender.length === 0 && filteredTopicsMap) {
              return null;
            }

            return (
              <SubcategorySection
                key={subcategory.id}
                subcategory={subcategory}
                topics={topicsToRender}
                isDsa={isDsa}
                defaultExpanded={true}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
