import React, { useState, useMemo } from 'react';
import {
  Clock,
  PlusCircle,
  Calendar,
  Star,
  BookOpen,
  Trash2,
  Tag,
  Search,
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { ManualSessionModal } from '../components/study/ManualSessionModal';
import { getAllTopicsFlat } from '../data/roadmap';

export const StudyLog: React.FC = () => {
  const { studySessions, deleteStudySession, roadmap, openTopicModal } = useLearning();
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const topicNameMap = useMemo(() => {
    const map = new Map<string, string>();
    getAllTopicsFlat(roadmap).forEach(({ topic }) => {
      map.set(topic.id, topic.name);
    });
    return map;
  }, [roadmap]);

  // Group sessions by date
  const filteredSessions = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return studySessions;

    return studySessions.filter((s) => {
      const matchNotes = (s.notes || '').toLowerCase().includes(q);
      const matchDate = s.date.includes(q);
      const matchTopic = (s.topicIds || []).some((id) => {
        const name = topicNameMap.get(id) || '';
        return name.toLowerCase().includes(q);
      });
      return matchNotes || matchDate || matchTopic;
    });
  }, [studySessions, searchFilter, topicNameMap]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, typeof filteredSessions> = {};
    filteredSessions.forEach((s) => {
      if (!groups[s.date]) groups[s.date] = [];
      groups[s.date].push(s);
    });
    return groups;
  }, [filteredSessions]);

  const formatTimeRange = (startIso: string, endIso: string) => {
    try {
      const s = new Date(startIso);
      const e = new Date(endIso);
      return `${s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — ${e.toLocaleTimeString(
        [],
        { hour: '2-digit', minute: '2-digit' }
      )}`;
    } catch {
      return '';
    }
  };

  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  const sortedDates = Object.keys(groupedByDate).sort().reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            Daily Study Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Chronological ledger of learning sessions, duration, covered topics, and reflections.
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-lg shadow-violet-900/30 transition-all self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          Add Study Session
        </button>
      </div>

      {/* Search / Filter Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
        <input
          type="text"
          placeholder="Filter logs by topic, date, or note text..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
        />
      </div>

      {/* Sessions Timeline */}
      {sortedDates.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 mx-auto text-slate-500 opacity-40" />
          <h3 className="text-base font-semibold text-slate-300">You haven't recorded any study sessions yet.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Use the study timer or add a past study session manually to begin building your learning logs.
          </p>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-violet-300 bg-violet-950/60 border border-violet-800/60 rounded-xl hover:bg-violet-900/60 transition-colors"
          >
            Add First Study Session
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((dateStr) => {
            const sessionsForDay = groupedByDate[dateStr];
            const totalDayMinutes = sessionsForDay.reduce((acc, s) => acc + s.durationMinutes, 0);

            return (
              <div key={dateStr} className="space-y-3">
                {/* Date header */}
                <div className="flex items-center justify-between px-1 text-xs text-slate-400">
                  <div className="flex items-center gap-2 font-semibold text-slate-200">
                    <Calendar className="w-4 h-4 text-violet-400" />
                    <span>
                      {new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="font-mono text-violet-400 font-medium">
                    Total: {formatMinutes(totalDayMinutes)}
                  </span>
                </div>

                {/* Session cards */}
                <div className="space-y-2.5">
                  {sessionsForDay.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 shadow-sm transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="font-mono text-slate-400">
                            {formatTimeRange(session.startTime, session.endTime)}
                          </span>
                          <span className="font-bold text-violet-300 font-mono">
                            {formatMinutes(session.durationMinutes)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold font-mono">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{session.confidence}/5</span>
                          </div>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this study session record?')) {
                                deleteStudySession(session.id);
                              }
                            }}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                            title="Delete session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Topics studied tags */}
                      {session.topicIds && session.topicIds.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Tag className="w-3 h-3 text-slate-500 mr-0.5" />
                          {session.topicIds.map((tid) => {
                            const name = topicNameMap.get(tid) || 'Topic';
                            return (
                              <button
                                key={tid}
                                onClick={() => openTopicModal(tid)}
                                className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-colors"
                              >
                                {name}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Notes */}
                      {session.notes && (
                        <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                          "{session.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Add Session Modal */}
      <ManualSessionModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />
    </div>
  );
};
