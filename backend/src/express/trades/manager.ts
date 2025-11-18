import { DocumentNotFoundError } from '../../utils/errors';
import { TradeModel } from './model';
import { Trade, TradeStatus, CloseReason } from './interfaces';
import { WebSocketEvent, WebSocketServer } from '../WebSocketServer';

export class TradesManager {
    static getByQuery = async () => {
        return TradeModel.find({})
            .populate('botId', 'name type exchange')
            .populate('positionId', 'symbol side entryPrice')
            .sort({ openedAt: -1 })
            .lean()
            .exec();
    };

    static getById = async (tradeId: string) => {
        return TradeModel.findById(tradeId)
            .populate('botId', 'name type exchange config')
            .populate('positionId', 'symbol side entryPrice currentPrice')
            .orFail(new DocumentNotFoundError(tradeId))
            .lean()
            .exec();
    };

    static getByBot = async (botId: string) => {
        return TradeModel.find({ botId }).populate('positionId', 'symbol side entryPrice').sort({ openedAt: -1 }).lean().exec();
    };

    static getByPosition = async (positionId: string) => {
        return TradeModel.find({ positionId }).populate('botId', 'name type exchange').sort({ openedAt: -1 }).lean().exec();
    };

    static createOne = async (trade: Partial<Trade>) => {
        const createdTrade = await TradeModel.create({
            ...trade,
            status: TradeStatus.PENDING,
            pnl: 0,
            pnlPercent: 0,
            fees: 0,
            fundingFees: 0,
            duration: 0,
        });

        WebSocketServer.getInstance().emitToTrades('TRADE_CLOSED' as WebSocketEvent, {
            tradeId: createdTrade._id,
            botId: createdTrade.botId,
            positionId: createdTrade.positionId,
            symbol: createdTrade.symbol,
            side: createdTrade.side,
            entryPrice: createdTrade.entryPrice,
            quantity: createdTrade.quantity,
            timestamp: Date.now(),
        });

        return createdTrade.toObject();
    };

    static updateOne = async (tradeId: string, update: Partial<Trade>) => {
        return TradeModel.findByIdAndUpdate(tradeId, update, { new: true }).orFail(new DocumentNotFoundError(tradeId)).lean().exec();
    };

    static closeTrade = async (tradeId: string, data: { exitPrice: number; closeReason?: CloseReason; fees?: number; fundingFees?: number }) => {
        const trade = await TradeModel.findById(tradeId).orFail(new DocumentNotFoundError(tradeId));

        if (trade.status === TradeStatus.FILLED || trade.status === TradeStatus.CANCELLED) {
            throw new Error('Trade is already closed');
        }

        const closedAt = new Date();
        const duration = Math.floor((closedAt.getTime() - trade.openedAt.getTime()) / 1000);

        const pnl = (data.exitPrice - trade.entryPrice) * trade.quantity * trade.leverage - (data.fees ?? 0) - (data.fundingFees ?? 0);
        const pnlPercent = ((data.exitPrice - trade.entryPrice) / trade.entryPrice) * 100 * trade.leverage;

        trade.status = TradeStatus.FILLED;
        trade.exitPrice = data.exitPrice;
        trade.pnl = pnl;
        trade.pnlPercent = pnlPercent;
        trade.duration = duration;
        trade.closedAt = closedAt;
        trade.closeReason = data.closeReason;

        if (data.fees !== undefined) trade.fees = data.fees;
        if (data.fundingFees !== undefined) trade.fundingFees = data.fundingFees;

        await trade.save();

        WebSocketServer.getInstance().emitToTrades(WebSocketEvent.TRADE_CLOSED, {
            tradeId: trade._id,
            botId: trade.botId,
            positionId: trade.positionId,
            symbol: trade.symbol,
            pnl: trade.pnl,
            pnlPercent: trade.pnlPercent,
            exitPrice: data.exitPrice,
            closeReason: data.closeReason,
            timestamp: Date.now(),
        });

        return trade.toObject();
    };

    static deleteOne = async (tradeId: string) => {
        return TradeModel.findByIdAndDelete(tradeId).orFail(new DocumentNotFoundError(tradeId)).lean().exec();
    };
}
