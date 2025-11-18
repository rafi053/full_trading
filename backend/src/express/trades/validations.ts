import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod';
import { TradeSide, TradeStatus, CloseReason } from './interfaces';

const tradeFields = z.object({
    botId: zodMongoObjectId,
    positionId: zodMongoObjectId,
    exchange: z.string().min(1, 'Exchange is required'),
    symbol: z.string().min(1, 'Symbol is required'),
    side: z.enum(TradeSide),
    status: z.enum(TradeStatus).optional(),
    entryPrice: z.number().positive('Entry price must be positive'),
    exitPrice: z.number().positive('Exit price must be positive').optional(),
    quantity: z.number().positive('Quantity must be positive'),
    leverage: z.number().int().min(1).max(125),
    pnl: z.number().optional(),
    pnlPercent: z.number().optional(),
    fees: z.number().nonnegative().optional(),
    fundingFees: z.number().optional(),
    duration: z.number().nonnegative().optional(),
    closeReason: z.enum(CloseReason).optional(),
    metadata: z.record(z.string(), z.any()).optional(),
});

export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({}),
});

export const getByIdRequestSchema = z.object({
    body: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
    query: z.object({}),
});

export const getByBotRequestSchema = z.object({
    body: z.object({}),
    params: z.object({
        botId: zodMongoObjectId,
    }),
    query: z.object({}),
});

export const getByPositionRequestSchema = z.object({
    body: z.object({}),
    params: z.object({
        positionId: zodMongoObjectId,
    }),
    query: z.object({}),
});

export const createTradeRequestSchema = z.object({
    body: tradeFields.omit({
        status: true,
        exitPrice: true,
        pnl: true,
        pnlPercent: true,
        fees: true,
        fundingFees: true,
        duration: true,
        closeReason: true,
    }),
    params: z.object({}),
    query: z.object({}),
});

export const updateTradeRequestSchema = z.object({
    body: z.object({
        status: z.enum(TradeStatus).optional(),
        exitPrice: z.number().positive().optional(),
        pnl: z.number().optional(),
        pnlPercent: z.number().optional(),
        fees: z.number().nonnegative().optional(),
        fundingFees: z.number().optional(),
        metadata: z.record(z.string(), z.any()).optional(),
    }),
    params: z.object({
        id: zodMongoObjectId,
    }),
    query: z.object({}),
});

export const closeTradeRequestSchema = z.object({
    body: z.object({
        exitPrice: z.number().positive('Exit price must be positive'),
        closeReason: z.enum(CloseReason).optional(),
        fees: z.number().nonnegative().optional(),
        fundingFees: z.number().optional(),
    }),
    params: z.object({
        id: zodMongoObjectId,
    }),
    query: z.object({}),
});

export const deleteTradeRequestSchema = z.object({
    body: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
    query: z.object({}),
});
