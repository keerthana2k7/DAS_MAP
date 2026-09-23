import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Category, ConfidenceLevel, PracticeProblem, Resource, Topic, TopicStatus } from '../types/roadmap';
import { RevisionLog, StudySession, UserSettings } from '../types/study';
import { ProjectTrack } from '../types/project';
import { initialRoadmapData, getAllTopicsFlat } from '../data/roadmap';
import { initialProjectsData } from '../data/defaultProjects';
import { STORAGE_KEYS, loadFromStorage, saveToStorage, clearAllDevTrackStorage } from '../utils/storage';
import { calculateStreaks, formatDateToYYYYMMDD } from '../utils/streak';
import { calculateNextRevisionDate, filterTopicsDueForRevision, RevisionUrgency } from '../utils/revision';

interface OverallStats {
  totalTopics: number;
  completedTopics: number;
  learningTopics: number;
  pendingTopics: number;
  revisionTopics: number;
  completionPercentage: number;
  totalStudyMinutes: number;
  thisWeekCompleted: number;
  thisMonthCompleted: number;
}

interface TodayStudyStats {
  todayStudyMinutes: number;
  todayCompletedCount: number;
  targetMinutes: number;
  remainingMinutes: number;
}

interface LearningContextType {
  roadmap: Category[];
  studySessions: StudySession[];
  revisionLogs: RevisionLog[];
  projects: ProjectTrack[];
  settings: UserSettings;

  // Modals & UI controls
  activeModalTopicId: string | null;
  activeTopic: Topic | null;
  activeCategory: Category | null;
  activeSubcategory: { id: string; name: string } | null;
  isTimerOpen: boolean;
  timerPresetTopicId: string | null;
  isSearchOpen: boolean;

  // Computed
  overallStats: OverallStats;
  todayStudyStats: TodayStudyStats;
  streakInfo: { currentStreak: number; longestStreak: number; totalStudyDays: number };
  topicsDueForRevision: { topic: Topic; urgency: RevisionUrgency; daysDiff: number; label: string }[];
  continueLearningTopic: { topic: Topic; category: Category; subcategory: { id: string; name: string } } | null;

  // Actions
  openTopicModal: (topicId: string) => void;
  closeTopicModal: () => void;
  openTimer: (topicId?: string) => void;
  closeTimer: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleDarkMode: () => void;

  // Topic mutations
  updateTopic: (topicId: string, updates: Partial<Topic>) => void;
  updateTopicStatus: (topicId: string, status: TopicStatus) => void;
  updateTopicConfidence: (topicId: string, confidence: ConfidenceLevel) => void;
  updateTopicNotes: (topicId: string, notes: string) => void;
  addTopicResource: (topicId: string, resource: Omit<Resource, 'id'>) => void;
  deleteTopicResource: (topicId: string, resourceId: string) => void;
  addTopicProblem: (topicId: string, problem: Omit<PracticeProblem, 'id'>) => void;
  deleteTopicProblem: (topicId: string, problemId: string) => void;

  // Study session mutations
  recordStudySession: (session: Omit<StudySession, 'id'>) => void;
  deleteStudySession: (sessionId: string) => void;

  // Revision mutations
  recordRevision: (topicId: string, confidence: ConfidenceLevel, notes: string) => void;

  // Project mutations
  updateProject: (projectId: string, updates: Partial<ProjectTrack>) => void;
  toggleProjectFeature: (projectId: string, featureId: string) => void;
  toggleProjectAdvancedFeature: (projectId: string, key: string) => void;

  // Global settings & data management
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetAllData: () => void;
  setRoadmapDirectly: (categories: Category[]) => void;
  setSessionsDirectly: (sessions: StudySession[]) => void;
  setRevisionsDirectly: (revisions: RevisionLog[]) => void;
  setProjectsDirectly: (projects: ProjectTrack[]) => void;
  setSettingsDirectly: (settings: UserSettings) => void;
}

const defaultSettings: UserSettings = {
  darkMode: true,
  dailyStudyGoalMinutes: 120, // 2 hours
  weeklyTopicsGoal: 15,
  monthlyTopicsGoal: 50,
  revisionIntervals: [1, 3, 7, 14, 30],
};

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roadmap, setRoadmap] = useState<Category[]>(() =>
    loadFromStorage<Category[]>(STORAGE_KEYS.ROADMAP, initialRoadmapData)
  );

  const [studySessions, setStudySessions] = useState<StudySession[]>(() =>
    loadFromStorage<StudySession[]>(STORAGE_KEYS.SESSIONS, [])
  );

  const [revisionLogs, setRevisionLogs] = useState<RevisionLog[]>(() =>
    loadFromStorage<RevisionLog[]>(STORAGE_KEYS.REVISIONS, [])
  );

  const [projects, setProjects] = useState<ProjectTrack[]>(() =>
    loadFromStorage<ProjectTrack[]>(STORAGE_KEYS.PROJECTS, initialProjectsData)
  );

  const [settings, setSettings] = useState<UserSettings>(() =>
    loadFromStorage<UserSettings>(STORAGE_KEYS.SETTINGS, defaultSettings)
  );

  // UI state
  const [activeModalTopicId, setActiveModalTopicId] = useState<string | null>(null);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerPresetTopicId, setTimerPresetTopicId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ROADMAP, roadmap);
  }, [roadmap]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SESSIONS, studySessions);
  }, [studySessions]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.REVISIONS, revisionLogs);
  }, [revisionLogs]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  }, [projects]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Keyboard shortcut for Cmd/Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Modal open/close helpers
  const openTopicModal = useCallback((topicId: string) => {
    setActiveModalTopicId(topicId);
  }, []);

  const closeTopicModal = useCallback(() => {
    setActiveModalTopicId(null);
  }, []);

  const openTimer = useCallback((topicId?: string) => {
    setTimerPresetTopicId(topicId || null);
    setIsTimerOpen(true);
  }, []);

  const closeTimer = useCallback(() => {
    setIsTimerOpen(false);
    setTimerPresetTopicId(null);
  }, []);

  const setSearchOpen = useCallback((open: boolean) => {
    setIsSearchOpen(open);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  // Update a single topic
  const updateTopic = useCallback((topicId: string, updates: Partial<Topic>) => {
    setRoadmap((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        subcategories: category.subcategories.map((subcategory) => ({
          ...subcategory,
          topics: subcategory.topics.map((topic) => {
            if (topic.id === topicId) {
              return { ...topic, ...updates };
            }
            return topic;
          }),
        })),
      }))
    );
  }, []);

  // Update topic status with workflow rules
  const updateTopicStatus = useCallback(
    (topicId: string, status: TopicStatus) => {
      const nowStr = new Date().toISOString();
      updateTopic(topicId, {
        status,
        completedAt: status === 'COMPLETED' ? nowStr : undefined,
        nextRevisionDate:
          status === 'COMPLETED'
            ? calculateNextRevisionDate(0, nowStr, settings.revisionIntervals)
            : status === 'REVISION'
            ? formatDateToYYYYMMDD(new Date())
            : undefined,
      });
    },
    [updateTopic, settings.revisionIntervals]
  );

  const updateTopicConfidence = useCallback(
    (topicId: string, confidence: ConfidenceLevel) => {
      updateTopic(topicId, { confidence });
    },
    [updateTopic]
  );

  const updateTopicNotes = useCallback(
    (topicId: string, notes: string) => {
      updateTopic(topicId, { notes });
    },
    [updateTopic]
  );

  const addTopicResource = useCallback(
    (topicId: string, resource: Omit<Resource, 'id'>) => {
      const newResource: Resource = {
        ...resource,
        id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      };
      setRoadmap((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          subcategories: category.subcategories.map((subcategory) => ({
            ...subcategory,
            topics: subcategory.topics.map((topic) => {
              if (topic.id === topicId) {
                return {
                  ...topic,
                  resources: [...(topic.resources || []), newResource],
                };
              }
              return topic;
            }),
          })),
        }))
      );
    },
    []
  );

  const deleteTopicResource = useCallback((topicId: string, resourceId: string) => {
    setRoadmap((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        subcategories: category.subcategories.map((subcategory) => ({
          ...subcategory,
          topics: subcategory.topics.map((topic) => {
            if (topic.id === topicId) {
              return {
                ...topic,
                resources: (topic.resources || []).filter((r) => r.id !== resourceId),
              };
            }
            return topic;
          }),
        })),
      }))
    );
  }, []);

  const addTopicProblem = useCallback(
    (topicId: string, problem: Omit<PracticeProblem, 'id'>) => {
      const newProblem: PracticeProblem = {
        ...problem,
        id: `prob-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      };
      setRoadmap((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          subcategories: category.subcategories.map((subcategory) => ({
            ...subcategory,
            topics: subcategory.topics.map((topic) => {
              if (topic.id === topicId) {
                return {
                  ...topic,
                  problems: [...(topic.problems || []), newProblem],
                };
              }
              return topic;
            }),
          })),
        }))
      );
    },
    []
  );

  const deleteTopicProblem = useCallback((topicId: string, problemId: string) => {
    setRoadmap((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        subcategories: category.subcategories.map((subcategory) => ({
          ...subcategory,
          topics: subcategory.topics.map((topic) => {
            if (topic.id === topicId) {
              return {
                ...topic,
                problems: (topic.problems || []).filter((p) => p.id !== problemId),
              };
            }
            return topic;
          }),
        })),
      }))
    );
  }, []);

  // Record a study session
  const recordStudySession = useCallback(
    (sessionData: Omit<StudySession, 'id'>) => {
      const sessionId = `sess-${Date.now()}`;
      const newSession: StudySession = {
        ...sessionData,
        id: sessionId,
      };

      setStudySessions((prev) => [newSession, ...prev]);

      // Update study time and lastStudiedAt on each selected topic
      const nowStr = new Date().toISOString();
      if (newSession.topicIds && newSession.topicIds.length > 0) {
        const minutesPerTopic = Math.round(newSession.durationMinutes / newSession.topicIds.length) || 1;
        setRoadmap((prevCategories) =>
          prevCategories.map((cat) => ({
            ...cat,
            subcategories: cat.subcategories.map((sub) => ({
              ...sub,
              topics: sub.topics.map((t) => {
                if (newSession.topicIds.includes(t.id)) {
                  return {
                    ...t,
                    totalStudyMinutes: (t.totalStudyMinutes || 0) + minutesPerTopic,
                    lastStudiedAt: nowStr,
                    confidence: newSession.confidence ?? t.confidence,
                    status: t.status === 'NOT_STARTED' ? 'LEARNING' : t.status,
                  };
                }
                return t;
              }),
            })),
          }))
        );
      }
    },
    []
  );

  const deleteStudySession = useCallback((sessionId: string) => {
    setStudySessions((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  // Record Revision
  const recordRevision = useCallback(
    (topicId: string, confidence: ConfidenceLevel, notes: string) => {
      const todayStr = formatDateToYYYYMMDD(new Date());

      // Find current topic
      let currentRevCount = 0;
      roadmap.forEach((cat) => {
        cat.subcategories.forEach((sub) => {
          const found = sub.topics.find((t) => t.id === topicId);
          if (found) {
            currentRevCount = found.revisionCount || 0;
          }
        });
      });

      const nextRevCount = currentRevCount + 1;
      const nextDate = calculateNextRevisionDate(nextRevCount, todayStr, settings.revisionIntervals);

      const newLog: RevisionLog = {
        id: `rev-${Date.now()}`,
        topicId,
        revisionNumber: nextRevCount,
        date: todayStr,
        confidence,
        notes,
      };

      setRevisionLogs((prev) => [newLog, ...prev]);

      updateTopic(topicId, {
        revisionCount: nextRevCount,
        nextRevisionDate: nextDate,
        confidence,
        lastStudiedAt: new Date().toISOString(),
      });
    },
    [roadmap, settings.revisionIntervals, updateTopic]
  );

  // Project mutators
  const updateProject = useCallback((projectId: string, updates: Partial<ProjectTrack>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return { ...p, ...updates };
        }
        return p;
      })
    );
  }, []);

  const toggleProjectFeature = useCallback((projectId: string, featureId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            features: p.features.map((f) => {
              if (f.id === featureId) {
                return { ...f, completed: !f.completed };
              }
              return f;
            }),
          };
        }
        return p;
      })
    );
  }, []);

  const toggleProjectAdvancedFeature = useCallback((projectId: string, key: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId && p.advancedFeatures) {
          return {
            ...p,
            advancedFeatures: {
              ...p.advancedFeatures,
              [key]: !p.advancedFeatures[key],
            },
          };
        }
        return p;
      })
    );
  }, []);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const resetAllData = useCallback(() => {
    clearAllDevTrackStorage();
    setRoadmap(initialRoadmapData);
    setStudySessions([]);
    setRevisionLogs([]);
    setProjects(initialProjectsData);
    setSettings(defaultSettings);
    setActiveModalTopicId(null);
    setIsTimerOpen(false);
  }, []);

  // Direct state setters for import
  const setRoadmapDirectly = useCallback((categories: Category[]) => setRoadmap(categories), []);
  const setSessionsDirectly = useCallback((sessions: StudySession[]) => setStudySessions(sessions), []);
  const setRevisionsDirectly = useCallback((revisions: RevisionLog[]) => setRevisionLogs(revisions), []);
  const setProjectsDirectly = useCallback((projList: ProjectTrack[]) => setProjects(projList), []);
  const setSettingsDirectly = useCallback((userSet: UserSettings) => setSettings(userSet), []);

  // Active topic lookup
  const activeTopicInfo = useMemo(() => {
    if (!activeModalTopicId) return { topic: null, category: null, subcategory: null };
    for (const cat of roadmap) {
      for (const sub of cat.subcategories) {
        const t = sub.topics.find((topic) => topic.id === activeModalTopicId);
        if (t) {
          return {
            topic: t,
            category: cat,
            subcategory: { id: sub.id, name: sub.name },
          };
        }
      }
    }
    return { topic: null, category: null, subcategory: null };
  }, [activeModalTopicId, roadmap]);

  // Overall statistics
  const overallStats = useMemo<OverallStats>(() => {
    let totalTopics = 0;
    let completedTopics = 0;
    let learningTopics = 0;
    let pendingTopics = 0;
    let revisionTopics = 0;
    let totalStudyMinutes = 0;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    let thisWeekCompleted = 0;
    let thisMonthCompleted = 0;

    roadmap.forEach((cat) => {
      cat.subcategories.forEach((sub) => {
        sub.topics.forEach((t) => {
          totalTopics++;
          totalStudyMinutes += t.totalStudyMinutes || 0;

          if (t.status === 'COMPLETED') {
            completedTopics++;
            if (t.completedAt) {
              const compDate = new Date(t.completedAt);
              if (compDate >= oneWeekAgo) thisWeekCompleted++;
              if (compDate >= oneMonthAgo) thisMonthCompleted++;
            }
          } else if (t.status === 'LEARNING') {
            learningTopics++;
          } else if (t.status === 'REVISION') {
            revisionTopics++;
          } else {
            pendingTopics++;
          }
        });
      });
    });

    const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return {
      totalTopics,
      completedTopics,
      learningTopics,
      pendingTopics,
      revisionTopics,
      completionPercentage,
      totalStudyMinutes,
      thisWeekCompleted,
      thisMonthCompleted,
    };
  }, [roadmap]);

  // Today study statistics
  const todayStudyStats = useMemo<TodayStudyStats>(() => {
    const todayStr = formatDateToYYYYMMDD(new Date());
    let todayMinutes = 0;

    studySessions.forEach((s) => {
      if (s.date === todayStr) {
        todayMinutes += s.durationMinutes;
      }
    });

    let todayCompletedCount = 0;
    roadmap.forEach((cat) => {
      cat.subcategories.forEach((sub) => {
        sub.topics.forEach((t) => {
          if (t.status === 'COMPLETED' && t.completedAt) {
            const compDateStr = formatDateToYYYYMMDD(new Date(t.completedAt));
            if (compDateStr === todayStr) {
              todayCompletedCount++;
            }
          }
        });
      });
    });

    const targetMinutes = settings.dailyStudyGoalMinutes || 120;
    const remainingMinutes = Math.max(0, targetMinutes - todayMinutes);

    return {
      todayStudyMinutes: todayMinutes,
      todayCompletedCount,
      targetMinutes,
      remainingMinutes,
    };
  }, [studySessions, roadmap, settings.dailyStudyGoalMinutes]);

  // Streaks
  const streakInfo = useMemo(() => {
    return calculateStreaks(studySessions);
  }, [studySessions]);

  // Topics due for revision
  const topicsDueForRevision = useMemo(() => {
    const allFlat = getAllTopicsFlat(roadmap).map((f) => f.topic);
    return filterTopicsDueForRevision(allFlat);
  }, [roadmap]);

  // Continue Learning Topic logic
  const continueLearningTopic = useMemo(() => {
    const allFlat = getAllTopicsFlat(roadmap);
    // Find latest topic where status != COMPLETED and lastStudiedAt exists
    const candidates = allFlat.filter(
      (item) => item.topic.status !== 'COMPLETED' && item.topic.lastStudiedAt !== null
    );

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => {
      const dateA = new Date(a.topic.lastStudiedAt!).getTime();
      const dateB = new Date(b.topic.lastStudiedAt!).getTime();
      return dateB - dateA;
    });

    return {
      topic: candidates[0].topic,
      category: candidates[0].category,
      subcategory: {
        id: candidates[0].subcategory.id,
        name: candidates[0].subcategory.name,
      },
    };
  }, [roadmap]);

  return (
    <LearningContext.Provider
      value={{
        roadmap,
        studySessions,
        revisionLogs,
        projects,
        settings,

        activeModalTopicId,
        activeTopic: activeTopicInfo.topic,
        activeCategory: activeTopicInfo.category,
        activeSubcategory: activeTopicInfo.subcategory,
        isTimerOpen,
        timerPresetTopicId,
        isSearchOpen,

        overallStats,
        todayStudyStats,
        streakInfo,
        topicsDueForRevision,
        continueLearningTopic,

        openTopicModal,
        closeTopicModal,
        openTimer,
        closeTimer,
        setSearchOpen,
        toggleDarkMode,

        updateTopic,
        updateTopicStatus,
        updateTopicConfidence,
        updateTopicNotes,
        addTopicResource,
        deleteTopicResource,
        addTopicProblem,
        deleteTopicProblem,

        recordStudySession,
        deleteStudySession,

        recordRevision,

        updateProject,
        toggleProjectFeature,
        toggleProjectAdvancedFeature,

        updateSettings,
        resetAllData,
        setRoadmapDirectly,
        setSessionsDirectly,
        setRevisionsDirectly,
        setProjectsDirectly,
        setSettingsDirectly,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
