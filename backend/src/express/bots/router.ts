import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { BotsController } from './controller';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    getCountRequestSchema,
    updateOneRequestSchema,
    startBotRequestSchema,
    stopBotRequestSchema,
    getBotStatsRequestSchema,
} from './validations';

export const botsRouter = Router();

botsRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(BotsController.getByQuery));

botsRouter.get('/count', validateRequest(getCountRequestSchema), wrapController(BotsController.getCount));

botsRouter.get('/:id', validateRequest(getByIdRequestSchema), wrapController(BotsController.getById));

botsRouter.post('/', validateRequest(createOneRequestSchema), wrapController(BotsController.createOne));

botsRouter.put('/:id', validateRequest(updateOneRequestSchema), wrapController(BotsController.updateOne));

botsRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(BotsController.deleteOne));

botsRouter.post('/:id/start', validateRequest(startBotRequestSchema), wrapController(BotsController.startBot));

botsRouter.post('/:id/stop', validateRequest(stopBotRequestSchema), wrapController(BotsController.stopBot));

botsRouter.get('/:id/stats', validateRequest(getBotStatsRequestSchema), wrapController(BotsController.getBotStats));
