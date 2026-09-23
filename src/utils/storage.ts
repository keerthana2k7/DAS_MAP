export const STORAGE_KEYS = {
  ROADMAP: 'devtrack_roadmap_data_v1',
  SESSIONS: 'devtrack_study_sessions_v1',
  REVISIONS: 'devtrack_revision_logs_v1',
  PROJECTS: 'devtrack_projects_data_v1',
  SETTINGS: 'devtrack_user_settings_v1',
  TIMER_STATE: 'devtrack_timer_state_v1',
};

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    return parsed ?? defaultValue;
  } catch (err) {
    console.error(`[DevTrack] Failed to load key "${key}" from localStorage:`, err);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[DevTrack] Failed to save key "${key}" to localStorage:`, err);
    return false;
  }
}

export function clearStorageKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`[DevTrack] Failed to clear key "${key}":`, err);
  }
}

export function clearAllDevTrackStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
