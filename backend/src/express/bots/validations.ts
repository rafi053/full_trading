import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod';
import { BotStatus, BotType } from './interfaces';
const botConfigSchema = z.object({
    exchange: z.string().min(1, 'Exchange is required'),
    symbol: z.string().min(1, 'Symbol is required'),
    leverage: z.number().int().min(1).max(125),
    positionSize: z.number().positive('Position size must be positive'),
    strategy: z.record(z.string(), z.any()),
    riskManagement: z.object({
        maxDailyLoss: z.number().nonnegative('Max daily loss cannot be negative'),
        maxOpenPositions: z.number().int().positive('Max open positions must be at least 1'),
        stopLossPercent: z.number().positive('Stop loss percent must be positive').max(100),
        takeProfitPercent: z.number().positive('Take profit percent must be positive'),
    }),
});

const requiredFields = z.object({
    name: z.string().min(1, 'Bot name is required').max(100),
    type: z.nativeEnum(BotType),
    exchange: z.string().min(1, 'Exchange is required'),
    status: z.nativeEnum(BotStatus).optional(),
    config: botConfigSchema,
});

export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        step: z.coerce.number().int().min(0).default(0),
        limit: z.coerce.number().int().positive().max(100).optional(),
        name: z.string().optional(),
        type: z.nativeEnum(BotType).optional(),
        exchange: z.string().optional(),
        status: z.nativeEnum(BotStatus).optional(),
    }),
    params: z.object({}),
});

export const getCountRequestSchema = z.object({
    body: z.object({}),
    query: z.object({
        name: z.string().optional(),
        type: z.nativeEnum(BotType).optional(),
        exchange: z.string().optional(),
        status: z.nativeEnum(BotStatus).optional(),
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

export const createOneRequestSchema = z.object({
    body: requiredFields.omit({ status: true }),
    params: z.object({}),
    query: z.object({}),
});

export const updateOneRequestSchema = z.object({
    body: requiredFields.partial(),
    params: z.object({
        id: zodMongoObjectId,
    }),
    query: z.object({}),
});

export const deleteOneRequestSchema = z.object({
    body: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
    query: z.object({}),
});

export const startBotRequestSchema = z.object({
    body: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
    query: z.object({}),
});

export const stopBotRequestSchema = z.object({
    body: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
    query: z.object({}),
});

export const getBotStatsRequestSchema = z.object({
    body: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
    query: z.object({}),
});

export const getAllWithStatsRequestSchema = z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({}),
});
