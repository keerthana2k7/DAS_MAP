import { Category } from '../types/roadmap';
import { StudySession, RevisionLog, UserSettings } from '../types/study';
import { ProjectTrack } from '../types/project';
import { STORAGE_KEYS, saveToStorage } from './storage';

export interface DevTrackExportPayload {
  version: string;
  exportedAt: string;
  roadmap: Category[];
  sessions: StudySession[];
  revisions: RevisionLog[];
  projects: ProjectTrack[];
  settings: UserSettings;
}

export function exportDevTrackData(
  roadmap: Category[],
  sessions: StudySession[],
  revisions: RevisionLog[],
  projects: ProjectTrack[],
  settings: UserSettings
): void {
  const payload: DevTrackExportPayload = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    roadmap,
    sessions,
    revisions,
    projects,
    settings,
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  link.download = `devtrack-backup-${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function validateImportPayload(data: unknown): data is DevTrackExportPayload {
  if (!data || typeof data !== 'object') return false;
  const p = data as Partial<DevTrackExportPayload>;
  if (!Array.isArray(p.roadmap)) return false;
  return true;
}

export function parseAndApplyImportData(
  jsonText: string,
  callbacks: {
    setRoadmap: (r: Category[]) => void;
    setSessions: (s: StudySession[]) => void;
    setRevisions: (rev: RevisionLog[]) => void;
    setProjects: (p: ProjectTrack[]) => void;
    setSettings: (set: UserSettings) => void;
  }
): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonText);
    if (!validateImportPayload(parsed)) {
      return { success: false, message: 'Invalid DevTrack JSON format: Missing roadmap data.' };
    }

    if (parsed.roadmap) {
      callbacks.setRoadmap(parsed.roadmap);
      saveToStorage(STORAGE_KEYS.ROADMAP, parsed.roadmap);
    }
    if (parsed.sessions && Array.isArray(parsed.sessions)) {
      callbacks.setSessions(parsed.sessions);
      saveToStorage(STORAGE_KEYS.SESSIONS, parsed.sessions);
    }
    if (parsed.revisions && Array.isArray(parsed.revisions)) {
      callbacks.setRevisions(parsed.revisions);
      saveToStorage(STORAGE_KEYS.REVISIONS, parsed.revisions);
    }
    if (parsed.projects && Array.isArray(parsed.projects)) {
      callbacks.setProjects(parsed.projects);
      saveToStorage(STORAGE_KEYS.PROJECTS, parsed.projects);
    }
    if (parsed.settings && typeof parsed.settings === 'object') {
      callbacks.setSettings(parsed.settings);
      saveToStorage(STORAGE_KEYS.SETTINGS, parsed.settings);
    }

    return { success: true, message: 'Data imported and restored successfully!' };
  } catch (err) {
    return {
      success: false,
      message: `Failed to parse JSON file: ${(err as Error).message}`,
    };
  }
}
