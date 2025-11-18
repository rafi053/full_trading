import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { PositionsController } from './controller';
import {
    closePositionRequestSchema,
    createPositionRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    getOpenRequestSchema,
    getSummaryRequestSchema,
    updatePositionRequestSchema,
} from './validations';

export const positionsRouter = Router();

positionsRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(PositionsController.getByQuery));

positionsRouter.get('/open', validateRequest(getOpenRequestSchema), wrapController(PositionsController.getOpen));

positionsRouter.get('/summary', validateRequest(getSummaryRequestSchema), wrapController(PositionsController.getSummary));

positionsRouter.get('/:id', validateRequest(getByIdRequestSchema), wrapController(PositionsController.getById));

positionsRouter.post('/', validateRequest(createPositionRequestSchema), wrapController(PositionsController.createOne));

positionsRouter.put('/:id', validateRequest(updatePositionRequestSchema), wrapController(PositionsController.updateOne));

positionsRouter.post('/:id/close', validateRequest(closePositionRequestSchema), wrapController(PositionsController.closePosition));
