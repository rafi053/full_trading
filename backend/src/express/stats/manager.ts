import { TradeModel, TradeDocument } from '../trades/model';
import { Trade, TradeStatus } from '../trades/interfaces';
import { Document } from 'mongoose';

interface TimeframeFilters {
    timeframe?: string;
    exchange?: string;
}

interface PnLHistoryFilters extends TimeframeFilters {
    botId?: string;
    interval?: string;
}

interface TradeFilters {
    botId?: string;
    exchange?: string;
    limit?: number;
}

type LeanTrade = Omit<TradeDocument, keyof Document> & { _id: unknown };

export class StatsManager {
    static getStatsByBot = async (botId: string, filters?: TimeframeFilters) => {
        const query: Partial<Trade> = { botId, status: TradeStatus.FILLED };

        if (filters?.exchange) query.exchange = filters.exchange;

        if (filters?.timeframe && filters.timeframe !== 'all') {
            const now = new Date();
            const startDate = new Date();

            switch (filters.timeframe) {
                case 'day':
                    startDate.setDate(now.getDate() - 1);
                    break;
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case 'year':
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
            }

            query.closedAt = { $gte: startDate } as unknown as Date;
        }

        const trades = await TradeModel.find(query).lean();

        return this.calculateStats(trades as unknown as LeanTrade[]);
    };

    static getGlobalStats = async (filters?: TimeframeFilters) => {
        const query: Partial<Trade> = { status: TradeStatus.FILLED };

        if (filters?.exchange) query.exchange = filters.exchange;

        if (filters?.timeframe && filters.timeframe !== 'all') {
            const now = new Date();
            const startDate = new Date();

            switch (filters.timeframe) {
                case 'day':
                    startDate.setDate(now.getDate() - 1);
                    break;
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case 'year':
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
            }

            query.closedAt = { $gte: startDate } as unknown as Date;
        }

        const trades = await TradeModel.find(query).lean();

        const statsByBot = new Map<string, { trades: LeanTrade[]; botId: string }>();
        const statsByExchange = new Map<string, { trades: LeanTrade[]; exchange: string }>();
        const statsBySymbol = new Map<string, { trades: LeanTrade[]; symbol: string }>();

        trades.forEach((trade) => {
            const botId = trade.botId.toString();
            if (!statsByBot.has(botId)) {
                statsByBot.set(botId, { trades: [], botId });
            }
            statsByBot.get(botId)!.trades.push(trade as unknown as LeanTrade);

            if (!statsByExchange.has(trade.exchange)) {
                statsByExchange.set(trade.exchange, { trades: [], exchange: trade.exchange });
            }
            statsByExchange.get(trade.exchange)!.trades.push(trade as unknown as LeanTrade);

            if (!statsBySymbol.has(trade.symbol)) {
                statsBySymbol.set(trade.symbol, { trades: [], symbol: trade.symbol });
            }
            statsBySymbol.get(trade.symbol)!.trades.push(trade as unknown as LeanTrade);
        });

        const globalStats = this.calculateStats(trades as unknown as LeanTrade[]);

        return {
            ...globalStats,
            byBot: Array.from(statsByBot.values()).map((group) => ({
                botId: group.botId,
                ...this.calculateStats(group.trades),
            })),
            byExchange: Array.from(statsByExchange.values()).map((group) => ({
                exchange: group.exchange,
                ...this.calculateStats(group.trades),
            })),
            bySymbol: Array.from(statsBySymbol.values()).map((group) => ({
                symbol: group.symbol,
                ...this.calculateStats(group.trades),
            })),
        };
    };

    static getPnLHistory = async (filters?: PnLHistoryFilters) => {
        const query: Partial<Trade> = { status: TradeStatus.FILLED };

        if (filters?.botId) query.botId = filters.botId;
        if (filters?.exchange) query.exchange = filters.exchange;

        if (filters?.timeframe && filters.timeframe !== 'all') {
            const now = new Date();
            const startDate = new Date();

            switch (filters.timeframe) {
                case 'day':
                    startDate.setDate(now.getDate() - 1);
                    break;
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case 'year':
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
            }

            query.closedAt = { $gte: startDate } as unknown as Date;
        }

        const trades = await TradeModel.find(query).sort({ closedAt: 1 }).lean();

        const interval = filters?.interval ?? 'day';
        const history = new Map<string, { timestamp: string; pnl: number; cumulativePnl: number; trades: number }>();

        let cumulativePnl = 0;

        trades.forEach((trade) => {
            if (!trade.closedAt) return;

            const date = new Date(trade.closedAt);
            let key = date.toISOString().split('T')[0]!;

            switch (interval) {
                case 'hour':
                    key = `${date.toISOString().split('T')[0]} ${date.getHours()}:00`;
                    break;
                case 'day':
                    key = date.toISOString().split('T')[0]!;
                    break;
                case 'week': {
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split('T')[0]!;
                    break;
                }
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
            }

            if (!history.has(key)) {
                history.set(key, { timestamp: key, pnl: 0, cumulativePnl: 0, trades: 0 });
            }

            const historyEntry = history.get(key)!;
            historyEntry.pnl += trade.pnl;
            historyEntry.trades++;
            cumulativePnl += trade.pnl;
            historyEntry.cumulativePnl = cumulativePnl;
        });

        return Array.from(history.values()).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    };

    static getWinRateHistory = async (filters?: PnLHistoryFilters) => {
        const query: Partial<Trade> = { status: TradeStatus.FILLED };

        if (filters?.botId) query.botId = filters.botId;
        if (filters?.exchange) query.exchange = filters.exchange;

        if (filters?.timeframe && filters.timeframe !== 'all') {
            const now = new Date();
            const startDate = new Date();

            switch (filters.timeframe) {
                case 'day':
                    startDate.setDate(now.getDate() - 1);
                    break;
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case 'year':
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
            }

            query.closedAt = { $gte: startDate } as unknown as Date;
        }

        const trades = await TradeModel.find(query).sort({ closedAt: 1 }).lean();

        const interval = filters?.interval ?? 'day';
        const history = new Map<string, { timestamp: string; winRate: number; wins: number; losses: number; total: number }>();

        trades.forEach((trade) => {
            if (!trade.closedAt) return;

            const date = new Date(trade.closedAt);
            let key = date.toISOString().split('T')[0]!;

            switch (interval) {
                case 'hour':
                    key = `${date.toISOString().split('T')[0]} ${date.getHours()}:00`;
                    break;
                case 'day':
                    key = date.toISOString().split('T')[0]!;
                    break;
                case 'week': {
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split('T')[0]!;
                    break;
                }
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
            }

            if (!history.has(key)) {
                history.set(key, { timestamp: key, winRate: 0, wins: 0, losses: 0, total: 0 });
            }

            const historyEntry = history.get(key)!;
            historyEntry.total++;
            if (trade.pnl > 0) {
                historyEntry.wins++;
            } else if (trade.pnl < 0) {
                historyEntry.losses++;
            }

            historyEntry.winRate = (historyEntry.wins / historyEntry.total) * 100;
        });

        return Array.from(history.values()).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    };

    static getBestTrades = async (filters?: TradeFilters) => {
        const query: Partial<Trade> = { status: TradeStatus.FILLED };

        if (filters?.botId) query.botId = filters.botId;
        if (filters?.exchange) query.exchange = filters.exchange;

        const limit = filters?.limit ?? 10;

        return TradeModel.find(query)
            .populate('botId', 'name type')
            .populate('positionId', 'symbol side')
            .sort({ pnl: -1 })
            .limit(limit)
            .lean()
            .exec();
    };

    static getWorstTrades = async (filters?: TradeFilters) => {
        const query: Partial<Trade> = { status: TradeStatus.FILLED };

        if (filters?.botId) query.botId = filters.botId;
        if (filters?.exchange) query.exchange = filters.exchange;

        const limit = filters?.limit ?? 10;

        return TradeModel.find(query)
            .populate('botId', 'name type')
            .populate('positionId', 'symbol side')
            .sort({ pnl: 1 })
            .limit(limit)
            .lean()
            .exec();
    };

    private static calculateStats = (trades: LeanTrade[]) => {
        if (trades.length === 0) {
            return {
                totalTrades: 0,
                winningTrades: 0,
                losingTrades: 0,
                winRate: 0,
                totalPnL: 0,
                averagePnL: 0,
                averageWin: 0,
                averageLoss: 0,
                largestWin: 0,
                largestLoss: 0,
                averageDuration: 0,
                profitFactor: 0,
                expectancy: 0,
                maxConsecutiveWins: 0,
                maxConsecutiveLosses: 0,
                totalFees: 0,
                totalFundingFees: 0,
            };
        }

        const winningTrades = trades.filter((t) => t.pnl > 0);
        const losingTrades = trades.filter((t) => t.pnl < 0);

        const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
        const totalWinPnL = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
        const totalLossPnL = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));

        let currentWinStreak = 0;
        let currentLossStreak = 0;
        let maxConsecutiveWins = 0;
        let maxConsecutiveLosses = 0;

        trades.forEach((trade) => {
            if (trade.pnl > 0) {
                currentWinStreak++;
                currentLossStreak = 0;
                maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWinStreak);
            } else if (trade.pnl < 0) {
                currentLossStreak++;
                currentWinStreak = 0;
                maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLossStreak);
            }
        });

        return {
            totalTrades: trades.length,
            winningTrades: winningTrades.length,
            losingTrades: losingTrades.length,
            winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
            totalPnL,
            averagePnL: totalPnL / trades.length,
            averageWin: winningTrades.length > 0 ? totalWinPnL / winningTrades.length : 0,
            averageLoss: losingTrades.length > 0 ? totalLossPnL / losingTrades.length : 0,
            largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map((t) => t.pnl)) : 0,
            largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map((t) => t.pnl)) : 0,
            averageDuration: trades.reduce((sum, t) => sum + (t.duration ?? 0), 0) / trades.length,
            profitFactor: totalLossPnL > 0 ? totalWinPnL / totalLossPnL : totalWinPnL > 0 ? Infinity : 0,
            expectancy: trades.length > 0 ? totalPnL / trades.length : 0,
            maxConsecutiveWins,
            maxConsecutiveLosses,
            totalFees: trades.reduce((sum, t) => sum + (t.fees ?? 0), 0),
            totalFundingFees: trades.reduce((sum, t) => sum + (t.fundingFees ?? 0), 0),
        };
    };
}
