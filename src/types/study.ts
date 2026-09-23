import { ConfidenceLevel } from './roadmap';

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // ISO string
  endTime: string; // ISO string
  durationMinutes: number;
  topicIds: string[];
  notes: string;
  confidence: ConfidenceLevel;
}

export type GoalPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type GoalType = 'STUDY_HOURS' | 'TOPICS_COMPLETED';

export interface Goal {
  id: string;
  type: GoalType;
  target: number; // e.g., 2 (hours), 15 (topics)
  period: GoalPeriod;
  startDate?: string;
  endDate?: string;
}

export interface RevisionLog {
  id: string;
  topicId: string;
  revisionNumber: number;
  date: string; // YYYY-MM-DD
  confidence: ConfidenceLevel;
  notes: string;
}

export interface UserSettings {
  darkMode: boolean;
  dailyStudyGoalMinutes: number; // e.g. 120 (2 hours)
  weeklyTopicsGoal: number; // e.g. 15
  monthlyTopicsGoal: number; // e.g. 50
  revisionIntervals: number[]; // e.g. [1, 3, 7, 14, 30]
}
