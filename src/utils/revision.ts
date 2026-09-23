import { Topic } from '../types/roadmap';
import { formatDateToYYYYMMDD } from './streak';

export const DEFAULT_REVISION_INTERVALS = [1, 3, 7, 14, 30]; // in days

export function calculateNextRevisionDate(
  currentRevisionCount: number,
  fromDateStr?: string | null,
  intervals: number[] = DEFAULT_REVISION_INTERVALS
): string {
  const baseDate = fromDateStr ? new Date(fromDateStr) : new Date();
  const daysToAdd = intervals[Math.min(currentRevisionCount, intervals.length - 1)] || 30;

  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  return formatDateToYYYYMMDD(nextDate);
}

export type RevisionUrgency = 'OVERDUE' | 'DUE_TODAY' | 'UPCOMING' | 'NONE';

export function getRevisionStatus(
  nextRevisionDateStr: string | null
): { urgency: RevisionUrgency; daysDiff: number; label: string } {
  if (!nextRevisionDateStr) {
    return { urgency: 'NONE', daysDiff: 0, label: 'Not scheduled' };
  }

  const todayStr = formatDateToYYYYMMDD(new Date());
  const today = new Date(todayStr + 'T00:00:00');
  const target = new Date(nextRevisionDateStr + 'T00:00:00');

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      urgency: 'OVERDUE',
      daysDiff: Math.abs(diffDays),
      label: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`,
    };
  } else if (diffDays === 0) {
    return {
      urgency: 'DUE_TODAY',
      daysDiff: 0,
      label: 'Due Today',
    };
  } else {
    return {
      urgency: 'UPCOMING',
      daysDiff: diffDays,
      label: `In ${diffDays} day${diffDays === 1 ? '' : 's'}`,
    };
  }
}

export function filterTopicsDueForRevision(topics: Topic[]): { topic: Topic; urgency: RevisionUrgency; daysDiff: number; label: string }[] {
  return topics
    .filter((t) => t.status === 'REVISION' || (t.status === 'COMPLETED' && t.nextRevisionDate))
    .map((topic) => {
      const status = getRevisionStatus(topic.nextRevisionDate);
      return { topic, ...status };
    })
    .sort((a, b) => {
      // Sort by urgency: OVERDUE first (most negative diffDays), then DUE_TODAY, then UPCOMING
      const urgencyOrder: Record<RevisionUrgency, number> = {
        OVERDUE: 1,
        DUE_TODAY: 2,
        UPCOMING: 3,
        NONE: 4,
      };
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      }
      return a.daysDiff - b.daysDiff;
    });
}
