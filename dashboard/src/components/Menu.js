import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  ["/", "Dashboard"],
  ["/orders", "Orders"],
  ["/holdings", "Holdings"],
  ["/positions", "Positions"],
  ["/funds", "Funds"],
  ["/apps", "Apps"],
];

export default function Menu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("zerodhaDemoUser") || "{}"); } catch { return {}; }
  })();

  return (
    <div className="menu-container">
      <div className="dashboard-brand">
        <img src="/logo.png" alt="Logo" />
        <span>Zerodha Clone</span>
      </div>

      <div className="menus">
        <ul>
          {menuItems.map(([to, label]) => (
            <li key={to}>
              <NavLink end={to === "/"} to={to} className={({ isActive }) => isActive ? "menu selected" : "menu"}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="profile-wrap">
          <button className="profile" onClick={() => setOpen((v) => !v)}>
            <span className="avatar">{(user.name || "TR").slice(0, 2).toUpperCase()}</span>
            <span className="username">{user.name || "TRADER"}</span>
            <span>⌄</span>
          </button>
          {open && (
            <div className="profile-menu">
              <button onClick={() => navigate("/funds")}>Funds</button>
              <button onClick={() => { localStorage.removeItem("zerodhaDemoUser"); navigate("/"); }}>Clear demo profile</button>
              <button onClick={() => window.location.assign(process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000")}>Landing page</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
