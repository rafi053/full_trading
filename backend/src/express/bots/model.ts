import mongoose, { Schema, Document } from 'mongoose';
import { BotType, BotStatus, Bot, BotStats } from './interfaces';
import { config } from '../../config';

export interface BotDocument extends Omit<Bot, 'id'>, Document {}

const BotSchema = new Schema<BotDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        type: {
            type: String,
            enum: Object.values(BotType),
            required: true,
        },
        exchange: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(BotStatus),
            default: BotStatus.STOPPED,
        },
        config: {
            exchange: String,
            symbol: String,
            leverage: Number,
            positionSize: Number,
            strategy: Schema.Types.Mixed,
            riskManagement: {
                maxDailyLoss: Number,
                maxOpenPositions: Number,
                stopLossPercent: Number,
                takeProfitPercent: Number,
            },
        },
        lastStartedAt: Date,
        lastStoppedAt: Date,
    },
    {
        timestamps: true,
    },
);

BotSchema.index({ status: 1 });
BotSchema.index({ exchange: 1 });
BotSchema.index({ type: 1 });

export interface BotStatsDocument extends Omit<BotStats, 'botId'>, Document {
    botId: mongoose.Types.ObjectId;
}

const BotStatsSchema = new Schema<BotStatsDocument>(
    {
        botId: {
            type: Schema.Types.ObjectId,
            ref: 'Bot',
            required: true,
            unique: true,
        },
        totalTrades: {
            type: Number,
            default: 0,
        },
        winningTrades: {
            type: Number,
            default: 0,
        },
        losingTrades: {
            type: Number,
            default: 0,
        },
        totalPnL: {
            type: Number,
            default: 0,
        },
        todayPnL: {
            type: Number,
            default: 0,
        },
        winRate: {
            type: Number,
            default: 0,
        },
        averageWin: {
            type: Number,
            default: 0,
        },
        averageLoss: {
            type: Number,
            default: 0,
        },
        maxDrawdown: {
            type: Number,
            default: 0,
        },
        sharpeRatio: {
            type: Number,
            default: 0,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);

export const BotModel = mongoose.model<BotDocument>(config.bots.botsCollectionName, BotSchema);
export const BotStatsModel = mongoose.model<BotStatsDocument>(config.bots.botsStatsCollectionName, BotStatsSchema);
