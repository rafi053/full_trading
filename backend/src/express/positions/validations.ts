import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod';
import { PositionSide, PositionStatus } from './interfaces';

const positionFields = z.object({
    botId: zodMongoObjectId,
    exchange: z.string().min(1, 'Exchange is required'),
    symbol: z.string().min(1, 'Symbol is required'),
    side: z.nativeEnum(PositionSide),
    status: z.nativeEnum(PositionStatus).optional(),
    entryPrice: z.number().positive('Entry price must be positive'),
    currentPrice: z.number().positive('Current price must be positive'),
    liquidationPrice: z.number().positive('Liquidation price must be positive'),
    quantity: z.number().positive('Quantity must be positive'),
    leverage: z.number().int().min(1).max(125),
    margin: z.number().positive('Margin must be positive'),
    unrealizedPnL: z.number().optional(),
    realizedPnL: z.number().optional(),
    takeProfit: z.number().positive().optional(),
    stopLoss: z.number().positive().optional(),
    fees: z.number().nonnegative().optional(),
    fundingFees: z.number().optional(),
});

export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        step: z.coerce.number().int().min(0).default(0),
        limit: z.coerce.number().int().positive().max(100).optional(),
        botId: zodMongoObjectId.optional(),
        exchange: z.string().optional(),
        symbol: z.string().optional(),
        side: z.nativeEnum(PositionSide).optional(),
        status: z.nativeEnum(PositionStatus).optional(),
    }),
    params: z.object({}),
});

export const getByIdRequestSchema = z.object({
    body: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
    query: z.object({}),
});

export const getOpenRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        botId: zodMongoObjectId.optional(),
        exchange: z.string().optional(),
        symbol: z.string().optional(),
    }),
    params: z.object({}),
});

export const getSummaryRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        botId: zodMongoObjectId.optional(),
        exchange: z.string().optional(),
        timeframe: z.enum(['day', 'week', 'month', 'all']).default('day'),
    }),
    params: z.object({}),
});

export const closePositionRequestSchema = z.object({
    body: z.object({
        closePrice: z.number().positive('Close price must be positive').optional(),
        reason: z.string().max(200).optional(),
    }),
    params: z.object({
        id: zodMongoObjectId,
    }),
    query: z.object({}),
});

export const createPositionRequestSchema = z.object({
    body: positionFields.omit({ status: true, unrealizedPnL: true, realizedPnL: true, fees: true, fundingFees: true }),
    params: z.object({}),
    query: z.object({}),
});

export const updatePositionRequestSchema = z.object({
    body: z.object({
        currentPrice: z.number().positive().optional(),
        liquidationPrice: z.number().positive().optional(),
        quantity: z.number().positive().optional(),
        unrealizedPnL: z.number().optional(),
        takeProfit: z.number().positive().optional(),
        stopLoss: z.number().positive().optional(),
        fees: z.number().nonnegative().optional(),
        fundingFees: z.number().optional(),
    }),
    params: z.object({
        id: zodMongoObjectId,
    }),
    query: z.object({}),
});
