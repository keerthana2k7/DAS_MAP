import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  Star,
  Code2,
  Sparkles,
  Award,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { ConfidenceLevel, ProblemDifficulty, ResourceType, TopicStatus } from '../../types/roadmap';
import { StatusBadge } from '../common/Badge';

export const TopicDetailModal: React.FC = () => {
  const {
    activeTopic,
    activeCategory,
    activeSubcategory,
    closeTopicModal,
    openTimer,
    updateTopicStatus,
    updateTopicConfidence,
    updateTopicNotes,
    addTopicResource,
    deleteTopicResource,
    addTopicProblem,
    deleteTopicProblem,
    recordRevision,
    studySessions,
    revisionLogs,
  } = useLearning();

  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'problems' | 'history'>('notes');
  const [localNotes, setLocalNotes] = useState('');
  const [isSavedNotes, setIsSavedNotes] = useState(true);

  // New Resource Form state
  const [showAddResource, setShowAddResource] = useState(false);
  const [resName, setResName] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resType, setResType] = useState<ResourceType>('Documentation');

  // New Problem Form state
  const [showAddProblem, setShowAddProblem] = useState(false);
  const [probName, setProbName] = useState('');
  const [probPlatform, setProbPlatform] = useState('LeetCode');
  const [probDifficulty, setProbDifficulty] = useState<ProblemDifficulty>('Medium');
  const [probUrl, setProbUrl] = useState('');
  const [probNotes, setProbNotes] = useState('');

  // Sync notes when activeTopic changes
  useEffect(() => {
    if (activeTopic) {
      setLocalNotes(activeTopic.notes || '');
      setIsSavedNotes(true);
      setShowAddResource(false);
      setShowAddProblem(false);
      // If DSA, default or show problems tab
    }
  }, [activeTopic?.id]);

  // Autosave notes on debounce
  useEffect(() => {
    if (!activeTopic) return;
    if (localNotes === (activeTopic.notes || '')) return;

    setIsSavedNotes(false);
    const handler = setTimeout(() => {
      updateTopicNotes(activeTopic.id, localNotes);
      setIsSavedNotes(true);
    }, 600);

    return () => clearTimeout(handler);
  }, [localNotes, activeTopic?.id, updateTopicNotes]);

  // Topic study history
  const topicStudyHistory = useMemo(() => {
    if (!activeTopic) return [];
    return studySessions.filter((s) => (s.topicIds || []).includes(activeTopic.id));
  }, [studySessions, activeTopic?.id]);

  // Topic revision history
  const topicRevisionHistory = useMemo(() => {
    if (!activeTopic) return [];
    return revisionLogs.filter((r) => r.topicId === activeTopic.id);
  }, [revisionLogs, activeTopic?.id]);

  if (!activeTopic || !activeCategory || !activeSubcategory) return null;

  const isDsa = activeCategory.id === 'dsa';

  const formatMinutes = (mins: number) => {
    if (!mins || mins === 0) return '0m';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  const handleAddResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName.trim() || !resUrl.trim()) return;
    addTopicResource(activeTopic.id, {
      name: resName.trim(),
      url: resUrl.trim(),
      type: resType,
    });
    setResName('');
    setResUrl('');
    setShowAddResource(false);
  };

  const handleAddProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!probName.trim()) return;
    addTopicProblem(activeTopic.id, {
      name: probName.trim(),
      platform: probPlatform,
      difficulty: probDifficulty,
      url: probUrl.trim(),
      solvedDate: new Date().toISOString().split('T')[0],
      notes: probNotes.trim(),
    });
    setProbName('');
    setProbUrl('');
    setProbNotes('');
    setShowAddProblem(false);
  };

  // DSA problem counts
  const problems = activeTopic.problems || [];
  const easyCount = problems.filter((p) => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter((p) => p.difficulty === 'Medium').length;
  const hardCount = problems.filter((p) => p.difficulty === 'Hard').length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={closeTopicModal}
    >
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={closeTopicModal}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <span className="text-violet-400 font-medium">{activeCategory.name}</span>
            <span>→</span>
            <span>{activeSubcategory.name}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                {activeTopic.name}
              </h2>
            </div>

            {/* Status Selector Dropdown / Badges */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <select
                value={activeTopic.status}
                onChange={(e) => updateTopicStatus(activeTopic.id, e.target.value as TopicStatus)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-violet-500"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="LEARNING">Learning</option>
                <option value="COMPLETED">Completed</option>
                <option value="REVISION">Revision</option>
              </select>
              <StatusBadge status={activeTopic.status} size="sm" />
            </div>
          </div>

          {/* Meta Statistics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400 shrink-0" />
              <div>
                <p className="text-slate-400 text-[11px]">Study Time</p>
                <p className="font-semibold text-slate-200">{formatMinutes(activeTopic.totalStudyMinutes)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-slate-400 text-[11px]">Last Studied</p>
                <p className="font-semibold text-slate-200">
                  {activeTopic.lastStudiedAt
                    ? new Date(activeTopic.lastStudiedAt).toLocaleDateString()
                    : 'Not yet'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <p className="text-slate-400 text-[11px]">Revisions</p>
                <p className="font-semibold text-slate-200">{activeTopic.revisionCount || 0} times</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-slate-400 text-[11px]">Confidence</p>
                <div className="flex items-center gap-1">
                  {([1, 2, 3, 4, 5] as ConfidenceLevel[]).map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => updateTopicConfidence(activeTopic.id, star)}
                      className={`hover:scale-110 transition-transform ${
                        activeTopic.confidence >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                      title={`Rate ${star}/5`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-1 text-slate-300 font-semibold">{activeTopic.confidence}/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3 border-t border-slate-800/80">
            <button
              onClick={() => {
                closeTopicModal();
                openTimer(activeTopic.id);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-lg shadow-violet-900/30 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Study Session
            </button>

            {activeTopic.status !== 'COMPLETED' ? (
              <button
                onClick={() => updateTopicStatus(activeTopic.id, 'COMPLETED')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-xl transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Completed
              </button>
            ) : (
              <button
                onClick={() => updateTopicStatus(activeTopic.id, 'LEARNING')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
              >
                Resume Learning
              </button>
            )}

            <button
              onClick={() => {
                recordRevision(activeTopic.id, activeTopic.confidence, 'Revision completed from topic modal');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 rounded-xl transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Add Revision
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 border-b border-slate-800 bg-slate-950/20 text-xs font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'notes'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Learning Notes
            {!isSavedNotes && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'resources'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Resources ({activeTopic.resources?.length || 0})
          </button>

          {isDsa && (
            <button
              onClick={() => setActiveTab('problems')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'problems'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Practice ({problems.length})
            </button>
          )}

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'history'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            History ({topicStudyHistory.length + topicRevisionHistory.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* TAB 1: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  Notes & Code Snippets (Autosaves)
                </span>
                <span className="text-[11px] text-slate-500">
                  {isSavedNotes ? 'All changes saved' : 'Saving...'}
                </span>
              </div>
              <textarea
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                placeholder="Write your study notes, time complexity O(N), space complexity O(1), algorithmic patterns, code snippets, or bullet points here..."
                rows={12}
                className="w-full p-4 text-xs font-mono bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 leading-relaxed resize-none"
              />
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>Tip: You can paste snippets, pseudo-code, or bulleted learning takeaways.</span>
              </div>
            </div>
          )}

          {/* TAB 2: RESOURCES */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Curated Links & References
                </span>
                <button
                  onClick={() => setShowAddResource(!showAddResource)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-violet-300 bg-violet-950/60 hover:bg-violet-900/60 border border-violet-800/60 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Resource
                </button>
              </div>

              {showAddResource && (
                <form
                  onSubmit={handleAddResourceSubmit}
                  className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 animate-fadeIn"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Resource Title (e.g. NeetCode Explanation)"
                      value={resName}
                      onChange={(e) => setResName(e.target.value)}
                      required
                      className="p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={resUrl}
                      onChange={(e) => setResUrl(e.target.value)}
                      required
                      className="p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                    <select
                      value={resType}
                      onChange={(e) => setResType(e.target.value as ResourceType)}
                      className="p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                    >
                      <option value="YouTube">YouTube</option>
                      <option value="Documentation">Documentation</option>
                      <option value="Article">Article</option>
                      <option value="Course">Course</option>
                      <option value="Practice">Practice</option>
                      <option value="GitHub">GitHub</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddResource(false)}
                      className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium"
                    >
                      Save Resource
                    </button>
                  </div>
                </form>
              )}

              {(!activeTopic.resources || activeTopic.resources.length === 0) && !showAddResource ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  <BookOpen className="w-7 h-7 mx-auto mb-2 opacity-30 text-slate-400" />
                  <p>No resources added yet. Save YouTube tutorials, docs, or blogs here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeTopic.resources?.map((res) => (
                    <div
                      key={res.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {res.type}
                        </span>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-slate-200 hover:text-violet-300 truncate flex items-center gap-1"
                        >
                          {res.name}
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </a>
                      </div>
                      <button
                        onClick={() => deleteTopicResource(activeTopic.id, res.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRACTICE TRACKING (DSA) */}
          {isDsa && activeTab === 'problems' && (
            <div className="space-y-4">
              {/* Problem Stats Pills */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Total</span>
                  <span className="font-bold text-slate-100 text-base">{problems.length}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
                  <span className="text-emerald-400 text-[11px] block">Easy</span>
                  <span className="font-bold text-emerald-300 text-base">{easyCount}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-900/40">
                  <span className="text-amber-400 text-[11px] block">Medium</span>
                  <span className="font-bold text-amber-300 text-base">{mediumCount}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/40">
                  <span className="text-rose-400 text-[11px] block">Hard</span>
                  <span className="font-bold text-rose-300 text-base">{hardCount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Problems Solved
                </span>
                <button
                  onClick={() => setShowAddProblem(!showAddProblem)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-violet-300 bg-violet-950/60 hover:bg-violet-900/60 border border-violet-800/60 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Problem
                </button>
              </div>

              {showAddProblem && (
                <form
                  onSubmit={handleAddProblemSubmit}
                  className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 animate-fadeIn"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Problem Name (e.g. Subarray Sum Equals K)"
                      value={probName}
                      onChange={(e) => setProbName(e.target.value)}
                      required
                      className="p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                    <select
                      value={probPlatform}
                      onChange={(e) => setProbPlatform(e.target.value)}
                      className="p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                    >
                      <option value="LeetCode">LeetCode</option>
                      <option value="GeeksforGeeks">GeeksforGeeks</option>
                      <option value="Codeforces">Codeforces</option>
                      <option value="CodeChef">CodeChef</option>
                      <option value="HackerRank">HackerRank</option>
                      <option value="Other">Other</option>
                    </select>
                    <select
                      value={probDifficulty}
                      onChange={(e) => setProbDifficulty(e.target.value as ProblemDifficulty)}
                      className="p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="url"
                      placeholder="Problem URL (optional)"
                      value={probUrl}
                      onChange={(e) => setProbUrl(e.target.value)}
                      className="p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                    <input
                      type="text"
                      placeholder="Notes / approach..."
                      value={probNotes}
                      onChange={(e) => setProbNotes(e.target.value)}
                      className="p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProblem(false)}
                      className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium"
                    >
                      Save Problem
                    </button>
                  </div>
                </form>
              )}

              {problems.length === 0 && !showAddProblem ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  <Award className="w-7 h-7 mx-auto mb-2 opacity-30 text-slate-400" />
                  <p>No practice problems recorded yet. Log LeetCode, GFG, or Codeforces problems solved!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {problems.map((p) => {
                    const diffColors = {
                      Easy: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
                      Medium: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
                      Hard: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
                    }[p.difficulty];

                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${diffColors}`}
                          >
                            {p.difficulty}
                          </span>
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {p.platform}
                          </span>
                          <div className="min-w-0">
                            {p.url ? (
                              <a
                                href={p.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-medium text-slate-200 hover:text-violet-300 flex items-center gap-1 truncate"
                              >
                                {p.name}
                                <ExternalLink className="w-3 h-3 text-slate-500" />
                              </a>
                            ) : (
                              <span className="text-xs font-medium text-slate-200 truncate">{p.name}</span>
                            )}
                            {p.notes && <p className="text-[11px] text-slate-400 truncate">{p.notes}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-slate-500">{p.solvedDate}</span>
                          <button
                            onClick={() => deleteTopicProblem(activeTopic.id, p.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: STUDY & REVISION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Study Sessions ({topicStudyHistory.length})
                </h4>
                {topicStudyHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No study sessions recorded for this topic yet.</p>
                ) : (
                  <div className="space-y-2">
                    {topicStudyHistory.map((s) => (
                      <div
                        key={s.id}
                        className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span>{s.date}</span>
                          <span className="font-semibold text-violet-300">{s.durationMinutes} minutes</span>
                        </div>
                        {s.notes && <p className="text-slate-300">{s.notes}</p>}
                        <div className="flex items-center gap-1 text-[11px] text-amber-400">
                          <span>Confidence:</span>
                          <span>★ {s.confidence}/5</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Revision History ({topicRevisionHistory.length})
                </h4>
                {topicRevisionHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No revision entries logged yet.</p>
                ) : (
                  <div className="space-y-2">
                    {topicRevisionHistory.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span className="font-medium text-blue-400">Revision #{rev.revisionNumber}</span>
                          <span>{rev.date}</span>
                        </div>
                        {rev.notes && <p className="text-slate-300">{rev.notes}</p>}
                        <div className="text-[11px] text-amber-400">Confidence: ★ {rev.confidence}/5</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
