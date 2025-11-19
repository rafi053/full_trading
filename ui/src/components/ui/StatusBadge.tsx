import { motion } from 'framer-motion';
import clsx from 'clsx';
import { BotStatus } from '@/types/api';

interface StatusBadgeProps {
  status: BotStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    [BotStatus.RUNNING]: {
      color: 'bg-green-500/20 text-green-400 border-green-500/30',
      dot: 'bg-green-500',
      label: 'Running',
    },
    [BotStatus.STOPPED]: {
      color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      dot: 'bg-gray-500',
      label: 'Stopped',
    },
    [BotStatus.ERROR]: {
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
      dot: 'bg-red-500',
      label: 'Error',
    },
    [BotStatus.STARTING]: {
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      dot: 'bg-yellow-500',
      label: 'Starting',
    },
    [BotStatus.STOPPING]: {
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      dot: 'bg-orange-500',
      label: 'Stopping',
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium',
        config.color
      )}
    >
      <motion.div
        className={clsx('w-2 h-2 rounded-full', config.dot)}
        animate={{
          scale: status === BotStatus.RUNNING ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: status === BotStatus.RUNNING ? Infinity : 0,
        }}
      />
      {config.label}
    </motion.div>
  );
};
