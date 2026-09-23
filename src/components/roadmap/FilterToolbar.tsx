import React from 'react';
import { Search, Filter, RotateCcw, X } from 'lucide-react';
import { TopicStatus } from '../../types/roadmap';

export interface RoadmapFilterState {
  search: string;
  status: TopicStatus | 'ALL';
  confidence: number | 'ALL';
  category: string | 'ALL';
  revisionOnly: boolean;
}

interface FilterToolbarProps {
  filters: RoadmapFilterState;
  onFilterChange: (filters: RoadmapFilterState) => void;
  categories: { id: string; name: string }[];
  matchedCount: number;
  totalCount: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onFilterChange,
  categories,
  matchedCount,
  totalCount,
}) => {
  const handleReset = () => {
    onFilterChange({
      search: '',
      status: 'ALL',
      confidence: 'ALL',
      category: 'ALL',
      revisionOnly: false,
    });
  };

  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'ALL' ||
    filters.confidence !== 'ALL' ||
    filters.category !== 'ALL' ||
    filters.revisionOnly;

  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
      {/* Search Input & Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search topic name, concept, or notes..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400">
          <span>
            Showing <strong className="text-violet-400">{matchedCount}</strong> of {totalCount} topics
          </span>
          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-1 text-slate-400 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span className="font-semibold text-[11px] uppercase tracking-wider">Filters:</span>
        </div>

        {/* Category filter */}
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="p-1.5 px-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-violet-500 text-xs"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value as TopicStatus | 'ALL' })}
          className="p-1.5 px-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-violet-500 text-xs"
        >
          <option value="ALL">All Statuses</option>
          <option value="NOT_STARTED">Not Started</option>
          <option value="LEARNING">Learning</option>
          <option value="COMPLETED">Completed</option>
          <option value="REVISION">Revision</option>
        </select>

        {/* Confidence filter */}
        <select
          value={filters.confidence}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              confidence: e.target.value === 'ALL' ? 'ALL' : Number(e.target.value),
            })
          }
          className="p-1.5 px-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-violet-500 text-xs"
        >
          <option value="ALL">All Confidence Levels</option>
          <option value="1">Confidence 1 (Don't understand)</option>
          <option value="2">Confidence 2 (Basic understanding)</option>
          <option value="3">Confidence 3 (Comfortable)</option>
          <option value="4">Confidence 4 (Good)</option>
          <option value="5">Confidence 5 (Can explain/implement)</option>
        </select>

        {/* Revision Due Toggle */}
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, revisionOnly: !filters.revisionOnly })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            filters.revisionOnly
              ? 'bg-violet-950/60 text-violet-300 border-violet-700/80 shadow-sm'
              : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <RotateCcw className="w-3 h-3" />
          Due for Revision
        </button>
      </div>
    </div>
  );
};
