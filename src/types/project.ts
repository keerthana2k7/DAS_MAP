export type ProjectStatus = 'NOT_STARTED' | 'PLANNING' | 'DEVELOPMENT' | 'TESTING' | 'COMPLETED' | 'DEPLOYED';

export interface ProjectFeature {
  id: string;
  name: string;
  completed: boolean;
}

export interface ProjectTrack {
  id: string;
  title: string;
  subtitle: string;
  status: ProjectStatus;
  techStack: string[];
  features: ProjectFeature[];
  startDate: string | null;
  targetDate: string | null;
  repoUrl: string;
  liveUrl: string;
  notes: string;
  advancedFeatures?: { [key: string]: boolean };
}
