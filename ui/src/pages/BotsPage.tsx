import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PlusIcon, PlayIcon, StopIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Loading } from '@/components/ui/Loading';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BotForm } from '@/components/bots/BotForm';
import { useBots, useCreateBot, useStartBot, useStopBot, useDeleteBot } from '@/hooks/useBots';
import { BotCreateInput, BotStatus } from '@/types/api';
import { format } from 'date-fns';

export const BotsPage = () => {
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { data: botsData, isLoading } = useBots();
  const createBot = useCreateBot();
  const startBot = useStartBot();
  const stopBot = useStopBot();
  const deleteBot = useDeleteBot();

  const handleCreateBot = async (data: BotCreateInput) => {
    await createBot.mutateAsync(data);
    setIsCreateModalOpen(false);
  };

  const handleStartBot = (botId: string) => {
    startBot.mutate(botId);
  };

  const handleStopBot = (botId: string) => {
    stopBot.mutate(botId);
  };

  const handleDeleteBot = (botId: string) => {
    if (window.confirm(t('Are you sure you want to delete this bot?'))) {
      deleteBot.mutate(botId);
    }
  };

  const columnDefs = [
    {
      field: 'name',
      headerName: t('bots.name'),
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'status',
      headerName: t('bots.status'),
      width: 150,
      cellRenderer: (params: any) => <StatusBadge status={params.value} />,
    },
    {
      field: 'exchange',
      headerName: t('bots.exchange'),
      width: 120,
    },
    {
      field: 'config.symbol',
      headerName: t('bots.symbol'),
      width: 130,
    },
    {
      field: 'type',
      headerName: t('bots.type'),
      width: 140,
      cellRenderer: (params: any) => (
        <span className="text-blue-400">{params.value}</span>
      ),
    },
    {
      field: 'stats.todayPnL',
      headerName: t('bots.pnl'),
      width: 130,
      cellRenderer: (params: any) => {
        const pnl = params.value || 0;
        return (
          <span className={pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
            ${pnl.toFixed(2)}
          </span>
        );
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Updated',
      width: 160,
      cellRenderer: (params: any) => format(new Date(params.value), 'MMM dd, HH:mm'),
    },
    {
      field: 'id',
      headerName: t('bots.actions'),
      width: 180,
      cellRenderer: (params: any) => {
        const bot = params.data;
        const isRunning = bot.status === BotStatus.RUNNING;
        const isStopped = bot.status === BotStatus.STOPPED;

        return (
          <div className="flex gap-2 h-full items-center">
            {isStopped && (
              <Button
                size="sm"
                variant="success"
                icon={<PlayIcon className="w-4 h-4" />}
                onClick={() => handleStartBot(bot.id)}
              >
                Start
              </Button>
            )}
            {isRunning && (
              <Button
                size="sm"
                variant="danger"
                icon={<StopIcon className="w-4 h-4" />}
                onClick={() => handleStopBot(bot.id)}
              >
                Stop
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              icon={<TrashIcon className="w-4 h-4" />}
              onClick={() => handleDeleteBot(bot.id)}
            />
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <Layout>
        <Loading fullScreen />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold"
          >
            {t('bots.title')}
          </motion.h1>

          <Button
            variant="primary"
            icon={<PlusIcon className="w-5 h-5" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            {t('bots.createNew')}
          </Button>
        </div>

        {botsData?.data && botsData.data.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="ag-theme-alpine-dark h-[600px] rounded-xl overflow-hidden border border-[#1e2538]"
          >
            <AgGridReact
              rowData={botsData.data}
              columnDefs={columnDefs}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
              }}
              animateRows
              rowHeight={60}
              headerHeight={50}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-[#131824] rounded-xl border border-[#1e2538]"
          >
            <p className="text-gray-400 text-lg mb-4">{t('bots.noBots')}</p>
            <p className="text-gray-500 mb-8">{t('bots.createFirst')}</p>
            <Button
              variant="primary"
              icon={<PlusIcon className="w-5 h-5" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              {t('bots.createNew')}
            </Button>
          </motion.div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('botForm.create')}
        maxWidth="2xl"
      >
        <BotForm
          onSubmit={handleCreateBot}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={createBot.isPending}
        />
      </Modal>
    </Layout>
  );
};
