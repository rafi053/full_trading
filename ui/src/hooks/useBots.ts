import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { botsApi } from '@/api/bots';
import { BotCreateInput } from '@/types/api';
import { toast } from 'react-toastify';

export const BOTS_QUERY_KEY = 'bots';

export const useBots = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: [BOTS_QUERY_KEY, params],
    queryFn: () => botsApi.getAll(params),
    refetchInterval: 5000,
  });
};

export const useBot = (id: string) => {
  return useQuery({
    queryKey: [BOTS_QUERY_KEY, id],
    queryFn: () => botsApi.getById(id),
    enabled: !!id,
    refetchInterval: 3000,
  });
};

export const useBotStats = (id: string) => {
  return useQuery({
    queryKey: [BOTS_QUERY_KEY, id, 'stats'],
    queryFn: () => botsApi.getStats(id),
    enabled: !!id,
    refetchInterval: 5000,
  });
};

export const useCreateBot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BotCreateInput) => botsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOTS_QUERY_KEY] });
      toast.success('Bot created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create bot');
    },
  });
};

export const useUpdateBot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BotCreateInput> }) =>
      botsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [BOTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOTS_QUERY_KEY, id] });
      toast.success('Bot updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update bot');
    },
  });
};

export const useDeleteBot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => botsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOTS_QUERY_KEY] });
      toast.success('Bot deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete bot');
    },
  });
};

export const useStartBot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => botsApi.start(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [BOTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOTS_QUERY_KEY, id] });
      toast.success('Bot started successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to start bot');
    },
  });
};

export const useStopBot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => botsApi.stop(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [BOTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOTS_QUERY_KEY, id] });
      toast.success('Bot stopped successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to stop bot');
    },
  });
};
