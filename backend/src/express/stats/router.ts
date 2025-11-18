import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { StatsController } from './controller';
import {
    getBestTradesRequestSchema,
    getGlobalStatsRequestSchema,
    getPnLHistoryRequestSchema,
    getStatsByBotRequestSchema,
    getWinRateHistoryRequestSchema,
    getWorstTradesRequestSchema,
} from './validations';

export const statsRouter = Router();

statsRouter.get('/global', validateRequest(getGlobalStatsRequestSchema), wrapController(StatsController.getGlobalStats));

statsRouter.get('/pnl-history', validateRequest(getPnLHistoryRequestSchema), wrapController(StatsController.getPnLHistory));

statsRouter.get('/winrate-history', validateRequest(getWinRateHistoryRequestSchema), wrapController(StatsController.getWinRateHistory));

statsRouter.get('/best-trades', validateRequest(getBestTradesRequestSchema), wrapController(StatsController.getBestTrades));

statsRouter.get('/worst-trades', validateRequest(getWorstTradesRequestSchema), wrapController(StatsController.getWorstTrades));

statsRouter.get('/bot/:botId', validateRequest(getStatsByBotRequestSchema), wrapController(StatsController.getStatsByBot));
