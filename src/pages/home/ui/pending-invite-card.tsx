import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Building2Icon, Loader2Icon } from "lucide-react";
import type { PendingInviteEntry } from "@/gql/graphql";
import { Badge, Button  } from "@/shared/ui";
import { useDeclineInvite } from "@/entities/user/hooks/use-decline-invite";

interface Props {
  invite: PendingInviteEntry;
  onDeclined: (inviteId: string) => void;
}

export function PendingInviteCard({ invite, onDeclined }: Props) {
  const navigate = useNavigate();
  const { mutate: decline, isPending: isDeclining } = useDeclineInvite();
  const [declined, setDeclined] = useState(false);

  const handleAccept = () => {
    navigate({
      to: "/workspace/join",
      search: { token: invite.token },
    });
  };

  const handleDecline = () => {
    decline(
      { token: invite.token },
      {
        onSuccess: () => {
          setDeclined(true);
          onDeclined(invite.id);
        },
      }
    );
  };

  if (declined) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[--border-subtle] bg-[--bg-secondary] px-4 py-3">
      {/* Workspace icon */}
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[--bg-tertiary]">
        <Building2Icon className="h-4 w-4 text-[--txt-tertiary]" />
      </div>

      {/* Workspace + role info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-[--txt-primary]">
          {invite.workspaceName}
        </p>
        <p className="text-xs text-[--txt-secondary]">
          Invited as <Badge variant="outline">{invite.role}</Badge>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleDecline}
          disabled={isDeclining}
        >
          {isDeclining ? (
            <Loader2Icon className="h-3 w-3 animate-spin" />
          ) : (
            "Decline"
          )}
        </Button>
        <Button size="sm" onClick={handleAccept}>
          Accept
        </Button>
      </div>
    </div>
  );
}
