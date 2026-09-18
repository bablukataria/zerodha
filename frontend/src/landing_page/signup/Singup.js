import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const update = (e) => {
    setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    localStorage.setItem(
      "zerodhaDemoUser",
      JSON.stringify({ ...form, createdAt: new Date().toISOString() })
    );
    setDone(true);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 p-4 p-md-5">
            <div className="text-center mb-4">
              <img src="/media/image/signup.png" alt="Signup" style={{ maxWidth: 220 }} className="img-fluid" />
              <h1 className="h2 mt-3">Create your demo account</h1>
              <p className="text-muted">This opens a simulated trading account for the project dashboard.</p>
            </div>

            {done ? (
              <div className="alert alert-success">
                <h2 className="h5">Account created successfully.</h2>
                <p className="mb-3">Your demo profile is saved locally in this browser.</p>
                <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
                  Open dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label className="form-label">Full name</label>
                <input className="form-control mb-3" name="name" value={form.name} onChange={update} required />

                <label className="form-label">Email</label>
                <input className="form-control mb-3" type="email" name="email" value={form.email} onChange={update} required />

                <label className="form-label">Mobile number</label>
                <input className="form-control mb-3" inputMode="numeric" maxLength={10} name="mobile" value={form.mobile} onChange={update} required />

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <button className="btn btn-primary w-100 py-2" type="submit">
                  Create demo account
                </button>
              </form>
            )}

            <div className="text-center mt-4">
              <Link to="/">Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
