import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { usePositions, useClosePosition } from "@/hooks/useData";
import { Position } from "@/types/api";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

export const PositionsPage = () => {
  const { t } = useTranslation();
  const { data: positionsData, isLoading } = usePositions();
  const closePosition = useClosePosition();

  const handleClosePosition = (positionId: string) => {
    if (window.confirm("Are you sure you want to close this position?")) {
      closePosition.mutate(positionId);
    }
  };

  const columnDefs: ColDef<Position>[] = [
    {
      field: "symbol" as any,
      headerName: t("positions.symbol"),
      width: 140,
      cellRenderer: (params: any) => (
        <span className="font-semibold text-white">{params.value}</span>
      ),
    },
    {
      field: "side" as any,
      headerName: t("positions.side"),
      width: 100,
      cellRenderer: (params: any) => (
        <span
          className={
            params.value === "LONG"
              ? "text-green-400 font-semibold"
              : "text-red-400 font-semibold"
          }
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "size" as any,
      headerName: t("positions.size"),
      width: 120,
      cellRenderer: (params: any) => params.value.toFixed(4),
    },
    {
      field: "entryPrice" as any,
      headerName: t("positions.entryPrice"),
      width: 140,
      cellRenderer: (params: any) => `$${params.value.toFixed(2)}`,
    },
    {
      field: "markPrice" as any,
      headerName: t("positions.markPrice"),
      width: 140,
      cellRenderer: (params: any) => `$${params.value.toFixed(2)}`,
    },
    {
      field: "leverage" as any,
      headerName: t("positions.leverage"),
      width: 100,
      cellRenderer: (params: any) => `${params.value}x`,
    },
    {
      field: "unrealizedPnL" as any,
      headerName: t("positions.pnl"),
      width: 130,
      cellRenderer: (params: any) => {
        const pnl = params.value || 0;
        return (
          <span
            className={
              pnl >= 0
                ? "text-green-400 font-semibold"
                : "text-red-400 font-semibold"
            }
          >
            ${pnl.toFixed(2)}
          </span>
        );
      },
    },
    {
      field: "unrealizedPnLPercent" as any,
      headerName: t("positions.pnlPercent"),
      width: 130,
      cellRenderer: (params: any) => {
        const pnlPercent = params.value || 0;
        return (
          <span className={pnlPercent >= 0 ? "text-green-400" : "text-red-400"}>
            {pnlPercent >= 0 ? "+" : ""}
            {pnlPercent.toFixed(2)}%
          </span>
        );
      },
    },
    {
      field: "liquidationPrice" as any,
      headerName: t("positions.liquidation"),
      width: 160,
      cellRenderer: (params: any) => (
        <span className="text-orange-400">${params.value.toFixed(2)}</span>
      ),
    },
    {
      field: "updatedAt" as any,
      headerName: "Updated",
      width: 150,
      cellRenderer: (params: any) =>
        format(new Date(params.value), "MMM dd, HH:mm"),
    },
    {
      field: "id" as any,
      headerName: t("positions.close"),
      width: 120,
      cellRenderer: (params: any) => (
        <Button
          size="sm"
          variant="danger"
          icon={<XMarkIcon className="w-4 h-4" />}
          onClick={() => handleClosePosition(params.value)}
        >
          Close
        </Button>
      ),
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
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold"
        >
          {t("positions.title")}
        </motion.h1>

        {positionsData?.data && positionsData.data.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="ag-theme-alpine-dark h-[600px] rounded-xl overflow-hidden border border-[#1e2538]"
          >
            <AgGridReact
              theme="legacy"
              rowData={positionsData.data}
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
            <p className="text-gray-400 text-lg">
              {t("positions.noPositions")}
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};
