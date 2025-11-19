import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BotCreateInput, BotType } from '@/types/api';
import { Button } from '../ui/Button';

interface BotFormProps {
  initialData?: Partial<BotCreateInput>;
  onSubmit: (data: BotCreateInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const BotForm = ({ initialData, onSubmit, onCancel, loading }: BotFormProps) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<BotCreateInput>({
    name: initialData?.name || '',
    type: initialData?.type || BotType.TREND_LONG,
    exchange: initialData?.exchange || 'binance',
    config: {
      exchange: initialData?.config?.exchange || 'binance',
      symbol: initialData?.config?.symbol || 'BTC/USDT',
      leverage: initialData?.config?.leverage || 1,
      positionSize: initialData?.config?.positionSize || 100,
      strategy: initialData?.config?.strategy || {},
      riskManagement: {
        maxDailyLoss: initialData?.config?.riskManagement?.maxDailyLoss || 5,
        maxOpenPositions: initialData?.config?.riskManagement?.maxOpenPositions || 3,
        stopLossPercent: initialData?.config?.riskManagement?.stopLossPercent || 2,
        takeProfitPercent: initialData?.config?.riskManagement?.takeProfitPercent || 5,
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfigChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [field]: value,
      },
    }));
  };

  const handleRiskChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        riskManagement: {
          ...prev.config.riskManagement,
          [field]: value,
        },
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('botForm.name')}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full bg-[#1e2538] border border-[#2a3447] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('botForm.type')}
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full bg-[#1e2538] border border-[#2a3447] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={BotType.TREND_LONG}>Trend Long</option>
            <option value={BotType.TREND_SHORT}>Trend Short</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('botForm.exchange')}
          </label>
          <select
            value={formData.exchange}
            onChange={(e) => {
              handleInputChange('exchange', e.target.value);
              handleConfigChange('exchange', e.target.value);
            }}
            className="w-full bg-[#1e2538] border border-[#2a3447] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="binance">Binance</option>
            <option value="bybit">Bybit</option>
            <option value="kucoin">KuCoin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('botForm.symbol')}
          </label>
          <input
            type="text"
            value={formData.config.symbol}
            onChange={(e) => handleConfigChange('symbol', e.target.value)}
            className="w-full bg-[#1e2538] border border-[#2a3447] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="BTC/USDT"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('botForm.leverage')}
          </label>
          <input
            type="number"
            value={formData.config.leverage}
            onChange={(e) => handleConfigChange('leverage', Number(e.target.value))}
            className="w-full bg-[#1e2538] border border-[#2a3447] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="125"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('botForm.positionSize')} (USDT)
          </label>
          <input
            type="number"
            value={formData.config.positionSize}
            onChange={(e) => handleConfigChange('positionSize', Number(e.target.value))}
            className="w-full bg-[#1e2538] border border-[#2a3447] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="10"
            required
          />
        </div>
      </div>

      <div className="border-t border-[#1e2538] pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Risk Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('botForm.maxDailyLoss')}
            </label>
            <input
              type="number"
              value={formData.config.riskManagement.maxDailyLoss}
              onChange={(e) => handleRiskChange('maxDailyLoss', Number(e.target.value))}
              className="w-full bg-[#1e2538] border border-[#2a3447] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('botForm.maxOpenPositions')}
            </label>
            <input
              type="number"
              value={formData.config.riskManagement.maxOpenPositions}
              onChange={(e) => handleRiskChange('maxOpenPositions', Number(e.target.value))}
              className="w-full bg-[#1e2538] border border-[#2a3447] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('botForm.stopLoss')}
            </label>
            <input
              type="number"
              value={formData.config.riskManagement.stopLossPercent}
              onChange={(e) => handleRiskChange('stopLossPercent', Number(e.target.value))}
              className="w-full bg-[#1e2538] border border-[#2a3447] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('botForm.takeProfit')}
            </label>
            <input
              type="number"
              value={formData.config.riskManagement.takeProfitPercent}
              onChange={(e) => handleRiskChange('takeProfitPercent', Number(e.target.value))}
              className="w-full bg-[#1e2538] border border-[#2a3447] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.1"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} type="button">
          {t('botForm.cancel')}
        </Button>
        <Button variant="primary" type="submit" loading={loading}>
          {initialData ? t('botForm.update') : t('botForm.submit')}
        </Button>
      </div>
    </form>
  );
};
