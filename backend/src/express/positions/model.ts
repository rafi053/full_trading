import mongoose, { Schema, Document } from 'mongoose';
import { Position, PositionSide, PositionStatus } from './interfaces';
import { config } from '../../config';

export interface PositionDocument extends Omit<Position, 'id' | 'botId'>, Document {
    botId: mongoose.Types.ObjectId;
}

const PositionSchema = new Schema<PositionDocument>(
    {
        botId: {
            type: Schema.Types.ObjectId,
            ref: 'Bot',
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
            enum: Object.values(PositionSide),
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(PositionStatus),
            default: PositionStatus.OPEN,
        },
        entryPrice: {
            type: Number,
            required: true,
        },
        currentPrice: {
            type: Number,
            required: true,
        },
        liquidationPrice: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        leverage: {
            type: Number,
            required: true,
        },
        margin: {
            type: Number,
            required: true,
        },
        unrealizedPnL: {
            type: Number,
            default: 0,
        },
        realizedPnL: {
            type: Number,
            default: 0,
        },
        takeProfit: Number,
        stopLoss: Number,
        openedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        closedAt: Date,
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        fees: {
            type: Number,
            default: 0,
        },
        fundingFees: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

PositionSchema.index({ botId: 1, status: 1 });
PositionSchema.index({ exchange: 1, status: 1 });
PositionSchema.index({ symbol: 1, status: 1 });
PositionSchema.index({ status: 1, openedAt: -1 });

export const PositionModel = mongoose.model<PositionDocument>(config.positions.positionsCollectionName, PositionSchema);
