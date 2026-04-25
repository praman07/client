import { useAuth } from "@/shared/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { GqlClient } from "@/shared/api";
import { GET_USER_HOME_QUERY, userHomeKeys } from "../api/user-home";
import type { UserHomeData } from "@/gql/graphql";

export function useUserHome() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: userHomeKeys.detail(),
    queryFn: async (): Promise<UserHomeData | null> => {
      const token = await getToken();
      if (!token) return null;
      const client = GqlClient(token);
      const data = await client.request<{ userHome: UserHomeData }>(
        GET_USER_HOME_QUERY
      );
      return data.userHome ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}
