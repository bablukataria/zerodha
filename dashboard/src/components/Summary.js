import React, { useContext, useEffect, useState } from "react";
import GeneralContext from "./GeneralContext";
import { api, money } from "../api";

export default function Summary() {
  const { refreshKey } = useContext(GeneralContext);
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/allHoldings"), api.get("/allOrders")])
      .then(([holdingRes, orderRes]) => {
        setHoldings(holdingRes.data);
        setOrders(orderRes.data);
      })
      .catch(() => {});
  }, [refreshKey]);

  const investment = holdings.reduce((s, h) => s + Number(h.avg) * Number(h.qty), 0);
  const current = holdings.reduce((s, h) => s + Number(h.price) * Number(h.qty), 0);
  const pnl = current - investment;
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("zerodhaDemoUser") || "{}"); } catch { return {}; }
  })();

  return (
    <>
      <div className="page-heading">
        <div>
          <h2>Hi, {user.name?.split(" ")[0] || "Trader"} 👋</h2>
          <p>Here’s your portfolio overview.</p>
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <span>Current value</span>
          <strong>₹{money(current)}</strong>
          <small>Investment ₹{money(investment)}</small>
        </div>
        <div className="metric-card">
          <span>Total P&L</span>
          <strong className={pnl >= 0 ? "profit" : "loss"}>{pnl >= 0 ? "+" : ""}₹{money(pnl)}</strong>
          <small>{investment ? `${((pnl / investment) * 100).toFixed(2)}%` : "0.00%"} overall</small>
        </div>
        <div className="metric-card">
          <span>Holdings</span>
          <strong>{holdings.length}</strong>
          <small>Instruments</small>
        </div>
        <div className="metric-card">
          <span>Orders</span>
          <strong>{orders.length}</strong>
          <small>Simulated orders</small>
        </div>
      </div>

      <div className="dashboard-note">
        <strong>Demo mode</strong>
        <p className="mb-0">This application simulates trading. It does not send orders to a live exchange.</p>
      </div>
    </>
  );
}
