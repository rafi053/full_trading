import { DocumentNotFoundError } from '../../utils/errors';
import { BotDocument, BotModel, BotStatsModel } from './model';
import { PositionModel } from '../positions/model';
import { PositionStatus } from '../positions/interfaces';
import { Bot, BotCreateInput, BotStatus, BotWithStats } from './interfaces';
import { WebSocketEvent, WebSocketServer } from '../WebSocketServer';

export class BotManager {
    static getByQuery = async (query: Partial<Bot>, step: number, limit?: number) => {
        return BotModel.find(query, {}, limit ? { limit, skip: limit * step } : {})
            .lean()
            .exec();
    };

    static getCount = async (query: Partial<Bot>): Promise<number> => {
        return BotModel.countDocuments(query).lean().exec();
    };

    static getById = async (botId: string): Promise<any> => {
        const bot = await BotModel.findById(botId).orFail(new DocumentNotFoundError(botId)).lean().exec();

        const stats = await BotStatsModel.findOne({ botId: bot._id }).lean();
        const openPositions = await PositionModel.countDocuments({
            botId: bot._id,
            status: PositionStatus.OPEN,
        });

        const result = {
            ...bot,
            stats: stats ?? null,
            openPositions,
        };

        return result;
    };

    static createOne = async (bot: BotCreateInput): Promise<any> => {
        const createdBot = await BotModel.create({
            ...bot,
            status: BotStatus.STOPPED,
        });

        const stats = await BotStatsModel.create({
            botId: createdBot._id,
            totalTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            totalPnL: 0,
            todayPnL: 0,
            winRate: 0,
        });

        WebSocketServer.getInstance().emitToBots(WebSocketEvent.BOT_STATUS_CHANGED, {
            botId: createdBot._id,
            name: createdBot.name,
            status: createdBot.status,
            timestamp: Date.now(),
        });

        return { ...createdBot.toObject(), stats };
    };

    static updateOne = async (botId: string, update: Partial<Bot>) => {
        return BotModel.findByIdAndUpdate(botId, update, { new: true }).orFail(new DocumentNotFoundError(botId)).lean().exec();
    };
    static deleteOne = async (botId: string) => {
        const bot = await BotModel.findById(botId).orFail(new DocumentNotFoundError(botId));

        if (bot.status === BotStatus.RUNNING) {
            throw new Error('Cannot delete running bot. Stop it first.');
        }

        const deletedBot = await BotModel.findByIdAndDelete(botId).orFail(new DocumentNotFoundError(botId)).lean().exec();

        await BotStatsModel.findOneAndDelete({ botId });

        return deletedBot;
    };

    static startBot = async (botId: string): Promise<BotDocument> => {
        const bot = await BotModel.findById(botId).orFail(new DocumentNotFoundError(botId));

        if (bot.status === BotStatus.RUNNING) {
            throw new Error('Bot is already running');
        }

        bot.status = BotStatus.RUNNING;
        bot.lastStartedAt = new Date();
        await bot.save();

        WebSocketServer.getInstance().emitToBots(WebSocketEvent.BOT_STATUS_CHANGED, {
            botId: bot._id,
            name: bot.name,
            status: bot.status,
            timestamp: Date.now(),
        });

        return bot.toObject();
    };

    static stopBot = async (botId: string): Promise<BotDocument> => {
        const bot = await BotModel.findById(botId).orFail(new DocumentNotFoundError(botId));

        if (bot.status === BotStatus.STOPPED) {
            throw new Error('Bot is already stopped');
        }

        bot.status = BotStatus.STOPPED;
        bot.lastStoppedAt = new Date();
        await bot.save();

        WebSocketServer.getInstance().emitToBots(WebSocketEvent.BOT_STATUS_CHANGED, {
            botId: bot._id,
            name: bot.name,
            status: bot.status,
            timestamp: Date.now(),
        });

        return bot.toObject();
    };

    static getBotStats = async (botId: string): Promise<any> => {
        const stats = await BotStatsModel.findOne({ botId }).lean().exec();

        if (!stats) {
            throw new DocumentNotFoundError(botId);
        }

        return stats;
    };

    static getAllWithStats = async (): Promise<BotWithStats[]> => {
        const bots = await BotModel.find().lean().exec();
        const botsWithStats = await Promise.all(
            bots.map(async (bot) => {
                const stats = await BotStatsModel.findOne({ botId: bot._id }).lean();
                const openPositions = await PositionModel.countDocuments({
                    botId: bot._id,
                    status: PositionStatus.OPEN,
                });

                return {
                    ...bot,
                    stats: stats ?? null,
                    openPositions,
                } as unknown as BotWithStats;
            }),
        );

        return botsWithStats;
    };
}
