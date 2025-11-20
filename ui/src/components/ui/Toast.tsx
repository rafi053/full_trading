import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({
  message,
  type,
  onClose,
  duration = 5000,
}: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
    error: <ExclamationCircleIcon className="w-6 h-6 text-red-400" />,
    warning: <ExclamationCircleIcon className="w-6 h-6 text-yellow-400" />,
    info: <InformationCircleIcon className="w-6 h-6 text-blue-400" />,
  };

  const bgColors = {
    success: "bg-green-500/10 border-green-500/50",
    error: "bg-red-500/10 border-red-500/50",
    warning: "bg-yellow-500/10 border-yellow-500/50",
    info: "bg-blue-500/10 border-blue-500/50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`flex items-center gap-3 p-4 rounded-lg border ${bgColors[type]} backdrop-blur-sm shadow-lg min-w-[300px] max-w-md`}
    >
      {icons[type]}
      <p className="flex-1 text-white text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
