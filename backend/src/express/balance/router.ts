import { Router } from 'express';
import { balanceController } from './controller';

export const balanceRouter = Router();

balanceRouter.get('/', balanceController.getBalance);
