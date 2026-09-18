import React, { useContext, useEffect, useMemo, useState } from "react";
import { VerticalGraph } from "./VerticalGraph";
import GeneralContext from "./GeneralContext";
import { api, money } from "../api";

export default function Holdings() {
  const { refreshKey } = useContext(GeneralContext);
  const [allHoldings, setAllHoldings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/allHoldings")
      .then((res) => setAllHoldings(res.data))
      .catch(() => setError("Unable to load holdings."));
  }, [refreshKey]);

  const summary = useMemo(() => {
    const investment = allHoldings.reduce((sum, s) => sum + Number(s.avg) * Number(s.qty), 0);
    const current = allHoldings.reduce((sum, s) => sum + Number(s.price) * Number(s.qty), 0);
    const pnl = current - investment;
    return { investment, current, pnl };
  }, [allHoldings]);

  const labels = allHoldings.map((s) => s.name);
  const chartData = {
    labels,
    datasets: [{ label: "Current value", data: allHoldings.map((s) => Number(s.price) * Number(s.qty)) }],
  };

  return (
    <>
      <div className="page-heading">
        <div><h2>Holdings <span className="muted-count">({allHoldings.length})</span></h2><p>Your simulated long-term holdings</p></div>
      </div>
      {error && <div className="state-card error">{error}</div>}

      <div className="card-table">
        <table>
          <thead><tr><th>Instrument</th><th>Qty.</th><th>Avg. cost</th><th>LTP</th><th>Cur. val</th><th>P&L</th><th>Net chg.</th><th>Day chg.</th></tr></thead>
          <tbody>
            {allHoldings.map((stock) => {
              const curValue = Number(stock.price) * Number(stock.qty);
              const pnl = curValue - Number(stock.avg) * Number(stock.qty);
              return (
                <tr key={stock._id || stock.name}>
                  <td className="instrument">{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>₹{money(stock.avg)}</td>
                  <td>₹{money(stock.price)}</td>
                  <td>₹{money(curValue)}</td>
                  <td className={pnl >= 0 ? "profit" : "loss"}>{pnl >= 0 ? "+" : ""}₹{money(pnl)}</td>
                  <td className={String(stock.net).startsWith("-") ? "loss" : "profit"}>{stock.net || "0.00%"}</td>
                  <td className={String(stock.day).startsWith("-") ? "loss" : "profit"}>{stock.day || "0.00%"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="summary-cards">
        <div><strong>₹{money(summary.investment)}</strong><span>Total investment</span></div>
        <div><strong>₹{money(summary.current)}</strong><span>Current value</span></div>
        <div><strong className={summary.pnl >= 0 ? "profit" : "loss"}>{summary.pnl >= 0 ? "+" : ""}₹{money(summary.pnl)}</strong><span>Overall P&L</span></div>
      </div>

      {allHoldings.length > 0 && <div className="chart-card"><VerticalGraph data={chartData} /></div>}
    </>
  );
}
