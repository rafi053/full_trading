import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import {
    getBestTradesRequestSchema,
    getGlobalStatsRequestSchema,
    getPnLHistoryRequestSchema,
    getStatsByBotRequestSchema,
    getWinRateHistoryRequestSchema,
    getWorstTradesRequestSchema,
} from './validations';
import { StatsManager } from './manager';

export class StatsController {
    static getStatsByBot = async (req: TypedRequest<typeof getStatsByBotRequestSchema>, res: Response) => {
        res.json(await StatsManager.getStatsByBot(req.params.botId, req.query));
    };

    static getGlobalStats = async (req: TypedRequest<typeof getGlobalStatsRequestSchema>, res: Response) => {
        res.json(await StatsManager.getGlobalStats(req.query));
    };

    static getPnLHistory = async (req: TypedRequest<typeof getPnLHistoryRequestSchema>, res: Response) => {
        res.json(await StatsManager.getPnLHistory(req.query));
    };

    static getWinRateHistory = async (req: TypedRequest<typeof getWinRateHistoryRequestSchema>, res: Response) => {
        res.json(await StatsManager.getWinRateHistory(req.query));
    };

    static getBestTrades = async (req: TypedRequest<typeof getBestTradesRequestSchema>, res: Response) => {
        res.json(await StatsManager.getBestTrades(req.query));
    };

    static getWorstTrades = async (req: TypedRequest<typeof getWorstTradesRequestSchema>, res: Response) => {
        res.json(await StatsManager.getWorstTrades(req.query));
    };
}
