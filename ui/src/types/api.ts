export enum BotStatus {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  ERROR = 'ERROR',
  STARTING = 'STARTING',
  STOPPING = 'STOPPING',
}

export enum BotType {
  TREND_LONG = 'TREND_LONG',
  TREND_SHORT = 'TREND_SHORT',
}

export interface BotConfig {
  exchange: string;
  symbol: string;
  leverage: number;
  positionSize: number;
  strategy: Record<string, any>;
  riskManagement: {
    maxDailyLoss: number;
    maxOpenPositions: number;
    stopLossPercent: number;
    takeProfitPercent: number;
  };
}

export interface Bot {
  id: string;
  name: string;
  type: BotType;
  exchange: string;
  status: BotStatus;
  config: BotConfig;
  createdAt: string;
  updatedAt: string;
  lastStartedAt?: string;
  lastStoppedAt?: string;
}

export interface BotStats {
  botId: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalPnL: number;
  todayPnL: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  sharpeRatio: number;
  updatedAt: string;
}

export interface BotCreateInput {
  name: string;
  type: BotType;
  exchange: string;
  config: BotConfig;
}

export interface BotWithStats extends Bot {
  stats: BotStats | null;
  openPositions: number;
}

export interface Position {
  id: string;
  botId: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  markPrice: number;
  leverage: number;
  liquidationPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Trade {
  id: string;
  botId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT';
  price: number;
  amount: number;
  total: number;
  fee: number;
  pnl?: number;
  timestamp: string;
}

export interface Balance {
  exchange: string;
  asset: string;
  free: number;
  locked: number;
  total: number;
  usdValue: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
