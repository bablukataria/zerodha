import React, { useContext, useMemo, useState } from "react";
import GeneralContext from "./GeneralContext";
import { api, money } from "../api";
import "./BuyActionWindow.css";

export default function BuyActionWindow({ uid, defaultPrice = 0, initialMode = "BUY" }) {
  const { closeOrderWindow, refreshData } = useContext(GeneralContext);
  const [mode, setMode] = useState(initialMode);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(defaultPrice || 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(
    () => Number(stockQuantity || 0) * Number(stockPrice || 0),
    [stockQuantity, stockPrice]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const qty = Number(stockQuantity);
    const price = Number(stockPrice);

    if (!Number.isInteger(qty) || qty <= 0) {
      setError("Quantity must be a positive whole number.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/newOrder", { name: uid, qty, price, mode });
      refreshData();
      closeOrderWindow();
    } catch (err) {
      setError(err?.response?.data?.message || "Order failed. Is the backend running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="order-overlay" role="dialog" aria-modal="true">
      <form className="order-window" onSubmit={handleSubmit}>
        <div className={`order-header ${mode === "SELL" ? "sell" : ""}`}>
          <div>
            <span className="eyebrow">{mode === "SELL" ? "SELL ORDER" : "BUY ORDER"}</span>
            <h3>{uid}</h3>
          </div>
          <button type="button" className="icon-close" onClick={closeOrderWindow} aria-label="Close">
            ×
          </button>
        </div>

        <div className="order-tabs">
          <button type="button" className={mode === "BUY" ? "active" : ""} onClick={() => setMode("BUY")}>Buy</button>
          <button type="button" className={mode === "SELL" ? "active sell-tab" : ""} onClick={() => setMode("SELL")}>Sell</button>
        </div>

        <div className="order-body">
          <div className="inputs">
            <label>
              <span>Qty.</span>
              <input
                type="number"
                min="1"
                step="1"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
              />
            </label>

            <label>
              <span>Price</span>
              <input
                type="number"
                min="0.05"
                step="0.05"
                value={stockPrice}
                onChange={(e) => setStockPrice(e.target.value)}
              />
            </label>
          </div>

          <div className="order-summary">
            <span>Estimated value</span>
            <strong>₹{money(total)}</strong>
          </div>

          {error && <div className="order-error">{error}</div>}
        </div>

        <div className="order-footer">
          <button type="button" className="btn btn-light" onClick={closeOrderWindow}>
            Cancel
          </button>
          <button type="submit" className={`btn ${mode === "SELL" ? "btn-sell" : "btn-buy"}`} disabled={submitting}>
            {submitting ? "Placing…" : `${mode === "SELL" ? "Sell" : "Buy"} ${uid}`}
          </button>
        </div>
      </form>
    </div>
  );
}
