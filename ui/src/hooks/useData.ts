import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { positionsApi } from '@/api/positions';
import { tradesApi } from '@/api/trades';
import { toast } from 'react-toastify';

export const POSITIONS_QUERY_KEY = 'positions';
export const TRADES_QUERY_KEY = 'trades';

export const usePositions = (params?: { page?: number; limit?: number; botId?: string }) => {
  return useQuery({
    queryKey: [POSITIONS_QUERY_KEY, params],
    queryFn: () => positionsApi.getAll(params),
    refetchInterval: 3000,
  });
};

export const usePosition = (id: string) => {
  return useQuery({
    queryKey: [POSITIONS_QUERY_KEY, id],
    queryFn: () => positionsApi.getById(id),
    enabled: !!id,
    refetchInterval: 3000,
  });
};

export const useClosePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => positionsApi.close(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POSITIONS_QUERY_KEY] });
      toast.success('Position closed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to close position');
    },
  });
};

export const useTrades = (params?: { 
  page?: number; 
  limit?: number; 
  botId?: string;
  symbol?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: [TRADES_QUERY_KEY, params],
    queryFn: () => tradesApi.getAll(params),
    refetchInterval: 5000,
  });
};

export const useTrade = (id: string) => {
  return useQuery({
    queryKey: [TRADES_QUERY_KEY, id],
    queryFn: () => tradesApi.getById(id),
    enabled: !!id,
  });
};
