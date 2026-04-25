import { MailIcon } from "lucide-react";
import type { PendingInviteEntry } from "@/gql/graphql";
import { PendingInviteCard } from "./pending-invite-card";

interface Props {
  invites: PendingInviteEntry[];
}

export function PendingInvitesSection({ invites }: Props) {
  if (invites.length === 0) return null;

  return (
    <section className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <MailIcon className="h-4 w-4 text-[--txt-secondary]" />
        <h2 className="text-sm font-semibold text-[--txt-primary]">
          Pending Invites
        </h2>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[--accent-primary] px-1.5 text-xs font-medium text-white">
          {invites.length}
        </span>
      </div>

      {/* Invite cards */}
      <div className="space-y-2">
        {invites.map((invite) => (
          <PendingInviteCard
            key={invite.id}
            invite={invite}
            onDeclined={() => {}}
          />
        ))}
      </div>
    </section>
  );
}
