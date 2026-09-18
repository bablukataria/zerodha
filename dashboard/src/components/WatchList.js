import React, { useContext, useMemo, useState } from "react";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";
import { watchlist } from "../data/data";
import { DoughnutChart } from "./DoughnoutChart";

export default function WatchList() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      watchlist.filter((stock) =>
        stock.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [query]
  );

  const data = {
    labels: watchlist.map((stock) => stock.name),
    datasets: [
      {
        label: "Price",
        data: watchlist.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
      },
    ],
  };

  return (
    <aside className="watchlist-container">
      <div className="search-container">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          placeholder="Search eg: infy, tcs, nifty"
          className="search"
          aria-label="Search watchlist"
        />
        <span className="counts">{filtered.length} / {watchlist.length}</span>
      </div>

      <ul className="list">
        {filtered.map((stock) => (
          <WatchListItem stock={stock} key={stock.name} />
        ))}
      </ul>

      <div className="watchlist-chart">
        <DoughnutChart data={data} />
      </div>

      {filtered.length === 0 && <p className="empty-state">No matching instruments.</p>}
    </aside>
  );
}

function WatchListItem({ stock }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <li onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className={`percent ${stock.isDown ? "down" : "up"}`}>{stock.percent}</span>
          {stock.isDown ? <KeyboardArrowDown className="down" /> : <KeyboardArrowUp className="up" />}
          <span className="price">₹{stock.price.toFixed(2)}</span>
        </div>
      </div>
      {showActions && <WatchListActions stock={stock} />}
    </li>
  );
}

function WatchListActions({ stock }) {
  const generalContext = useContext(GeneralContext);

  return (
    <span className="actions">
      <span>
        <Tooltip title="Buy" placement="top" arrow TransitionComponent={Grow}>
          <button className="buy" onClick={() => generalContext.openOrderWindow(stock, "BUY")}>Buy</button>
        </Tooltip>
        <Tooltip title="Sell" placement="top" arrow TransitionComponent={Grow}>
          <button className="sell" onClick={() => generalContext.openOrderWindow(stock, "SELL")}>Sell</button>
        </Tooltip>
        <Tooltip title="Analytics" placement="top" arrow TransitionComponent={Grow}>
          <button className="action" type="button"><BarChartOutlined className="icon" /></button>
        </Tooltip>
        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action" type="button"><MoreHoriz className="icon" /></button>
        </Tooltip>
      </span>
    </span>
  );
}
