import { walletApi } from "@/api/wallet";
import { useQuery } from "@tanstack/react-query";

export const WALLET_QUERY_KEY = "wallet";

export const useBitunixBalance = () => {
  return useQuery({
    queryKey: [WALLET_QUERY_KEY, "bitunix"],
    queryFn: () => walletApi.getBitunixBalance(),
    refetchInterval: 10000,
  });
};
