"use client";

import { useEffect, useState } from "react";
import React from "react";
import { apiPost, apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { Alert, Button, Card, Input, PageHeader, LoadingState } from "@/components/ui";

interface Stock {
  symbol: string;
  company_name: string;
  current_price: number | string;
}

export default function BuyStockPage() {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stocksLoading, setStocksLoading] = useState(true);

  // Fetch available stocks on mount
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setStocksLoading(true);
        const res = await apiGet<ApiResponse<Stock[]>>("/market/prices");
        setStocks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load stocks:", err);
        setError("Failed to load stocks");
      } finally {
        setStocksLoading(false);
      }
    };
    fetchStocks();
  }, []);

  // Auto-populate price when stock is selected
  useEffect(() => {
    if (symbol) {
      const selectedStock = stocks.find(s => s.symbol === symbol);
      if (selectedStock) {
        setPrice(String(Number(selectedStock.current_price)));
      }
    }
  }, [symbol, stocks]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await apiPost<ApiResponse>("/transactions/buy", {
        stock_symbol: symbol,
        quantity: Number(quantity),
        price: Number(price),
      });
      setSuccess(res.message || "Purchase completed");
      setSymbol("");
      setQuantity("");
      setPrice("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Buy failed");
    } finally {
      setLoading(false);
    }
  }

  if (stocksLoading) return <LoadingState />;

  return (
    <>
      <PageHeader title="Buy Stock" description="Place a buy order" />
      <Card className="max-w-lg">
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <Alert message={error} />}
          {success && <Alert message={success} type="success" />}
          
          <div>
            <label htmlFor="stock-symbol" className="block text-sm font-medium text-zinc-900 mb-1">
              Stock Symbol <span className="text-red-500">*</span>
            </label>
            <select
              id="stock-symbol"
              required
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a stock</option>
              {stocks.map((stock) => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.company_name} (₹{Number(stock.current_price).toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <Input label="Quantity" type="number" required value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <Input label="Price (Auto-filled)" type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} readOnly={!!symbol} className={symbol ? "bg-zinc-100" : ""} />
          
          {symbol && quantity && price && (
            <div className="rounded-lg bg-blue-50 p-3 text-sm">
              <p className="text-zinc-700">
                <strong>Total Amount:</strong> ₹{(Number(quantity) * Number(price)).toFixed(2)}
              </p>
              <p className="text-zinc-700">
                <strong>Units:</strong> {quantity}
              </p>
            </div>
          )}
          
          <Button type="submit" disabled={loading || !symbol}>
            {loading ? "Processing…" : "Buy"}
          </Button>
        </form>
      </Card>
    </>
  );
}
