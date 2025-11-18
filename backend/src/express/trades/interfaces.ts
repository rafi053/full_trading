export enum TradeSide {
    BUY = 'BUY',
    SELL = 'SELL',
}

export enum TradeStatus {
    PENDING = 'PENDING',
    FILLED = 'FILLED',
    PARTIALLY_FILLED = 'PARTIALLY_FILLED',
    CANCELLED = 'CANCELLED',
    FAILED = 'FAILED',
}

export enum CloseReason {
    TAKE_PROFIT = 'TAKE_PROFIT',
    STOP_LOSS = 'STOP_LOSS',
    MANUAL = 'MANUAL',
    LIQUIDATION = 'LIQUIDATION',
    STRATEGY = 'STRATEGY',
}

export interface Trade {
    id: string;
    botId: string;
    positionId: string;
    exchange: string;
    symbol: string;

    side: TradeSide;
    status: TradeStatus;

    entryPrice: number;
    exitPrice?: number;
    quantity: number;
    leverage: number;

    pnl: number;
    pnlPercent: number;

    fees: number;
    fundingFees: number;

    duration: number;

    closeReason?: CloseReason;

    openedAt: Date;
    closedAt?: Date;

    metadata?: Record<string, any>;
}

export interface TradeStats {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;

    totalPnL: number;
    averagePnL: number;
    averageWin: number;
    averageLoss: number;

    largestWin: number;
    largestLoss: number;

    averageDuration: number;

    profitFactor: number;
    expectancy: number;

    maxConsecutiveWins: number;
    maxConsecutiveLosses: number;

    byDay: Record<
        string,
        {
            trades: number;
            pnl: number;
            winRate: number;
        }
    >;
}
