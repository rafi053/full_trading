import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Card } from './Card';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  trend?: 'up' | 'down';
  subtitle?: string;
}

export const StatCard = ({ title, value, icon, change, trend, subtitle }: StatCardProps) => {
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <motion.h3
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-white mb-2"
          >
            {value}
          </motion.h3>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              <span
                className={clsx(
                  'text-sm font-medium',
                  trend === 'up' ? 'text-green-400' : 'text-red-400'
                )}
              >
                {trend === 'up' ? '↑' : '↓'} {Math.abs(change)}%
              </span>
            </div>
          )}
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400"
        >
          {icon}
        </motion.div>
      </div>
    </Card>
  );
};
