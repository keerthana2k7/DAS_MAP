export type TopicStatus = 'NOT_STARTED' | 'LEARNING' | 'COMPLETED' | 'REVISION';

export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;

export type ResourceType = 'YouTube' | 'Documentation' | 'Article' | 'Course' | 'Practice' | 'GitHub' | 'Other';

export interface Resource {
  id: string;
  name: string;
  url: string;
  type: ResourceType;
}

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface PracticeProblem {
  id: string;
  name: string;
  platform: string;
  difficulty: ProblemDifficulty;
  url: string;
  solvedDate: string;
  notes?: string;
}

export interface Topic {
  id: string;
  subcategoryId: string;
  name: string;
  status: TopicStatus;
  confidence: ConfidenceLevel;
  totalStudyMinutes: number;
  lastStudiedAt: string | null;
  completedAt: string | null;
  revisionCount: number;
  nextRevisionDate: string | null;
  notes: string;
  resources: Resource[];
  problems?: PracticeProblem[];
  order: number;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  order: number;
  topics: Topic[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
  iconName?: string;
  subcategories: Subcategory[];
}
