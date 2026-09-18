import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-top mt-5 py-5 bg-light">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <img src="/media/image/logo.svg" alt="Logo" style={{ width: 140 }} />
            <p className="text-muted mt-3 mb-2">
              A Zerodha-inspired trading dashboard built as a learning project.
            </p>
            <small className="text-muted">© 2026 Zerodha Clone Demo. Not affiliated with Zerodha Broking Ltd.</small>
          </div>

          <div className="col-6 col-lg-2">
            <h6>Company</h6>
            <Link className="d-block text-decoration-none text-muted my-2" to="/about">About</Link>
            <Link className="d-block text-decoration-none text-muted my-2" to="/product">Products</Link>
            <Link className="d-block text-decoration-none text-muted my-2" to="/pricing">Pricing</Link>
          </div>

          <div className="col-6 col-lg-2">
            <h6>Account</h6>
            <Link className="d-block text-decoration-none text-muted my-2" to="/signup">Open account</Link>
            <Link className="d-block text-decoration-none text-muted my-2" to="/dashboard">Trading dashboard</Link>
          </div>

          <div className="col-12 col-lg-4">
            <h6>Important</h6>
            <p className="text-muted small mb-0">
              This is a portfolio/demo application. It does not connect to NSE/BSE or execute real trades.
              Prices and balances shown in the dashboard are simulated data.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
