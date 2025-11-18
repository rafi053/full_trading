import mongoose, { Schema, Document } from 'mongoose';
import { Trade, TradeSide, TradeStatus, CloseReason } from './interfaces';
import { config } from '../../config';

export interface TradeDocument extends Omit<Trade, 'id' | 'botId' | 'positionId'>, Document {
    botId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
}

const TradeSchema = new Schema<TradeDocument>(
    {
        botId: {
            type: Schema.Types.ObjectId,
            ref: 'Bot',
            required: true,
        },
        positionId: {
            type: Schema.Types.ObjectId,
            ref: 'Position',
            required: true,
        },
        exchange: {
            type: String,
            required: true,
        },
        symbol: {
            type: String,
            required: true,
        },
        side: {
            type: String,
            enum: Object.values(TradeSide),
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(TradeStatus),
            default: TradeStatus.PENDING,
        },
        entryPrice: {
            type: Number,
            required: true,
        },
        exitPrice: Number,
        quantity: {
            type: Number,
            required: true,
        },
        leverage: {
            type: Number,
            required: true,
        },
        pnl: {
            type: Number,
            default: 0,
        },
        pnlPercent: {
            type: Number,
            default: 0,
        },
        fees: {
            type: Number,
            default: 0,
        },
        fundingFees: {
            type: Number,
            default: 0,
        },
        duration: {
            type: Number,
            default: 0,
        },
        closeReason: {
            type: String,
            enum: Object.values(CloseReason),
        },
        openedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        closedAt: Date,
        metadata: Schema.Types.Mixed,
    },
    {
        timestamps: true,
    },
);

TradeSchema.index({ botId: 1, openedAt: -1 });
TradeSchema.index({ exchange: 1, openedAt: -1 });
TradeSchema.index({ symbol: 1, openedAt: -1 });
TradeSchema.index({ status: 1, openedAt: -1 });
TradeSchema.index({ openedAt: -1 });

export const TradeModel = mongoose.model<TradeDocument>(config.trades.tradesCollectionName, TradeSchema);
