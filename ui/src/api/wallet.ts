import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface Balance {
  exchange: string;
  asset: string;
  free: number;
  locked: number;
  total: number;
  unrealizedPnl?: number;
}

export interface BalanceResponse {
  success: boolean;
  data: Balance[];
}

export const walletApi = {
  getBitunixBalance: async (): Promise<BalanceResponse> => {
    const response = await axios.get(`${API_BASE_URL}/api/balances`);
    return response.data;
  },
};
