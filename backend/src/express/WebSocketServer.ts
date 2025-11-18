import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket, type ServerOptions, type DefaultEventsMap } from 'socket.io';

export enum WebSocketEvent {
    BOT_STATUS_CHANGED = 'bot:status:changed',
    BOT_STATS_UPDATED = 'bot:stats:updated',

    POSITION_OPENED = 'position:opened',
    POSITION_UPDATED = 'position:updated',
    POSITION_CLOSED = 'position:closed',

    TRADE_NEW = 'trade:new',
    TRADE_CLOSED = 'trade:closed',

    PRICE_UPDATE = 'price:update',
    BALANCE_UPDATE = 'balance:update',

    ERROR = 'error',
    CONNECTED = 'connected',
    DISCONNECTED = 'disconnected',
}

type EventData = Record<string, unknown>;

export class WebSocketServer {
    private static instance: WebSocketServer;
    private io?: SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;

    private constructor() {}

    static getInstance(): WebSocketServer {
        if (!WebSocketServer.instance) {
            WebSocketServer.instance = new WebSocketServer();
        }
        return WebSocketServer.instance;
    }

    initialize(httpServer: HTTPServer, corsOrigin: string): void {
        const options: Partial<ServerOptions> = {
            cors: {
                origin: corsOrigin,
                methods: ['GET', 'POST'],
                credentials: true,
            },
            pingTimeout: 60_000,
            pingInterval: 25_000,
        };

        const io = new SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>(httpServer, options);

        this.io = io;

        io.on('connection', (socket: Socket) => {
            console.log(`Client connected: ${socket.id}`);

            socket.emit(WebSocketEvent.CONNECTED, {
                message: 'Connected to trading dashboard',
                timestamp: Date.now(),
            });

            // --- Subscriptions ---
            socket.on('subscribe:bots', () => {
                void socket.join('bots');
                console.log(`Client ${socket.id} subscribed to bots`);
            });

            socket.on('subscribe:positions', () => {
                void socket.join('positions');
                console.log(`Client ${socket.id} subscribed to positions`);
            });

            socket.on('subscribe:trades', () => {
                void socket.join('trades');
                console.log(`Client ${socket.id} subscribed to trades`);
            });

            socket.on('subscribe:prices', (symbols: string[]) => {
                for (const s of symbols) {
                    void socket.join(`price:${s}`);
                }
                console.log(`Client ${socket.id} subscribed to prices:`, symbols);
            });

            // --- Unsubscriptions ---
            socket.on('unsubscribe:bots', () => {
                void socket.leave('bots');
            });

            socket.on('unsubscribe:positions', () => {
                void socket.leave('positions');
            });

            socket.on('unsubscribe:trades', () => {
                void socket.leave('trades');
            });

            socket.on('disconnect', (reason: string) => {
                console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
            });

            socket.on('error', (error: Error) => {
                console.error(`Socket error for ${socket.id}:`, error);
            });
        });

        console.log('✅ WebSocket server initialized');
    }

    private get ioSafe(): SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown> {
        if (!this.io) {
            throw new Error('WebSocket server not initialized');
        }
        return this.io;
    }

    emit(event: WebSocketEvent, data: EventData, room?: string): void {
        const io = this.ioSafe;
        if (room) {
            io.to(room).emit(event, data);
        } else {
            io.emit(event, data);
        }
    }

    emitToBots(event: WebSocketEvent, data: EventData): void {
        this.emit(event, data, 'bots');
    }

    emitToPositions(event: WebSocketEvent, data: EventData): void {
        this.emit(event, data, 'positions');
    }

    emitToTrades(event: WebSocketEvent, data: EventData): void {
        this.emit(event, data, 'trades');
    }

    emitPriceUpdate(symbol: string, data: EventData): void {
        this.emit(WebSocketEvent.PRICE_UPDATE, data, `price:${symbol}`);
    }

    getConnectedClients(): number {
        return this.io?.sockets.sockets.size ?? 0;
    }

    getRooms(): string[] {
        return this.io ? [...this.io.sockets.adapter.rooms.keys()] : [];
    }

    close(): void {
        this.io?.close();
        console.log('WebSocket server closed');
    }
}

export default WebSocketServer.getInstance();
