import React from 'react';
import { TopicStatus } from '../../types/roadmap';

interface StatusBadgeProps {
  status: TopicStatus;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', onClick }) => {
  const configs: Record<TopicStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
    NOT_STARTED: {
      label: 'Not Started',
      bg: 'bg-slate-800/80',
      text: 'text-slate-400',
      border: 'border-slate-700',
      dot: 'bg-slate-500',
    },
    LEARNING: {
      label: 'Learning',
      bg: 'bg-amber-950/40',
      text: 'text-amber-400',
      border: 'border-amber-800/50',
      dot: 'bg-amber-400 animate-pulse',
    },
    COMPLETED: {
      label: 'Completed',
      bg: 'bg-emerald-950/40',
      text: 'text-emerald-400',
      border: 'border-emerald-800/50',
      dot: 'bg-emerald-400',
    },
    REVISION: {
      label: 'Revision',
      bg: 'bg-violet-950/40',
      text: 'text-violet-400',
      border: 'border-violet-800/50',
      dot: 'bg-violet-400 animate-pulse',
    },
  };

  const c = configs[status] || configs.NOT_STARTED;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${c.bg} ${c.text} ${c.border} ${sizeClasses} ${
        onClick ? 'cursor-pointer hover:brightness-125 transition-all' : ''
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};
