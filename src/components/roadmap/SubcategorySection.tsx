import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Subcategory, Topic } from '../../types/roadmap';
import { TopicItem } from './TopicItem';

interface SubcategorySectionProps {
  subcategory: Subcategory;
  topics: Topic[];
  isDsa?: boolean;
  defaultExpanded?: boolean;
}

export const SubcategorySection: React.FC<SubcategorySectionProps> = ({
  subcategory,
  topics,
  isDsa = false,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const completedCount = topics.filter((t) => t.status === 'COMPLETED').length;
  const totalCount = topics.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 overflow-hidden">
      {/* Subcategory Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 sm:px-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="text-slate-500">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
              {subcategory.name}
            </h4>
            <span className="text-[11px] text-slate-500">
              {completedCount} / {totalCount} topics completed ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Small progress meter */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-16 sm:w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden hidden xs:block">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">{progressPercent}%</span>
        </div>
      </button>

      {/* Topics list */}
      {isExpanded && (
        <div className="p-2 sm:p-3 pt-0 space-y-1.5 border-t border-slate-800/60 bg-slate-950/20">
          {topics.map((topic) => (
            <TopicItem key={topic.id} topic={topic} isDsa={isDsa} />
          ))}
        </div>
      )}
    </div>
  );
};
