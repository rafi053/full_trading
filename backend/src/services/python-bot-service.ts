import axios from 'axios';

const PYTHON_SERVICE_URL = process.env['PYTHON_SERVICE_URL'] ?? 'http://localhost:8000';

export class PythonBotService {
    static async startBot(botId: string): Promise<any> {
        try {
            const response = await axios.post(`${PYTHON_SERVICE_URL}/bots/start`, {
                bot_id: botId,
            });
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to start bot in Python service: ${error.message}`);
        }
    }

    static async stopBot(botId: string): Promise<any> {
        try {
            const response = await axios.post(`${PYTHON_SERVICE_URL}/bots/${botId}/stop`);
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to stop bot in Python service: ${error.message}`);
        }
    }

    static async getBotStatus(botId: string): Promise<any> {
        try {
            const response = await axios.get(`${PYTHON_SERVICE_URL}/bots/${botId}/status`);
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to get bot status from Python service: ${error.message}`);
        }
    }

    static async getAllBots(): Promise<any> {
        try {
            const response = await axios.get(`${PYTHON_SERVICE_URL}/bots/`);
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to get all bots from Python service: ${error.message}`);
        }
    }
}
