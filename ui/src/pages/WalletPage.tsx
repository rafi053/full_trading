import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { WalletIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useBitunixBalance } from "@/hooks/useWallet";

const ExchangeBadge = ({ exchange }: { exchange: string }) => {
  const colors: Record<string, string> = {
    Bitunix: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    Binance: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    Bybit: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    KuCoin: "bg-green-500/10 text-green-400 border-green-500/30",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        colors[exchange] || "bg-gray-500/10 text-gray-400 border-gray-500/30"
      }`}
    >
      {exchange}
    </span>
  );
};

export const WalletPage = () => {
  const { t } = useTranslation();
  const { data: balanceData, isLoading, error } = useBitunixBalance();

  const balances = balanceData?.data || [];
  const totalValue = balances.reduce((sum, b) => sum + b.total, 0);

  if (isLoading) {
    return (
      <Layout>
        <Loading fullScreen />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-20 bg-dark-card rounded-xl border border-dark-border">
          <p className="text-red-400 text-lg">{t("wallet.error")}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold"
        >
          {t("wallet.title")}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                <WalletIcon className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm font-medium mb-1">
                  {t("wallet.totalBalance")}
                </p>
                <h2 className="text-5xl font-bold text-white tracking-tight">
                  $
                  {totalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h2>
              </div>
            </div>
          </Card>
        </motion.div>

        {balances.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {balances.map((balance, index) => (
              <motion.div
                key={`${balance.exchange}-${balance.asset}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between mb-2">
                      <ExchangeBadge exchange={balance.exchange} />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                        <CurrencyDollarIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {balance.asset}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Futures Account • {balance.exchange}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-dark-bg/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm font-medium">
                          {t("wallet.free")}:
                        </span>
                        <span className="text-white font-semibold">
                          $
                          {balance.free.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm font-medium">
                          {t("wallet.locked")}:
                        </span>
                        <span className="text-yellow-400 font-semibold">
                          $
                          {balance.locked.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-dark-border">
                        <span className="text-gray-400 text-sm font-medium">
                          {t("wallet.total")}:
                        </span>
                        <span className="text-white font-bold text-lg">
                          $
                          {balance.total.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>

                    {balance.unrealizedPnl !== undefined && (
                      <div className="pt-3 border-t border-dark-border">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm font-medium">
                            Unrealized PnL:
                          </span>
                          <span
                            className={`font-bold text-xl ${
                              balance.unrealizedPnl >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {balance.unrealizedPnl >= 0 ? "+" : ""}$
                            {balance.unrealizedPnl.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-dark-card rounded-xl border border-dark-border"
          >
            <WalletIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">
              {t("wallet.noBalances")}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Connect your exchange to view balances
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};
