import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GeneralContext from "./GeneralContext";
import { api, money } from "../api";

export default function Orders() {
  const { refreshKey } = useContext(GeneralContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get("/allOrders")
      .then((res) => mounted && setOrders(res.data))
      .catch(() => mounted && setError("Unable to load orders. Start the backend server."))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [refreshKey]);

  return (
    <div className="orders">
      <div className="page-heading">
        <div>
          <h2>Orders</h2>
          <p>Recent simulated orders</p>
        </div>
        <Link to="/" className="secondary-btn">Dashboard</Link>
      </div>

      {loading && <div className="state-card">Loading orders…</div>}
      {error && <div className="state-card error">{error}</div>}
      {!loading && !error && orders.length === 0 && (
        <div className="state-card">
          <div className="empty-icon">↗</div>
          <p>You haven’t placed any orders yet.</p>
          <small>Use Buy/Sell from the watchlist to create an order.</small>
          <Link to="/" className="primary-btn">Go to dashboard</Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="card-table">
          <table>
            <thead>
              <tr><th>Date</th><th>Instrument</th><th>Mode</th><th>Qty.</th><th>Price</th><th>Value</th></tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id || `${order.name}-${order.createdAt}-${order.qty}`}>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : "Today"}</td>
                  <td>{order.name}</td>
                  <td><span className={`mode-pill ${order.mode === "SELL" ? "sell" : "buy"}`}>{order.mode}</span></td>
                  <td>{order.qty}</td>
                  <td>₹{money(order.price)}</td>
                  <td>₹{money(Number(order.qty) * Number(order.price))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
