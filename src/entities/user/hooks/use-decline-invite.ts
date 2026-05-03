import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DECLINE_WORKSPACE_INVITE } from "../api/decline-invite";
import { userHomeKeys } from "../api/user-home";
import type { DeclineWorkspaceInviteInput } from "@/gql/graphql";
import { useAuth } from "@/shared/hooks/use-auth";
import { GqlClient } from "@/shared/api";

export function useDeclineInvite() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DeclineWorkspaceInviteInput) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const client = GqlClient(token);
      return client.request(DECLINE_WORKSPACE_INVITE, { input });
    },
    onSuccess: (data) => {
      if (data.declineWorkspaceInvite.success) {
        toast.success(data.declineWorkspaceInvite.message);
        queryClient.invalidateQueries({ queryKey: userHomeKeys.all });
      } else {
        toast.error(data.declineWorkspaceInvite.message);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to decline invite");
    },
  });
}
