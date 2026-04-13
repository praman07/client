export type DndDuration = '1h' | '4h' | 'tomorrow' | 'custom';

export const DND_DURATION_PRESETS: Record<DndDuration, number | null> = {
  '1h': 60 * 60 * 1000,
  '4h': 4 * 60 * 60 * 1000,
  'tomorrow': null,
  'custom': null,
};
