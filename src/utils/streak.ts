import { StudySession } from '../types/study';

export interface DayActivity {
  date: string; // YYYY-MM-DD
  minutes: number;
  sessionCount: number;
  topicsCount: number;
  level: 0 | 1 | 2 | 3 | 4; // 0 = none, 1 = 1-30m, 2 = 31-60m, 3 = 61-120m, 4 = >120m
}

export function formatDateToYYYYMMDD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateStreaks(sessions: StudySession[]): { currentStreak: number; longestStreak: number; totalStudyDays: number } {
  if (!sessions || sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalStudyDays: 0 };
  }

  // Set of dates with study activity
  const activeDatesSet = new Set<string>();
  sessions.forEach((s) => {
    if (s.durationMinutes > 0 || (s.topicIds && s.topicIds.length > 0)) {
      activeDatesSet.add(s.date);
    }
  });

  const totalStudyDays = activeDatesSet.size;
  if (totalStudyDays === 0) {
    return { currentStreak: 0, longestStreak: 0, totalStudyDays: 0 };
  }

  const sortedDates = Array.from(activeDatesSet).sort();

  // Find longest streak
  let longestStreak = 0;
  let currentRun = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const curDate = new Date(dateStr + 'T00:00:00');
    if (!prevDate) {
      currentRun = 1;
    } else {
      const diffDays = Math.round((curDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentRun++;
      } else if (diffDays > 1) {
        currentRun = 1;
      }
    }
    prevDate = curDate;
    if (currentRun > longestStreak) {
      longestStreak = currentRun;
    }
  }

  // Calculate current streak
  const todayStr = formatDateToYYYYMMDD(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateToYYYYMMDD(yesterday);

  let currentStreak = 0;
  // If studied today or yesterday, streak is alive
  if (activeDatesSet.has(todayStr) || activeDatesSet.has(yesterdayStr)) {
    let checkDate = activeDatesSet.has(todayStr) ? new Date() : yesterday;
    while (activeDatesSet.has(formatDateToYYYYMMDD(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalStudyDays,
  };
}

export function generateActivityCalendar(sessions: StudySession[], daysCount = 90): DayActivity[] {
  const activityMap = new Map<string, { minutes: number; sessionCount: number; topicSet: Set<string> }>();

  sessions.forEach((s) => {
    const existing = activityMap.get(s.date) || { minutes: 0, sessionCount: 0, topicSet: new Set<string>() };
    existing.minutes += s.durationMinutes;
    existing.sessionCount += 1;
    (s.topicIds || []).forEach((id) => existing.topicSet.add(id));
    activityMap.set(s.date, existing);
  });

  const result: DayActivity[] = [];
  const today = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateToYYYYMMDD(d);
    const data = activityMap.get(dateStr);

    const minutes = data ? data.minutes : 0;
    const sessionCount = data ? data.sessionCount : 0;
    const topicsCount = data ? data.topicSet.size : 0;

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (minutes > 0 || sessionCount > 0) {
      if (minutes >= 120) level = 4;
      else if (minutes >= 60) level = 3;
      else if (minutes >= 30) level = 2;
      else level = 1;
    }

    result.push({
      date: dateStr,
      minutes,
      sessionCount,
      topicsCount,
      level,
    });
  }

  return result;
}
