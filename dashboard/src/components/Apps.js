import React from "react";

export default function Apps() {
  const apps = [
    ["Kite", "Trading and market watch"],
    ["Console", "Portfolio and reports"],
    ["Coin", "Direct mutual fund workflow"],
    ["Varsity", "Learning resources"],
  ];

  return (
    <>
      <div className="page-heading"><div><h2>Apps</h2><p>Quick links for this demo ecosystem.</p></div></div>
      <div className="app-grid">
        {apps.map(([name, desc]) => (
          <div className="app-card" key={name}>
            <div className="app-icon">{name.slice(0, 1)}</div>
            <h3>{name}</h3>
            <p>{desc}</p>
            <span>Demo module</span>
          </div>
        ))}
      </div>
    </>
  );
}
