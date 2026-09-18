import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="container py-5">
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <span className="badge text-bg-light border mb-3">Trading dashboard demo</span>
          <h1 className="display-4 fw-semibold">Invest in everything</h1>
          <p className="lead text-muted">
            A clean Zerodha-inspired project with a landing website and a functional simulated trading dashboard.
          </p>
          <div className="d-flex gap-3 flex-wrap mt-4">
            <Link className="btn btn-primary btn-lg" to="/signup">Create account</Link>
            <Link className="btn btn-outline-primary btn-lg" to="/dashboard">Try dashboard</Link>
          </div>
        </div>
        <div className="col-lg-6 text-center">
          <img src="/media/image/homeHero.png" alt="Trading dashboard" className="img-fluid" />
        </div>
      </div>
    </section>
  );
}
