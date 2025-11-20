import axios from 'axios';
import { config } from '../../config';

const PYTHON_SERVICE_URL = config.python.url;
export class BalanceManager {
    static async getBalance() {
        try {
            const response = await axios.get(`${PYTHON_SERVICE_URL}/api/balances/bitunix`);
            return response.data;
        } catch (error) {
            console.error('Error fetching balances from Python server:', error);
            throw new Error('Failed to fetch balances');
        }
    }
}
