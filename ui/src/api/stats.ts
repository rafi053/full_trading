import apiClient from './client';

export interface GlobalStats {
  totalBots: number;
  runningBots: number;
  totalTrades: number;
  totalPnL: number;
  todayPnL: number;
  winRate: number;
  totalVolume: number;
}

export const statsApi = {
  getGlobal: async (): Promise<GlobalStats> => {
    const response = await apiClient.get('/api/stats/global');
    return response.data;
  },

  getByBot: async (botId: string): Promise<any> => {
    const response = await apiClient.get(`/api/stats/bot/${botId}`);
    return response.data;
  },

  getPerformance: async (params?: { period?: string; botId?: string }): Promise<any> => {
    const response = await apiClient.get('/api/stats/performance', { params });
    return response.data;
  },
};
