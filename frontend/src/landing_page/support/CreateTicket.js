import React, { useState } from "react";

const topics = [
  "Account opening",
  "Orders and trading",
  "Funds and withdrawals",
  "Holdings and positions",
  "Technical issue",
  "Other",
];

export default function CreateTicket() {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitted(true);
  };

  return (
    <section className="container py-5">
      <h2 className="h3 mb-2">Create a support ticket</h2>
      <p className="text-muted mb-4">Choose a topic and describe the issue in your own words.</p>

      <div className="row g-3">
        {topics.map((topic) => (
          <div className="col-md-6 col-lg-4" key={topic}>
            <button
              type="button"
              onClick={() => { setSelected(topic); setSubmitted(false); }}
              className={`w-100 text-start border rounded-3 p-3 bg-white ${selected === topic ? "border-primary" : ""}`}
            >
              <strong>{topic}</strong>
              <span className="d-block small text-muted mt-1">Open help topic</span>
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <form className="card border-0 shadow-sm p-4 mt-4" onSubmit={submit}>
          <h3 className="h5">Ticket: {selected}</h3>
          <textarea className="form-control mt-3" rows="5" required placeholder="Describe your issue..." />
          <button className="btn btn-primary mt-3" type="submit">Submit ticket</button>
        </form>
      )}

      {submitted && <div className="alert alert-success mt-3">Demo ticket submitted successfully.</div>}
    </section>
  );
}
