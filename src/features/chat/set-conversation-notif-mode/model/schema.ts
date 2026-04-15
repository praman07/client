import { z } from 'zod';

export const MuteDurationSchema = z.enum(['1h', '4h', '8h', '24h', 'indefinite']);

export type MuteDurationInput = z.infer<typeof MuteDurationSchema>;

export function muteDurationToISO(duration: MuteDurationInput | null): string | null {
  if (!duration) return null;
  if (duration === 'indefinite') return null;
  const hours: Record<string, number> = { '1h': 1, '4h': 4, '8h': 8, '24h': 24 };
  return new Date(Date.now() + (hours[duration] ?? 0) * 60 * 60 * 1000).toISOString();
}
