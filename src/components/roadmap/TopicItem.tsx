import React from 'react';
import { Play, FileText, ExternalLink, RotateCcw, Clock, Star, Code2 } from 'lucide-react';
import { Topic, TopicStatus } from '../../types/roadmap';
import { StatusBadge } from '../common/Badge';
import { useLearning } from '../../context/LearningContext';

interface TopicItemProps {
  topic: Topic;
  isDsa?: boolean;
}

export const TopicItem: React.FC<TopicItemProps> = ({ topic, isDsa = false }) => {
  const { openTopicModal, openTimer, updateTopicStatus } = useLearning();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    updateTopicStatus(topic.id, e.target.value as TopicStatus);
  };

  const formatMinutes = (mins: number) => {
    if (!mins || mins === 0) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const hasNotes = Boolean(topic.notes && topic.notes.trim().length > 0);
  const resourceCount = topic.resources?.length || 0;
  const problemsCount = topic.problems?.length || 0;

  return (
    <div
      onClick={() => openTopicModal(topic.id)}
      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:px-4 sm:py-3 rounded-xl bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700/80 cursor-pointer transition-all gap-2.5 sm:gap-4"
    >
      {/* Left: Topic Name & Metadata Pills */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-violet-300 transition-colors">
            {topic.name}
          </span>

          {/* Indicators */}
          {hasNotes && (
            <span
              className="p-1 rounded bg-slate-800 text-slate-400"
              title="Has study notes"
            >
              <FileText className="w-3 h-3 text-violet-400" />
            </span>
          )}

          {resourceCount > 0 && (
            <span
              className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60"
              title={`${resourceCount} resources added`}
            >
              <ExternalLink className="w-2.5 h-2.5" />
              {resourceCount}
            </span>
          )}

          {isDsa && problemsCount > 0 && (
            <span
              className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/60"
              title={`${problemsCount} practice problems solved`}
            >
              <Code2 className="w-2.5 h-2.5" />
              {problemsCount} solved
            </span>
          )}
        </div>

        {/* Secondary meta info: Study time, Last studied, Confidence, Revision */}
        <div className="flex items-center gap-2.5 sm:gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
          {topic.totalStudyMinutes > 0 && (
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-violet-400" />
              {formatMinutes(topic.totalStudyMinutes)}
            </span>
          )}

          {topic.revisionCount > 0 && (
            <span className="flex items-center gap-1 text-slate-400">
              <RotateCcw className="w-3 h-3 text-blue-400" />
              {topic.revisionCount} rev
            </span>
          )}

          <span className="flex items-center gap-0.5 text-amber-400/90 font-mono">
            <Star className="w-3 h-3 fill-current" />
            {topic.confidence}/5
          </span>

          {topic.lastStudiedAt && (
            <span className="text-[10px] text-slate-500">
              Studied {new Date(topic.lastStudiedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Right: Quick Status Selector & Timer Action */}
      <div
        className="flex items-center gap-2 shrink-0 self-end sm:self-center"
        onClick={(e) => e.stopPropagation()}
      >
        <select
          value={topic.status}
          onChange={handleStatusChange}
          className="bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1 text-xs text-slate-300 font-medium focus:outline-none focus:border-violet-500 cursor-pointer"
        >
          <option value="NOT_STARTED">Not Started</option>
          <option value="LEARNING">Learning</option>
          <option value="COMPLETED">Completed</option>
          <option value="REVISION">Revision</option>
        </select>

        <StatusBadge status={topic.status} size="sm" />

        <button
          onClick={() => openTimer(topic.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-violet-600 transition-colors"
          title="Start Study Session on this topic"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>
    </div>
  );
};
