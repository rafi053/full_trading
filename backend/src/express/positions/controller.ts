import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import {
    closePositionRequestSchema,
    createPositionRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    getOpenRequestSchema,
    getSummaryRequestSchema,
    updatePositionRequestSchema,
} from './validations';
import { PositionsManager } from './manager';

export class PositionsController {
    static getByQuery = async (req: TypedRequest<typeof getByQueryRequestSchema>, res: Response) => {
        const { step, limit, ...query } = req.query;
        res.json(await PositionsManager.getByQuery(query, step, limit));
    };

    static getById = async (req: TypedRequest<typeof getByIdRequestSchema>, res: Response) => {
        res.json(await PositionsManager.getById(req.params.id));
    };

    static getOpen = async (req: TypedRequest<typeof getOpenRequestSchema>, res: Response) => {
        res.json(await PositionsManager.getOpen(req.query));
    };

    static getSummary = async (req: TypedRequest<typeof getSummaryRequestSchema>, res: Response) => {
        res.json(await PositionsManager.getSummary(req.query));
    };

    static createOne = async (req: TypedRequest<typeof createPositionRequestSchema>, res: Response) => {
        res.json(await PositionsManager.createOne(req.body));
    };

    static updateOne = async (req: TypedRequest<typeof updatePositionRequestSchema>, res: Response) => {
        res.json(await PositionsManager.updateOne(req.params.id, req.body));
    };

    static closePosition = async (req: TypedRequest<typeof closePositionRequestSchema>, res: Response) => {
        res.json(await PositionsManager.closePosition(req.params.id, req.body.closePrice, req.body.reason));
    };
}
