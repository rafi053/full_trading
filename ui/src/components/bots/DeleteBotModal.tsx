import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

interface Bot {
  id: string;
  name: string;
  type: string;
  exchange: string;
  status: string;
  config: {
    symbol: string;
  };
}

interface DeleteBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: Bot | null;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteBotModal = ({
  isOpen,
  onClose,
  bot,
  onConfirm,
  loading = false,
}: DeleteBotModalProps) => {
  const { t } = useTranslation();
  if (!bot) return null;

  const isRunning = bot.status === "RUNNING";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("deleteBot.title")}
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-400 flex-shrink-0" />
          <p className="text-red-400 font-medium">{t("deleteBot.warning")}</p>
        </div>

        {isRunning && (
          <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-yellow-400 font-semibold">
                {t("deleteBot.runningWarningTitle")}
              </p>
              <p className="text-yellow-300 text-sm mt-1">
                {t("deleteBot.runningWarningMessage")}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3 bg-[#1e2538] p-4 rounded-lg">
          <h3 className="text-white font-semibold text-lg mb-3">
            {t("deleteBot.botDetails")}
          </h3>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-400">{t("deleteBot.name")}:</div>
            <div className="text-white font-medium">{bot.name}</div>

            <div className="text-gray-400">{t("deleteBot.type")}:</div>
            <div className="text-white font-medium">{bot.type}</div>

            <div className="text-gray-400">{t("deleteBot.exchange")}:</div>
            <div className="text-white font-medium">{bot.exchange}</div>

            <div className="text-gray-400">{t("deleteBot.symbol")}:</div>
            <div className="text-white font-medium">{bot.config.symbol}</div>

            <div className="text-gray-400">{t("deleteBot.status")}:</div>
            <div
              className={`font-medium ${
                isRunning ? "text-green-400" : "text-gray-400"
              }`}
            >
              {bot.status}
            </div>
          </div>
        </div>

        <p className="text-gray-300">
          {t("deleteBot.confirmMessage")}{" "}
          <span className="text-white font-semibold">"{bot.name}"</span>?
        </p>

        <div className="flex gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {t("deleteBot.cancel")}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={loading}
            disabled={isRunning}
            className="flex-1"
          >
            {t("deleteBot.confirmButton")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
