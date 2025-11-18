import { DocumentNotFoundError } from '../../utils/errors';
import { PositionModel } from './model';
import { Position, PositionStatus, PositionSide, PositionCreateInput } from './interfaces';
import { WebSocketEvent, WebSocketServer } from '../WebSocketServer';

export class PositionsManager {
    static getByQuery = async (query: Partial<Position>, step: number, limit?: number) => {
        return PositionModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .populate('botId', 'name type exchange')
            .sort({ openedAt: -1 })
            .lean()
            .exec();
    };

    static getById = async (positionId: string) => {
        return PositionModel.findById(positionId)
            .populate('botId', 'name type exchange config')
            .orFail(new DocumentNotFoundError(positionId))
            .lean()
            .exec();
    };

    static getOpen = async (filters?: { botId?: string; exchange?: string; symbol?: string }) => {
        const query: Partial<Position> = { status: PositionStatus.OPEN };

        if (filters?.botId) query.botId = filters.botId;
        if (filters?.exchange) query.exchange = filters.exchange;
        if (filters?.symbol) query.symbol = filters.symbol;

        return PositionModel.find(query).populate('botId', 'name type exchange').sort({ openedAt: -1 }).lean().exec();
    };

    static getSummary = async (filters?: { botId?: string; exchange?: string; timeframe?: string }) => {
        const query: Partial<Position> = { status: PositionStatus.OPEN };

        if (filters?.botId) query.botId = filters.botId;
        if (filters?.exchange) query.exchange = filters.exchange;

        const openPositions = await PositionModel.find(query).lean();

        const summary = {
            totalOpen: openPositions.length,
            totalLong: openPositions.filter((p) => p.side === PositionSide.LONG).length,
            totalShort: openPositions.filter((p) => p.side === PositionSide.SHORT).length,
            totalUnrealizedPnL: openPositions.reduce((sum, p) => sum + (p.unrealizedPnL || 0), 0),
            totalMargin: openPositions.reduce((sum, p) => sum + p.margin, 0),
            byBot: {} as Record<string, { open: number; unrealizedPnL: number }>,
            byExchange: {} as Record<string, { open: number; unrealizedPnL: number }>,
        };

        openPositions.forEach((position) => {
            const botId = position.botId.toString();
            summary.byBot[botId] ??= { open: 0, unrealizedPnL: 0 };
            const botStats = summary.byBot[botId];
            botStats.open++;
            botStats.unrealizedPnL += position.unrealizedPnL || 0;

            summary.byExchange[position.exchange] ??= { open: 0, unrealizedPnL: 0 };
            const exchangeStats = summary.byExchange[position.exchange]!;
            exchangeStats.open++;
            exchangeStats.unrealizedPnL += position.unrealizedPnL || 0;
        });

        return summary;
    };

    static createOne = async (position: PositionCreateInput) => {
        const createdPosition = await PositionModel.create({
            ...position,
            status: PositionStatus.OPEN,
            unrealizedPnL: 0,
            realizedPnL: 0,
            fees: 0,
            fundingFees: 0,
        });

        WebSocketServer.getInstance().emitToPositions(WebSocketEvent.POSITION_OPENED, {
            positionId: createdPosition._id,
            botId: createdPosition.botId,
            symbol: createdPosition.symbol,
            side: createdPosition.side,
            entryPrice: createdPosition.entryPrice,
            quantity: createdPosition.quantity,
            timestamp: Date.now(),
        });

        return createdPosition.toObject();
    };

    static updateOne = async (positionId: string, update: Partial<Position>) => {
        return PositionModel.findByIdAndUpdate(positionId, update, { new: true }).orFail(new DocumentNotFoundError(positionId)).lean().exec();
    };

    static closePosition = async (positionId: string, closePrice?: number, reason?: string) => {
        const position = await PositionModel.findById(positionId).orFail(new DocumentNotFoundError(positionId));

        if (position.status !== PositionStatus.OPEN) {
            throw new Error('Position is not open');
        }

        position.status = PositionStatus.CLOSED;
        position.closedAt = new Date();
        position.realizedPnL = position.unrealizedPnL;

        if (closePrice) {
            position.currentPrice = closePrice;
        }

        await position.save();

        WebSocketServer.getInstance().emitToPositions(WebSocketEvent.POSITION_CLOSED, {
            positionId: position._id,
            botId: position.botId,
            symbol: position.symbol,
            pnl: position.realizedPnL,
            closePrice: position.currentPrice,
            reason,
            timestamp: Date.now(),
        });

        return position.toObject();
    };

    static deleteOne = async (positionId: string) => {
        return PositionModel.findByIdAndDelete(positionId).orFail(new DocumentNotFoundError(positionId)).lean().exec();
    };
}
