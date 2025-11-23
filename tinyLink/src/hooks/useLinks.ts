import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addLink, getLink, getAllLinks, deleteLink } from "../services/linkService";

export const LINKS_QUERY_KEY = ["links"];

/**
 * Hook to fetch all links
 */
export const useGetAllLinks = () => {
  return useQuery({
    queryKey: LINKS_QUERY_KEY,
    queryFn: getAllLinks,
  });
};

/**
 * Hook to fetch a single link by slug
 */
export const useGetLink = (slug: string) => {
  return useQuery({
    queryKey: ["link", slug],
    queryFn: () => getLink(slug),
    enabled: !!slug,
  });
};

/**
 * Hook to create a new short link
 */
export const useAddLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addLink,
    onSuccess: () => {
      // Invalidate and refetch links query
      queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEY });
    },
  });
};

/**
 * Hook to delete a link
 */
export const useDeleteLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      // Invalidate and refetch links query
      queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEY });
    },
  });
};
