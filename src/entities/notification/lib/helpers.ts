import { DND_DURATION_PRESETS } from '../model';
import type { DndDuration } from '../model';

export function calculateDndUntil(duration: DndDuration): Date | null {
  if (duration === 'tomorrow') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);
    return tomorrow;
  }

  if (duration === 'custom') {
    return null;
  }

  const ms = DND_DURATION_PRESETS[duration];
  if (ms === null) return null;

  return new Date(Date.now() + ms);
}

export function formatDndDuration(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (60 * 60 * 1000));
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''}`;
}

export function isDndExpired(dndUntil: string | null): boolean {
  if (!dndUntil) return false;
  return new Date(dndUntil) < new Date();
}