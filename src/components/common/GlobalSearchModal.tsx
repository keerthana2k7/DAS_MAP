import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Hash, ChevronRight, BookOpen, Clock, FileText } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { StatusBadge } from './Badge';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setSearchOpen, roadmap, openTopicModal } = useLearning();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches: {
      topicId: string;
      topicName: string;
      categoryName: string;
      subcategoryName: string;
      status: any;
      confidence: number;
      studyMinutes: number;
      matchedInNotes: boolean;
    }[] = [];

    roadmap.forEach((cat) => {
      cat.subcategories.forEach((sub) => {
        sub.topics.forEach((t) => {
          const matchTopic = t.name.toLowerCase().includes(q);
          const matchSub = sub.name.toLowerCase().includes(q);
          const matchCat = cat.name.toLowerCase().includes(q);
          const matchNotes = (t.notes || '').toLowerCase().includes(q);

          if (matchTopic || matchSub || matchCat || matchNotes) {
            matches.push({
              topicId: t.id,
              topicName: t.name,
              categoryName: cat.name,
              subcategoryName: sub.name,
              status: t.status,
              confidence: t.confidence,
              studyMinutes: t.totalStudyMinutes,
              matchedInNotes: !matchTopic && matchNotes,
            });
          }
        });
      });
    });

    return matches.slice(0, 20); // Limit to top 20 matches for fast response
  }, [query, roadmap]);

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={() => setSearchOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-violet-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, categories, notes (e.g. Sliding Window, JWT, Docker, Kafka)..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-slate-800/40">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-violet-400" />
              <p>Type anything to search across all 344 topics, subcategories & notes</p>
              <div className="mt-3 flex justify-center gap-2 flex-wrap">
                {['Sliding Window', 'Binary Search', 'Docker', 'JWT', 'Kafka', 'Dynamic Programming'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <p>No matching topics found for "{query}".</p>
            </div>
          ) : (
            results.map((res) => (
              <div
                key={res.topicId}
                onClick={() => {
                  setSearchOpen(false);
                  openTopicModal(res.topicId);
                }}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/70 cursor-pointer transition-all border border-transparent hover:border-slate-700/60"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-violet-950/40 text-slate-400 group-hover:text-violet-400 transition-colors">
                    {res.matchedInNotes ? <FileText className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200 group-hover:text-violet-300 text-sm truncate">
                        {res.topicName}
                      </span>
                      {res.matchedInNotes && (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                          in notes
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <span>{res.categoryName}</span>
                      <ChevronRight className="w-3 h-3 text-slate-600" />
                      <span>{res.subcategoryName}</span>
                      {res.studyMinutes > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.round(res.studyMinutes)}m studied
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={res.status} size="sm" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
          <span>Found {results.length} result{results.length === 1 ? '' : 's'}</span>
          <span className="text-[11px]">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
