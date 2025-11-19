import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { WalletIcon } from '@heroicons/react/24/outline';

export const WalletPage = () => {
  const { t } = useTranslation();

  const mockBalances = [
    { exchange: 'Binance', asset: 'USDT', free: 5000, locked: 2000, total: 7000, usdValue: 7000 },
    { exchange: 'Binance', asset: 'BTC', free: 0.5, locked: 0.1, total: 0.6, usdValue: 24000 },
    { exchange: 'Bybit', asset: 'USDT', free: 3000, locked: 1000, total: 4000, usdValue: 4000 },
    { exchange: 'KuCoin', asset: 'ETH', free: 2.5, locked: 0.5, total: 3, usdValue: 6000 },
  ];

  const totalUsdValue = mockBalances.reduce((sum, b) => sum + b.usdValue, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold"
        >
          {t('wallet.title')}
        </motion.h1>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <WalletIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{t('wallet.totalBalance')}</p>
              <h2 className="text-4xl font-bold text-white">
                ${totalUsdValue.toLocaleString()}
              </h2>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBalances.map((balance, index) => (
            <motion.div
              key={`${balance.exchange}-${balance.asset}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{balance.asset}</h3>
                    <span className="text-sm text-gray-400">{balance.exchange}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{t('wallet.free')}:</span>
                      <span className="text-white font-medium">{balance.free}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{t('wallet.locked')}:</span>
                      <span className="text-yellow-400 font-medium">{balance.locked}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-[#1e2538] pt-2">
                      <span className="text-gray-400">{t('wallet.total')}:</span>
                      <span className="text-white font-bold">{balance.total}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1e2538]">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">{t('wallet.usdValue')}:</span>
                      <span className="text-green-400 font-bold text-lg">
                        ${balance.usdValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
