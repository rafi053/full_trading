import { Request, Response } from 'express';
import { BalanceManager } from './manager';

export class balanceController {
    static getBalance = async (_req: Request, res: Response) => {
        res.json(await BalanceManager.getBalance());
    };
}
