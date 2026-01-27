export const recoveryKeys = {
  all: ['chat-recovery'] as const,
  delta: (
    conversationId: string,
    options: { afterStreamId: string; limit?: number },
  ) => [...recoveryKeys.all, conversationId, options] as const,
}
