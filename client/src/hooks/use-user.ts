
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const response = await fetch("/api/user", {
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 401) {
          return null;
        }
        throw new Error("Failed to fetch user");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  return { user };
}
