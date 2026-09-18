import React, { useState } from "react";
import { money } from "../api";

const initialBalance = 4043.1;

export default function Funds() {
  const [balance, setBalance] = useState(initialBalance);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const updateFunds = (direction) => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setMessage("Enter an amount greater than ₹0.");
      return;
    }
    if (direction === "withdraw" && value > balance) {
      setMessage("Insufficient demo balance.");
      return;
    }
    setBalance((old) => direction === "add" ? old + value : old - value);
    setAmount("");
    setMessage(`${direction === "add" ? "Added" : "Withdrawn"} ₹${money(value)} successfully.`);
  };

  return (
    <>
      <div className="page-heading"><div><h2>Funds</h2><p>Manage your simulated account balance.</p></div></div>

      <div className="funds-grid">
        <div className="funds-card">
          <span>Available margin</span>
          <strong>₹{money(balance)}</strong>
          <small>Available demo cash</small>
        </div>
        <div className="funds-card">
          <span>Used margin</span>
          <strong>₹0.00</strong>
          <small>No margin positions</small>
        </div>
      </div>

      <div className="fund-action-card">
        <h3>Quick transfer</h3>
        <p className="text-muted">This changes only the local demo balance.</p>
        <div className="fund-action-row">
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="1" placeholder="Amount" />
          <button className="primary-btn" onClick={() => updateFunds("add")}>Add funds</button>
          <button className="secondary-btn" onClick={() => updateFunds("withdraw")}>Withdraw</button>
        </div>
        {message && <div className="fund-message">{message}</div>}
      </div>
    </>
  );
}
