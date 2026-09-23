import React from 'react';
import { NavLink } from 'react-router-dom';
import { Play, Sparkles, Compass, Clock, Star, ArrowRight } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { StatusBadge } from '../common/Badge';

export const ContinueLearningCard: React.FC = () => {
  const { continueLearningTopic, openTopicModal, openTimer } = useLearning();

  const formatRelativeDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  if (!continueLearningTopic) {
    return (
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Start Your Roadmap</h3>
              <p className="text-xs text-slate-400">Begin with Arrays or core programming fundamentals</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed my-3">
            You haven't started any topics yet. Select a topic from DSA or Full Stack to record your first study session and begin your learning streak!
          </p>
        </div>

        <NavLink
          to="/roadmap"
          className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-lg shadow-violet-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          <span>Explore Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>
    );
  }

  const { topic, category, subcategory } = continueLearningTopic;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block">
                Continue Learning
              </span>
              <p className="text-xs text-slate-400">
                {category.name} → {subcategory.name}
              </p>
            </div>
          </div>
          <StatusBadge status={topic.status} size="sm" />
        </div>

        <div className="my-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <h4 className="text-base font-bold text-slate-100">{topic.name}</h4>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Last studied: {topic.lastStudiedAt ? formatRelativeDate(topic.lastStudiedAt) : 'Recently'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              {topic.confidence}/5
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={() => openTimer(topic.id)}
          className="flex-1 py-2.5 px-3 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-lg shadow-violet-900/30 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Study Topic
        </button>
        <button
          onClick={() => openTopicModal(topic.id)}
          className="py-2.5 px-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
