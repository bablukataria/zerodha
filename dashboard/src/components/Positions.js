import React, { useContext, useEffect, useState } from "react";
import GeneralContext from "./GeneralContext";
import { api, money } from "../api";

export default function Positions() {
  const { refreshKey } = useContext(GeneralContext);
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/allPositions")
      .then((res) => setPositions(res.data))
      .catch(() => setError("Unable to load positions."));
  }, [refreshKey]);

  return (
    <>
      <div className="page-heading">
        <div><h2>Positions <span className="muted-count">({positions.length})</span></h2><p>Intraday-style simulated positions</p></div>
      </div>
      {error && <div className="state-card error">{error}</div>}
      {positions.length === 0 ? (
        <div className="state-card">No open positions.</div>
      ) : (
        <div className="card-table">
          <table>
            <thead><tr><th>Product</th><th>Instrument</th><th>Qty.</th><th>Avg.</th><th>LTP</th><th>P&L</th><th>Chg.</th></tr></thead>
            <tbody>
              {positions.map((stock) => {
                const pnl = (Number(stock.price) - Number(stock.avg)) * Number(stock.qty);
                return (
                  <tr key={stock._id || stock.name}>
                    <td>{stock.product}</td>
                    <td>{stock.name}</td>
                    <td>{stock.qty}</td>
                    <td>₹{money(stock.avg)}</td>
                    <td>₹{money(stock.price)}</td>
                    <td className={pnl >= 0 ? "profit" : "loss"}>{pnl >= 0 ? "+" : ""}₹{money(pnl)}</td>
                    <td className={String(stock.day).startsWith("-") ? "loss" : "profit"}>{stock.day || "0.00%"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
