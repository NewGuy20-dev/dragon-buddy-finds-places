import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Default fetcher function for queries
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Configure the default query function
queryClient.setDefaultOptions({
  queries: {
    queryFn: ({ queryKey }) => {
      if (Array.isArray(queryKey) && queryKey.length > 0) {
        return apiRequest(queryKey[0] as string);
      }
      return apiRequest(queryKey as string);
    },
  },
});