import React from 'react';
import { RotateCcw, Calendar, Star } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { getAllTopicsFlat } from '../../data/roadmap';

export const RevisionHistoryTable: React.FC = () => {
  const { revisionLogs, roadmap, openTopicModal } = useLearning();

  const allTopicsMap = React.useMemo(() => {
    const map = new Map<string, { topicName: string; categoryName: string }>();
    getAllTopicsFlat(roadmap).forEach(({ topic, category }) => {
      map.set(topic.id, { topicName: topic.name, categoryName: category.name });
    });
    return map;
  }, [roadmap]);

  if (revisionLogs.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500 italic">
        No revisions logged yet. Revisions will appear here once you mark topics as revised.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/90 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3 pl-4">Topic</th>
              <th className="p-3">Revision</th>
              <th className="p-3">Date</th>
              <th className="p-3">Confidence</th>
              <th className="p-3 pr-4">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {revisionLogs.map((rev) => {
              const info = allTopicsMap.get(rev.topicId);
              return (
                <tr key={rev.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 pl-4">
                    <button
                      onClick={() => openTopicModal(rev.topicId)}
                      className="font-medium text-slate-200 hover:text-violet-300 text-left"
                    >
                      {info?.topicName || 'Topic'}
                    </button>
                    <span className="text-[10px] text-slate-500 block">{info?.categoryName}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/60 text-blue-300 border border-blue-800/50">
                      Rev #{rev.revisionNumber}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{rev.date}</td>
                  <td className="p-3 text-amber-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Star className="w-3 h-3 fill-current" />
                      {rev.confidence}/5
                    </span>
                  </td>
                  <td className="p-3 pr-4 text-slate-300 max-w-xs truncate">
                    {rev.notes || <span className="text-slate-500 italic">No notes</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
