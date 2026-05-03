export type MentionTier = "TIER_1" | "TIER_2" | "TIER_3";
export type MentionStatus = "ACTIVE" | "ORPHANED" | "REMOVED";

export interface Mention {
  id: string;
  sourceEntityId: string;
  sourceEntityType: string;
  targetEntityId: string;
  targetEntityType: string;
  displayText: string;
  sourceLocation: Record<string, unknown> | null;
  tier: MentionTier;
  status: MentionStatus;
  createdAt: string;
  createdById: string;
}

export interface Backlink {
  id: string;
  sourceEntityId: string;
  sourceEntityType: string;
  targetEntityId: string;
  targetEntityType: string;
  context: string | null;
  createdAt: string;
  sourceMention: Mention;
}

export interface BacklinkResult {
  backlinks: Array<Backlink>;
  total: number;
  hasMore: boolean;
}

export interface BacklinkFilters {
  sourceType?: string;
  actorId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateMentionInput {
  sourceEntityId: string;
  sourceEntityType: string;
  targetEntityId: string;
  targetEntityType: string;
  displayText: string;
  sourceLocation?: Record<string, unknown>;
}

export interface UpdateMentionInput {
  mentionId: string;
  displayText?: string;
  sourceLocation?: Record<string, unknown>;
}

export interface MentionEvent {
  id: string;
  mentionId: string;
  eventType: string;
  payload: Record<string, unknown>;
  actorId: string | null;
  createdAt: string;
}
