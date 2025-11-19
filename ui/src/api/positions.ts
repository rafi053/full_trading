import apiClient from './client';
import { Position, PaginatedResponse } from '@/types/api';

export const positionsApi = {
  getAll: async (params?: { page?: number; limit?: number; botId?: string }): Promise<PaginatedResponse<Position>> => {
    const response = await apiClient.get('/api/positions', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Position> => {
    const response = await apiClient.get(`/api/positions/${id}`);
    return response.data;
  },

  close: async (id: string): Promise<void> => {
    await apiClient.post(`/api/positions/${id}/close`);
  },

  getByBotId: async (botId: string): Promise<Position[]> => {
    const response = await apiClient.get(`/api/positions`, { params: { botId } });
    return response.data.data;
  },
};
