import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
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
import { TradesManager } from './manager';

export class TradesController {
    static getByQuery = async (_req: TypedRequest<typeof getByQueryRequestSchema>, res: Response) => {
        res.json(await TradesManager.getByQuery());
    };

    static getById = async (req: TypedRequest<typeof getByIdRequestSchema>, res: Response) => {
        res.json(await TradesManager.getById(req.params.id));
    };

    static getByBot = async (req: TypedRequest<typeof getByBotRequestSchema>, res: Response) => {
        res.json(await TradesManager.getByBot(req.params.botId));
    };

    static getByPosition = async (req: TypedRequest<typeof getByPositionRequestSchema>, res: Response) => {
        res.json(await TradesManager.getByPosition(req.params.positionId));
    };

    static createOne = async (req: TypedRequest<typeof createTradeRequestSchema>, res: Response) => {
        res.json(await TradesManager.createOne(req.body));
    };

    static updateOne = async (req: TypedRequest<typeof updateTradeRequestSchema>, res: Response) => {
        res.json(await TradesManager.updateOne(req.params.id, req.body));
    };

    static closeTrade = async (req: TypedRequest<typeof closeTradeRequestSchema>, res: Response) => {
        res.json(await TradesManager.closeTrade(req.params.id, req.body));
    };

    static deleteOne = async (req: TypedRequest<typeof deleteTradeRequestSchema>, res: Response) => {
        res.json(await TradesManager.deleteOne(req.params.id));
    };
}
