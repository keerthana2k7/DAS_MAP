import React, { useState, useMemo } from 'react';
import { useLearning } from '../../context/LearningContext';
import { FilterToolbar, RoadmapFilterState } from './FilterToolbar';
import { CategorySection } from './CategorySection';
import { getRevisionStatus } from '../../utils/revision';

interface RoadmapTreeProps {
  initialCategoryId?: string;
}

export const RoadmapTree: React.FC<RoadmapTreeProps> = ({ initialCategoryId }) => {
  const { roadmap } = useLearning();

  const [filters, setFilters] = useState<RoadmapFilterState>({
    search: '',
    status: 'ALL',
    confidence: 'ALL',
    category: initialCategoryId || 'ALL',
    revisionOnly: false,
  });

  // Categories list for dropdown
  const categoryOptions = useMemo(() => {
    return roadmap.map((c) => ({ id: c.id, name: c.name }));
  }, [roadmap]);

  // Compute matched topics map and counts
  const { filteredTopicsMap, matchedCount, totalCount } = useMemo(() => {
    const map = new Map<string, any[]>();
    let matched = 0;
    let total = 0;

    const query = filters.search.trim().toLowerCase();

    roadmap.forEach((cat) => {
      // Category filter
      if (filters.category !== 'ALL' && cat.id !== filters.category) {
        return;
      }

      cat.subcategories.forEach((sub) => {
        const matchingTopicsInSub: any[] = [];

        sub.topics.forEach((topic) => {
          total++;

          // Search query check
          if (query) {
            const matchesName = topic.name.toLowerCase().includes(query);
            const matchesSub = sub.name.toLowerCase().includes(query);
            const matchesNotes = (topic.notes || '').toLowerCase().includes(query);
            if (!matchesName && !matchesSub && !matchesNotes) {
              return;
            }
          }

          // Status filter
          if (filters.status !== 'ALL' && topic.status !== filters.status) {
            return;
          }

          // Confidence filter
          if (filters.confidence !== 'ALL' && topic.confidence !== filters.confidence) {
            return;
          }

          // Revision due filter
          if (filters.revisionOnly) {
            const revStatus = getRevisionStatus(topic.nextRevisionDate);
            if (revStatus.urgency !== 'OVERDUE' && revStatus.urgency !== 'DUE_TODAY') {
              return;
            }
          }

          matched++;
          matchingTopicsInSub.push(topic);
        });

        if (matchingTopicsInSub.length > 0) {
          map.set(sub.id, matchingTopicsInSub);
        }
      });
    });

    return { filteredTopicsMap: map, matchedCount: matched, totalCount: total };
  }, [roadmap, filters]);

  const categoriesToRender = useMemo(() => {
    if (filters.category === 'ALL') {
      return roadmap;
    }
    return roadmap.filter((c) => c.id === filters.category);
  }, [roadmap, filters.category]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <FilterToolbar
        filters={filters}
        onFilterChange={setFilters}
        categories={categoryOptions}
        matchedCount={matchedCount}
        totalCount={totalCount}
      />

      {/* Categories Tree */}
      {matchedCount === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <p className="text-sm font-medium">No topics found matching current filters.</p>
          <button
            onClick={() =>
              setFilters({
                search: '',
                status: 'ALL',
                confidence: 'ALL',
                category: 'ALL',
                revisionOnly: false,
              })
            }
            className="mt-3 px-4 py-1.5 text-xs font-semibold text-violet-300 bg-violet-950/60 border border-violet-800/60 rounded-xl hover:bg-violet-900/60 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {categoriesToRender.map((category) => {
            // Check if category has any matching subcategories in map
            const hasMatches = category.subcategories.some((sub) =>
              filteredTopicsMap.has(sub.id)
            );

            if (!hasMatches) return null;

            return (
              <CategorySection
                key={category.id}
                category={category}
                filteredTopicsMap={filteredTopicsMap}
                defaultExpanded={true}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
