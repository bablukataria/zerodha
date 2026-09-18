import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Signup", to: "/signup" },
  { label: "About", to: "/about" },
  { label: "Products", to: "/product" },
  { label: "Pricing", to: "/pricing" },
  { label: "Support", to: "/support" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom py-3 sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/" aria-label="Zerodha clone home">
          <img src="/media/image/logo.svg" alt="Zerodha clone" style={{ width: 130 }} />
        </Link>

        <div className="d-flex align-items-center gap-3">
          <Link className="btn btn-primary px-3 py-2" to="/signup">
            Open account
          </Link>
          <Link className="btn btn-outline-primary px-3 py-2" to="/dashboard">
            Dashboard
          </Link>
        </div>

        <div className="w-100 mt-3">
          <ul className="navbar-nav flex-row flex-wrap gap-3 justify-content-end">
            {navItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <Link
                  className={`nav-link ${location.pathname === item.to ? "active fw-semibold" : ""}`}
                  to={item.to}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
