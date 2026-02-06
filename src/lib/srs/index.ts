/**
 * Simplified SM-2 Algorithm for Spaced Repetition
 *
 * Based on the SuperMemo SM-2 algorithm, adapted for language learning.
 */

export interface SRSItem {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
  lastReviewed: Date;
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

// Quality ratings:
// 0 - Complete blackout
// 1 - Incorrect, but recognized upon seeing answer
// 2 - Incorrect, but answer seemed easy to recall
// 3 - Correct with serious difficulty
// 4 - Correct with hesitation
// 5 - Perfect recall

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

export function calculateNextReview(
  current: Partial<SRSItem>,
  quality: ReviewQuality
): SRSItem {
  const easeFactor = current.easeFactor ?? DEFAULT_EASE_FACTOR;
  const interval = current.interval ?? 0;
  const repetitions = current.repetitions ?? 0;

  let newEaseFactor = easeFactor;
  let newInterval = interval;
  let newRepetitions = repetitions;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newRepetitions = repetitions + 1;
  } else {
    // Incorrect response - reset
    newInterval = 1;
    newRepetitions = 0;
  }

  // Update ease factor
  newEaseFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEaseFactor = Math.max(MIN_EASE_FACTOR, newEaseFactor);

  const now = new Date();
  const nextReview = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview,
    lastReviewed: now,
  };
}

export function isDueForReview(item: SRSItem): boolean {
  return new Date() >= new Date(item.nextReview);
}

export function getDueItems<T extends { nextReview: Date | string | null }>(
  items: T[]
): T[] {
  const now = new Date();
  return items.filter((item) => {
    if (!item.nextReview) return true;
    return new Date(item.nextReview) <= now;
  });
}

export function sortByDueDate<T extends { nextReview: Date | string | null }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    if (!a.nextReview) return -1;
    if (!b.nextReview) return 1;
    return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
  });
}

export function getReviewStats(items: SRSItem[]): {
  dueNow: number;
  dueTomorrow: number;
  dueThisWeek: number;
  mastered: number;
} {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  let dueNow = 0;
  let dueTomorrow = 0;
  let dueThisWeek = 0;
  let mastered = 0;

  for (const item of items) {
    const reviewDate = new Date(item.nextReview);

    if (reviewDate <= now) {
      dueNow++;
    } else if (reviewDate <= tomorrow) {
      dueTomorrow++;
    } else if (reviewDate <= nextWeek) {
      dueThisWeek++;
    }

    // Consider mastered if interval > 30 days
    if (item.interval >= 30) {
      mastered++;
    }
  }

  return { dueNow, dueTomorrow, dueThisWeek, mastered };
}

/**
 * Simplified review buttons for user interface
 */
export function getSimpleQuality(response: "again" | "hard" | "good" | "easy"): ReviewQuality {
  switch (response) {
    case "again":
      return 1;
    case "hard":
      return 3;
    case "good":
      return 4;
    case "easy":
      return 5;
  }
}

export function getNextIntervalPreview(
  current: Partial<SRSItem>,
  response: "again" | "hard" | "good" | "easy"
): string {
  const quality = getSimpleQuality(response);
  const result = calculateNextReview(current, quality);

  if (result.interval < 1) {
    return "< 1 день";
  } else if (result.interval === 1) {
    return "1 день";
  } else if (result.interval < 7) {
    return `${result.interval} дн.`;
  } else if (result.interval < 30) {
    const weeks = Math.round(result.interval / 7);
    return `${weeks} нед.`;
  } else {
    const months = Math.round(result.interval / 30);
    return `${months} мес.`;
  }
}
