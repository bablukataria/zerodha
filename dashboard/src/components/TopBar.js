import React from "react";
import Menu from "./Menu";

export default function TopBar() {
  return (
    <header className="topbar-container">
      <div className="indices-container">
        <div className="index-box">
          <span className="index">NIFTY 50</span>
          <strong>22,500.20</strong>
          <small className="positive">+0.42%</small>
        </div>
        <div className="index-box">
          <span className="index">SENSEX</span>
          <strong>74,112.30</strong>
          <small className="positive">+0.36%</small>
        </div>
      </div>
      <Menu />
    </header>
  );
}
