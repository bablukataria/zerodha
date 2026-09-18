import React from "react";
import { Link } from "react-router-dom";

export default function OpenAccount() {
  return (
    <section className="container py-5 my-5">
      <div className="text-center py-5 border rounded-4">
        <h2>Open a demo trading account</h2>
        <p className="text-muted mb-4">
          Create your profile and explore simulated orders, holdings, positions and funds.
        </p>
        <Link className="btn btn-primary btn-lg" to="/signup">Sign up for free</Link>
      </div>
    </section>
  );
}
