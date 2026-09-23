import React, { useState, useMemo } from 'react';
import { X, Check, Search, BookOpen, Star } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { ConfidenceLevel } from '../../types/roadmap';
import { getAllTopicsFlat } from '../../data/roadmap';

interface SessionFinishModalProps {
  isOpen: boolean;
  durationSeconds: number;
  initialTopicId: string | null;
  onClose: () => void;
  onSave: (data: {
    durationMinutes: number;
    topicIds: string[];
    notes: string;
    confidence: ConfidenceLevel;
  }) => void;
}

export const SessionFinishModal: React.FC<SessionFinishModalProps> = ({
  isOpen,
  durationSeconds,
  initialTopicId,
  onClose,
  onSave,
}) => {
  const { roadmap } = useLearning();

  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(() =>
    initialTopicId ? [initialTopicId] : []
  );
  const [topicSearch, setTopicSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [confidence, setConfidence] = useState<ConfidenceLevel>(3);

  const allTopics = useMemo(() => getAllTopicsFlat(roadmap), [roadmap]);

  const filteredTopics = useMemo(() => {
    const q = topicSearch.trim().toLowerCase();
    if (!q) return allTopics.slice(0, 15);
    return allTopics.filter(
      (item) =>
        item.topic.name.toLowerCase().includes(q) ||
        item.subcategory.name.toLowerCase().includes(q) ||
        item.category.name.toLowerCase().includes(q)
    ).slice(0, 25);
  }, [allTopics, topicSearch]);

  const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));

  const toggleTopic = (id: string) => {
    setSelectedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const confidenceDescriptions: Record<ConfidenceLevel, string> = {
    1: "1 — Don't understand",
    2: '2 — Basic understanding',
    3: '3 — Comfortable',
    4: '4 — Good',
    5: '5 — Can explain/implement',
  };

  const handleSave = () => {
    onSave({
      durationMinutes,
      topicIds: selectedTopicIds,
      notes,
      confidence,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-violet-400 font-medium text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            Study Session Finished
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Recorded {durationMinutes} Minute{durationMinutes === 1 ? '' : 's'} of Study
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log the topics covered and self-evaluate your confidence.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {/* Topics selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              What did you study? <span className="text-slate-500 font-normal">({selectedTopicIds.length} selected)</span>
            </label>
            <div className="relative mb-2">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search topic to select (e.g. Arrays, Docker, JWT)..."
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-950/40 p-2 rounded-xl border border-slate-800/80">
              {filteredTopics.map(({ topic, category, subcategory }) => {
                const isSelected = selectedTopicIds.includes(topic.id);
                return (
                  <div
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-violet-900/40 text-violet-200 border border-violet-700/60'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-medium">{topic.name}</span>
                      <span className="ml-2 text-[10px] text-slate-500">
                        {category.name} → {subcategory.name}
                      </span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              What did you learn?
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key insights, algorithmic tricks, syntax gotchas, problems solved..."
              className="w-full p-3 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          {/* Confidence */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Confidence Level: <span className="text-violet-400 font-medium">{confidenceDescriptions[confidence]}</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {([1, 2, 3, 4, 5] as ConfidenceLevel[]).map((level) => {
                const isSelected = confidence === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setConfidence(level)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-900/30'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex gap-0.5 mb-1">
                      {Array.from({ length: level }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="font-bold">{level}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-lg shadow-violet-900/30 transition-all font-semibold"
          >
            Save Session
          </button>
        </div>
      </div>
    </div>
  );
};
