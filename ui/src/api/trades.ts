import apiClient from './client';
import { Trade, PaginatedResponse } from '@/types/api';

export const tradesApi = {
  getAll: async (params?: { 
    page?: number; 
    limit?: number; 
    botId?: string;
    symbol?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<Trade>> => {
    const response = await apiClient.get('/api/trades', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Trade> => {
    const response = await apiClient.get(`/api/trades/${id}`);
    return response.data;
  },

  getByBotId: async (botId: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Trade>> => {
    const response = await apiClient.get(`/api/trades`, { params: { ...params, botId } });
    return response.data;
  },
};
