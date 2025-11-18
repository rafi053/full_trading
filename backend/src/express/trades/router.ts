import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { TradesController } from './controller';
import {
    closeTradeRequestSchema,
    createTradeRequestSchema,
    deleteTradeRequestSchema,
    getByBotRequestSchema,
    getByIdRequestSchema,
    getByPositionRequestSchema,
    getByQueryRequestSchema,
    updateTradeRequestSchema,
} from './validations';

export const tradesRouter = Router();

tradesRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(TradesController.getByQuery));

tradesRouter.get('/bot/:botId', validateRequest(getByBotRequestSchema), wrapController(TradesController.getByBot));

tradesRouter.get('/position/:positionId', validateRequest(getByPositionRequestSchema), wrapController(TradesController.getByPosition));

tradesRouter.get('/:id', validateRequest(getByIdRequestSchema), wrapController(TradesController.getById));

tradesRouter.post('/', validateRequest(createTradeRequestSchema), wrapController(TradesController.createOne));

tradesRouter.put('/:id', validateRequest(updateTradeRequestSchema), wrapController(TradesController.updateOne));

tradesRouter.post('/:id/close', validateRequest(closeTradeRequestSchema), wrapController(TradesController.closeTrade));

tradesRouter.delete('/:id', validateRequest(deleteTradeRequestSchema), wrapController(TradesController.deleteOne));
