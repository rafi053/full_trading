import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod';

export const getStatsByBotRequestSchema = z.object({
    body: z.object({}),
    params: z.object({
        botId: zodMongoObjectId,
    }),
    query: z.object({
        timeframe: z.enum(['day', 'week', 'month', 'year', 'all']).default('all'),
        exchange: z.string().optional(),
    }),
});

export const getGlobalStatsRequestSchema = z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({
        timeframe: z.enum(['day', 'week', 'month', 'year', 'all']).default('all'),
        exchange: z.string().optional(),
    }),
});

export const getPnLHistoryRequestSchema = z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({
        botId: zodMongoObjectId.optional(),
        timeframe: z.enum(['day', 'week', 'month', 'year', 'all']).default('month'),
        exchange: z.string().optional(),
        interval: z.enum(['hour', 'day', 'week', 'month']).default('day'),
    }),
});

export const getWinRateHistoryRequestSchema = z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({
        botId: zodMongoObjectId.optional(),
        timeframe: z.enum(['day', 'week', 'month', 'year', 'all']).default('month'),
        exchange: z.string().optional(),
        interval: z.enum(['hour', 'day', 'week', 'month']).default('day'),
    }),
});

export const getBestTradesRequestSchema = z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({
        botId: zodMongoObjectId.optional(),
        exchange: z.string().optional(),
        limit: z.coerce.number().int().positive().max(100).default(10),
    }),
});

export const getWorstTradesRequestSchema = z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({
        botId: zodMongoObjectId.optional(),
        exchange: z.string().optional(),
        limit: z.coerce.number().int().positive().max(100).default(10),
    }),
});
