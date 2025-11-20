import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { router } from "./router";
import { useToast } from "./hooks/useToast";
import { ToastContainer } from "./components/ui/Toast";
import "./i18n";
import "./styles/ag-grid-custom.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

function App() {
  const { toasts, removeToast } = useToast();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </QueryClientProvider>
  );
}

export default App;
