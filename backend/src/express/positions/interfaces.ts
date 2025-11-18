export enum PositionSide {
    LONG = 'LONG',
    SHORT = 'SHORT',
}

export enum PositionStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    LIQUIDATED = 'LIQUIDATED',
}

export interface Position {
    id: string;
    botId: string;
    exchange: string;
    symbol: string;
    side: PositionSide;
    status: PositionStatus;
    entryPrice: number;
    currentPrice: number;
    liquidationPrice: number;
    quantity: number;
    leverage: number;
    margin: number;
    unrealizedPnL: number;
    realizedPnL: number;
    takeProfit?: number;
    stopLoss?: number;
    openedAt: Date;
    closedAt?: Date;
    updatedAt: Date;
    fees: number;
    fundingFees: number;
}

export interface PositionSummary {
    totalOpen: number;
    totalLong: number;
    totalShort: number;
    totalUnrealizedPnL: number;
    totalMargin: number;
    byBot: Record<
        string,
        {
            open: number;
            unrealizedPnL: number;
        }
    >;
    byExchange: Record<
        string,
        {
            open: number;
            unrealizedPnL: number;
        }
    >;
}

export interface PositionCreateInput {
    botId: string;
    exchange: string;
    symbol: string;
    side: PositionSide;
    entryPrice: number;
    currentPrice: number;
    liquidationPrice: number;
    quantity: number;
    leverage: number;
    margin: number;
    takeProfit?: number;
    stopLoss?: number;
}
