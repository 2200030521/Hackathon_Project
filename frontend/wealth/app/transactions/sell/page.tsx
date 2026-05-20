"use client";

import { useEffect, useState } from "react";
import React from "react";
import { apiPost, apiGet } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { Alert, Button, Card, Input, PageHeader, LoadingState } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

interface Holding {
  stock_symbol: string;
  company_name?: string;
  quantity: number | string;
  avg_buy_price: number | string;
  current_market_price: number | string;
}

export default function SellStockPage() {
  const { user } = useAuth();
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [holdingsLoading, setHoldingsLoading] = useState(true);

  // Fetch investor's holdings on mount
  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        if (!user?.id) return;
        setHoldingsLoading(true);
        const res = await apiGet<ApiResponse<Holding[]>>(`/holdings/${user.id}`);
        setHoldings(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load holdings:", err);
        setError("Failed to load holdings");
      } finally {
        setHoldingsLoading(false);
      }
    };
    fetchHoldings();
  }, [user?.id]);

  // Auto-populate price when holding is selected
  useEffect(() => {
    if (symbol) {
      const selectedHolding = holdings.find(h => h.stock_symbol === symbol);
      if (selectedHolding) {
        setPrice(String(Number(selectedHolding.current_market_price)));
      }
    }
  }, [symbol, holdings]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await apiPost<ApiResponse>("/transactions/sell", {
        stock_symbol: symbol,
        quantity: Number(quantity),
        price: Number(price),
      });
      setSuccess(res.message || "Sale completed");
      setSymbol("");
      setQuantity("");
      setPrice("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sell failed");
    } finally {
      setLoading(false);
    }
  }

  if (holdingsLoading) return <LoadingState />;

  if (holdings.length === 0) {
    return (
      <>
        <PageHeader title="Sell Stock" description="Place a sell order" />
        <Card className="max-w-lg">
          <Alert message="You don't have any holdings to sell" />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Sell Stock" description="Place a sell order" />
      <Card className="max-w-lg">
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <Alert message={error} />}
          {success && <Alert message={success} type="success" />}

          <div>
            <label htmlFor="holding-symbol" className="block text-sm font-medium text-zinc-900 mb-1">
              Stock Symbol <span className="text-red-500">*</span>
            </label>
            <select
              id="holding-symbol"
              required
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a stock to sell</option>
              {holdings.map((holding) => (
                <option key={holding.stock_symbol} value={holding.stock_symbol}>
                  {holding.stock_symbol} {holding.company_name ? `- ${holding.company_name}` : ''} | Qty: {holding.quantity} | Avg: ₹{Number(holding.avg_buy_price).toFixed(2)} | Current: ₹{Number(holding.current_market_price).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <Input 
            label={`Quantity (Max available: ${Number(holdings.find(h => h.stock_symbol === symbol)?.quantity || 0)})`} 
            type="number" 
            required 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)}
            max={holdings.find(h => h.stock_symbol === symbol)?.quantity?.toString()}
          />
          <Input 
            label="Price (Auto-filled)" 
            type="number" 
            step="0.01" 
            required 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            readOnly={!!symbol} 
            className={symbol ? "bg-zinc-100" : ""} 
          />

          {symbol && quantity && price && (
            <div className="rounded-lg bg-emerald-50 p-3 space-y-2 text-sm">
              <p className="text-zinc-700">
                <strong>Total Sale Amount:</strong> ₹{(Number(quantity) * Number(price)).toFixed(2)}
              </p>
              <p className="text-zinc-700">
                <strong>Units to Sell:</strong> {quantity}
              </p>
              <p className="text-zinc-700">
                <strong>Available Units:</strong> {holdings.find(h => h.stock_symbol === symbol)?.quantity}
              </p>
              {holdings.find(h => h.stock_symbol === symbol) && (
                <p className="text-zinc-700">
                  <strong>Potential Gain:</strong> ₹{(Number(quantity) * (Number(price) - Number(holdings.find(h => h.stock_symbol === symbol)!.avg_buy_price))).toFixed(2)}
                </p>
              )}
            </div>
          )}

          <Button type="submit" variant="danger" disabled={loading || !symbol}>
            {loading ? "Processing…" : "Sell"}
          </Button>
        </form>
      </Card>
    </>
  );
}
