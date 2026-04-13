export const notificationKeys = {
  all: ['notifications'] as const,

  summary: () => [...notificationKeys.all, 'summary'] as const,
  emailEnabled: () => [...notificationKeys.all, 'email'] as const,
  pushEnabled: () => [...notificationKeys.all, 'push'] as const,
  dndStatus: () => [...notificationKeys.all, 'dnd'] as const,
  list: (filters?: { isRead?: boolean }) =>
    [...notificationKeys.all, 'list', filters ?? {}] as const,
};
