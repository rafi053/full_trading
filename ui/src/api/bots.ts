import apiClient from "./client";
import { Bot, BotCreateInput, BotWithStats, BotStats } from "@/types/api";

export const botsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<BotWithStats[]> => {
    const response = await apiClient.get("/api/bots", { params });
    return response.data;
  },

  getById: async (id: string): Promise<BotWithStats> => {
    const response = await apiClient.get(`/api/bots/${id}`);
    return response.data;
  },

  create: async (data: BotCreateInput): Promise<Bot> => {
    const response = await apiClient.post("/api/bots", data);
    return response.data;
  },

  update: async (id: string, data: Partial<BotCreateInput>): Promise<Bot> => {
    const response = await apiClient.put(`/api/bots/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/bots/${id}`);
  },

  start: async (id: string): Promise<Bot> => {
    const response = await apiClient.post(`/api/bots/${id}/start`);
    return response.data;
  },

  stop: async (id: string): Promise<Bot> => {
    const response = await apiClient.post(`/api/bots/${id}/stop`);
    return response.data;
  },

  getStats: async (id: string): Promise<BotStats> => {
    const response = await apiClient.get(`/api/bots/${id}/stats`);
    return response.data;
  },

  getCount: async (params?: { status?: string }): Promise<number> => {
    const response = await apiClient.get("/api/bots/count", { params });
    return response.data;
  },
};
