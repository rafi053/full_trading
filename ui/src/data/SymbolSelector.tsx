import { useState, useEffect, useRef } from "react";
import { bybitSymbols, getIconUrl } from "./Symbols";

interface SymbolSelectorProps {
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  error?: string | null;
  availableBalance?: number | null;
}

interface SymbolData {
  symbol: string;
  name: string;
}

const SymbolSelector = ({
  value,
  onChange,
  error,
  availableBalance,
}: SymbolSelectorProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [recentSymbols, setRecentSymbols] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredSymbols = bybitSymbols.filter(
    (s: SymbolData) =>
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const saved = localStorage.getItem("recentSymbols");
    if (saved) {
      try {
        setRecentSymbols(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent symbols:", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      fetchPrice(value);
    }
  }, [value]);

  const fetchPrice = async (symbol: string): Promise<void> => {
    try {
      const response = await fetch(
        `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${symbol}`
      );
      const data = await response.json();
      if (data.result?.list?.[0]) {
        const ticker = data.result.list[0];
        setCurrentPrice(parseFloat(ticker.lastPrice));
        setPriceChange(parseFloat(ticker.price24hPcnt) * 100);
      }
    } catch (err) {
      console.error("Failed to fetch price:", err);
    }
  };

  const saveRecentSymbol = (symbol: string): void => {
    const updated = [
      symbol,
      ...recentSymbols.filter((s: string) => s !== symbol),
    ].slice(0, 4);
    setRecentSymbols(updated);
    localStorage.setItem("recentSymbols", JSON.stringify(updated));
  };

  const handleSelect = (symbol: string): void => {
    onChange({ target: { name: "symbol", value: symbol } });
    saveRecentSymbol(symbol);
    setIsOpen(false);
    setSearch("");
  };

  const selectedSymbol = bybitSymbols.find(
    (s: SymbolData) => s.symbol === value
  );

  return (
    <div className="space-y-3">
      {availableBalance !== null && availableBalance !== undefined && (
        <div className="bg-rt-50 border border-rt-200 rounded-xl p-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-3 h-3 text-rt-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-xs font-medium text-rt-900">
                Available Balance
              </span>
            </div>
            <div className="text-sm font-bold text-rt-900">
              $
              {availableBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-xs text-rt-600">USDT</div>
          </div>
        </div>
      )}

      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-semibold text-gray-700 mb-2.5">
          Symbol <span className="text-red-500">*</span>
        </label>

        {recentSymbols.length > 0 && (
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Recent:</span>
            <div className="flex gap-1.5 flex-wrap">
              {recentSymbols.map((symbol: string) => (
                <button
                  key={symbol}
                  type="button"
                  onClick={() => handleSelect(symbol)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    value === symbol
                      ? "bg-rt-100 text-rt-700 border border-rt-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 border-2 rounded-xl cursor-pointer flex items-center justify-between ${
            error ? "border-red-500" : "border-gray-200 hover:border-gray-300"
          } transition-colors bg-white`}
        >
          <div className="flex items-center gap-3">
            {selectedSymbol ? (
              <>
                <img
                  src={getIconUrl(selectedSymbol.symbol)}
                  alt={selectedSymbol.symbol}
                  className="w-8 h-8 rounded-full"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {selectedSymbol.symbol}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedSymbol.name}
                  </div>
                </div>
              </>
            ) : (
              <span className="text-gray-400">Select a symbol</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentPrice && (
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  $
                  {currentPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                {priceChange !== null && (
                  <div
                    className={`text-xs font-medium ${
                      priceChange >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {priceChange >= 0 ? "+" : ""}
                    {priceChange.toFixed(2)}%
                  </div>
                )}
              </div>
            )}
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-80 overflow-hidden">
            <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search symbols... (e.g., BTC, ETH)"
                  className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-lg outline-none focus:border-rt-400 text-sm"
                  autoFocus
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {filteredSymbols.length} symbols found
              </div>
            </div>

            <div className="overflow-y-auto max-h-64">
              {filteredSymbols.length > 0 ? (
                filteredSymbols.map((symbol: SymbolData) => (
                  <div
                    key={symbol.symbol}
                    onClick={() => handleSelect(symbol.symbol)}
                    className={`px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      value === symbol.symbol ? "bg-rt-50" : ""
                    }`}
                  >
                    <img
                      src={getIconUrl(symbol.symbol)}
                      alt={symbol.symbol}
                      className="w-8 h-8 rounded-full"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {symbol.symbol}
                      </div>
                      <div className="text-xs text-gray-500">{symbol.name}</div>
                    </div>
                    {value === symbol.symbol && (
                      <svg
                        className="w-5 h-5 text-rt-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  No symbols found matching "{search}"
                </div>
              )}
            </div>
          </div>
        )}

        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default SymbolSelector;
