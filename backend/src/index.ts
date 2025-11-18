import mongoose from 'mongoose';
import { config } from './config';
import { Server } from './express/server';
import { logger } from './utils/logger/index';
import webSocketServer from './express/WebSocketServer';

const { mongo, service } = config;

const initializeMongo = async () => {
    logger.info('Connecting to Mongo...');

    await mongoose.connect(mongo.uri);

    logger.info('Mongo connection established');
};

const main = async () => {
    await initializeMongo();

    const server = new Server(service.port);

    const httpServer = await server.start();

    webSocketServer.initialize(httpServer, '*');

    logger.info(`Server started on port: ${service.port}`);
    logger.info(`WebSocket Server started on port: ${service.port}`);
};

main().catch(logger.error);
