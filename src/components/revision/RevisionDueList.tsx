import React, { useState } from 'react';
import { RotateCcw, Play, CheckCircle2, Star, Calendar, Clock, Sparkles } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { ConfidenceLevel, Topic } from '../../types/roadmap';
import { RevisionUrgency } from '../../utils/revision';

interface RevisionDueListProps {
  onReviseTopic?: (topicId: string) => void;
}

export const RevisionDueList: React.FC<RevisionDueListProps> = () => {
  const { topicsDueForRevision, recordRevision, openTimer, openTopicModal } = useLearning();

  const [revisedTopicId, setRevisedTopicId] = useState<string | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [revisionConfidence, setRevisionConfidence] = useState<ConfidenceLevel>(4);

  const urgencyColors: Record<RevisionUrgency, { badge: string; text: string; border: string }> = {
    OVERDUE: {
      badge: 'bg-rose-950/60',
      text: 'text-rose-400',
      border: 'border-rose-800/60',
    },
    DUE_TODAY: {
      badge: 'bg-amber-950/60',
      text: 'text-amber-400',
      border: 'border-amber-800/60',
    },
    UPCOMING: {
      badge: 'bg-blue-950/40',
      text: 'text-blue-400',
      border: 'border-blue-800/40',
    },
    NONE: {
      badge: 'bg-slate-800',
      text: 'text-slate-400',
      border: 'border-slate-700',
    },
  };

  const handleQuickMarkRevised = (topic: Topic) => {
    setRevisedTopicId(topic.id);
    setRevisionConfidence(topic.confidence || 3);
    setRevisionNotes('');
  };

  const submitRevisionLog = (topicId: string) => {
    recordRevision(topicId, revisionConfidence, revisionNotes || 'Spaced revision session completed');
    setRevisedTopicId(null);
  };

  if (topicsDueForRevision.length === 0) {
    return (
      <div className="p-10 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">All Revisions Up to Date!</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Topics will automatically queue here based on spaced repetition intervals (1d, 3d, 7d, 14d, 30d) once you complete them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {topicsDueForRevision.map(({ topic, urgency, label }) => {
        const u = urgencyColors[urgency];
        const isEditingThis = revisedTopicId === topic.id;

        return (
          <div
            key={topic.id}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 shadow-sm transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    onClick={() => openTopicModal(topic.id)}
                    className="text-sm font-semibold text-slate-200 hover:text-violet-300 cursor-pointer transition-colors"
                  >
                    {topic.name}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${u.badge} ${u.text} ${u.border}`}
                  >
                    {label}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    Last studied:{' '}
                    {topic.lastStudiedAt ? new Date(topic.lastStudiedAt).toLocaleDateString() : 'N/A'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <RotateCcw className="w-3 h-3 text-blue-400" />
                    Revision #{topic.revisionCount || 0}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    {topic.confidence}/5
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => openTimer(topic.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-md shadow-violet-900/30 transition-all"
                >
                  <Play className="w-3 h-3 fill-current" />
                  Revise Now
                </button>

                <button
                  onClick={() => handleQuickMarkRevised(topic)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Mark Revised
                </button>
              </div>
            </div>

            {/* Inline Quick Revision Logger Form */}
            {isEditingThis && (
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Log Revision #{topic.revisionCount + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 mr-1 text-[11px]">Confidence:</span>
                    {([1, 2, 3, 4, 5] as ConfidenceLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setRevisionConfidence(lvl)}
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          revisionConfidence === lvl
                            ? 'bg-amber-500 text-black'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Revision takeaway / problems practiced..."
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                />

                <div className="flex justify-end gap-2 text-xs">
                  <button
                    onClick={() => setRevisedTopicId(null)}
                    className="px-3 py-1 text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submitRevisionLog(topic.id)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold"
                  >
                    Confirm Revision
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
