import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container py-5 text-center">
      <div className="py-5">
        <h1 className="display-5">404</h1>
        <p className="text-muted">The page you are looking for does not exist.</p>
        <Link className="btn btn-primary" to="/">Back to home</Link>
      </div>
    </section>
  );
}
