require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const seedData = require("./seedData");

const PORT = Number(process.env.PORT || 3002);
const uri = process.env.MONGO_URL || "";
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(",").map((value) => value.trim())
    : true,
}));
app.use(express.json());

let dbConnected = false;
let dbError = null;
let fallbackHoldings = structuredClone(seedData.watchlist);
let fallbackPositions = structuredClone(seedData.positions);
let fallbackOrders = [];

const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

function validateOrder(body) {
  const name = String(body.name || "").trim().toUpperCase();
  const qty = Number(body.qty);
  const price = Number(body.price);
  const mode = String(body.mode || "").toUpperCase();

  if (!name || !["BUY", "SELL"].includes(mode)) throw new Error("Invalid instrument or order mode.");
  if (!Number.isInteger(qty) || qty <= 0) throw new Error("Quantity must be a positive whole number.");
  if (!Number.isFinite(price) || price <= 0) throw new Error("Price must be greater than 0.");

  return { name, qty, price: round2(price), mode };
}

function applyHoldingTrade(list, order) {
  const existing = list.find((item) => item.name === order.name);

  if (order.mode === "BUY") {
    if (!existing) {
      list.push({
        name: order.name, qty: order.qty, avg: order.price, price: order.price,
        net: "0.00%", day: "0.00%", isLoss: false,
      });
    } else {
      const oldQty = Number(existing.qty);
      const newQty = oldQty + order.qty;
      existing.avg = round2(((oldQty * Number(existing.avg)) + (order.qty * order.price)) / newQty);
      existing.qty = newQty;
      existing.price = order.price;
      const pnl = existing.price - existing.avg;
      existing.net = `${pnl >= 0 ? "+" : ""}${((pnl / existing.avg) * 100).toFixed(2)}%`;
      existing.isLoss = pnl < 0;
    }
    return;
  }

  if (!existing || Number(existing.qty) < order.qty) {
    throw new Error(`Cannot sell ${order.qty}. Available quantity for ${order.name}: ${existing?.qty || 0}.`);
  }

  existing.qty -= order.qty;
  existing.price = order.price;

  if (existing.qty === 0) {
    const index = list.indexOf(existing);
    list.splice(index, 1);
  } else {
    const pnl = existing.price - Number(existing.avg);
    existing.net = `${pnl >= 0 ? "+" : ""}${((pnl / Number(existing.avg)) * 100).toFixed(2)}%`;
    existing.isLoss = pnl < 0;
  }
}

function applyPositionTrade(list, order) {
  let position = list.find((item) => item.name === order.name);

  if (order.mode === "BUY") {
    if (!position) {
      list.push({
        product: "CNC", name: order.name, qty: order.qty, avg: order.price,
        price: order.price, net: "0.00%", day: "0.00%", isLoss: false,
      });
    } else {
      const oldQty = Number(position.qty);
      const newQty = oldQty + order.qty;
      position.avg = round2(((oldQty * Number(position.avg)) + (order.qty * order.price)) / newQty);
      position.qty = newQty;
      position.price = order.price;
    }
    return;
  }

  if (!position || Number(position.qty) < order.qty) {
    throw new Error(`Cannot sell ${order.qty}. Available position quantity: ${position?.qty || 0}.`);
  }
  position.qty -= order.qty;
  position.price = order.price;
  if (position.qty === 0) list.splice(list.indexOf(position), 1);
}

async function seedMongo() {
  const [holdingCount, positionCount] = await Promise.all([
    HoldingsModel.countDocuments(),
    PositionsModel.countDocuments(),
  ]);

  if (holdingCount === 0) await HoldingsModel.insertMany(seedData.watchlist);
  if (positionCount === 0) await PositionsModel.insertMany(seedData.positions);
}

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    database: dbConnected ? "mongodb" : "fallback",
    databaseError: dbError,
    time: new Date().toISOString(),
  });
});

app.get("/allHoldings", async (req, res) => {
  try {
    const holdings = dbConnected ? await HoldingsModel.find().sort({ name: 1 }) : fallbackHoldings;
    res.json(holdings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    const positions = dbConnected ? await PositionsModel.find().sort({ name: 1 }) : fallbackPositions;
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/allOrders", async (req, res) => {
  try {
    const orders = dbConnected
      ? await OrdersModel.find().sort({ createdAt: -1 })
      : [...fallbackOrders].reverse();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const order = validateOrder(req.body);

    if (dbConnected) {
      const existing = await HoldingsModel.findOne({ name: order.name });
      if (order.mode === "SELL" && (!existing || existing.qty < order.qty)) {
        return res.status(400).json({
          message: `Cannot sell ${order.qty}. Available quantity: ${existing?.qty || 0}.`,
        });
      }

      const position = await PositionsModel.findOne({ name: order.name });
      if (order.mode === "SELL" && (!position || position.qty < order.qty)) {
        return res.status(400).json({
          message: `Cannot sell ${order.qty}. Available position quantity: ${position?.qty || 0}.`,
        });
      }

      let newHoldingQty = 0;

      if (order.mode === "BUY") {
        if (!existing) {
          await HoldingsModel.create({
            ...order,
            qty: order.qty,
            avg: order.price,
            net: "0.00%",
            day: "0.00%",
            isLoss: false,
          });
          newHoldingQty = order.qty;
        } else {
          const oldQty = existing.qty;
          const newQty = oldQty + order.qty;
          existing.avg = round2(((oldQty * existing.avg) + (order.qty * order.price)) / newQty);
          existing.qty = newQty;
          existing.price = order.price;
          existing.net = `${order.price >= existing.avg ? "+" : ""}${(((order.price - existing.avg) / existing.avg) * 100).toFixed(2)}%`;
          existing.day = "0.00%";
          existing.isLoss = order.price < existing.avg;
          await existing.save();
          newHoldingQty = newQty;
        }
      } else {
        existing.qty -= order.qty;
        existing.price = order.price;
        if (existing.qty === 0) {
          await HoldingsModel.deleteOne({ _id: existing._id });
        } else {
          existing.net = `${order.price >= existing.avg ? "+" : ""}${(((order.price - existing.avg) / existing.avg) * 100).toFixed(2)}%`;
          existing.day = "0.00%";
          existing.isLoss = order.price < existing.avg;
          await existing.save();
        }
        newHoldingQty = Math.max(existing.qty, 0);
      }

      if (order.mode === "BUY") {
        if (!position) {
          await PositionsModel.create({
            product: "CNC", name: order.name, qty: order.qty, avg: order.price,
            price: order.price, net: "0.00%", day: "0.00%", isLoss: false,
          });
        } else {
          const oldQty = position.qty;
          const newQty = oldQty + order.qty;
          position.avg = round2(((oldQty * position.avg) + (order.qty * order.price)) / newQty);
          position.qty = newQty;
          position.price = order.price;
          await position.save();
        }
      } else {
        position.qty -= order.qty;
        position.price = order.price;
        if (position.qty <= 0) await PositionsModel.deleteOne({ _id: position._id });
        else await position.save();
      }

      const saved = await OrdersModel.create(order);
      return res.status(201).json({ success: true, order: saved, holdingQty: newHoldingQty });
    }

    if (order.mode === "SELL") {
      const existing = fallbackHoldings.find((item) => item.name === order.name);
      if (!existing || existing.qty < order.qty) {
        return res.status(400).json({
          message: `Cannot sell ${order.qty}. Available quantity: ${existing?.qty || 0}.`,
        });
      }
    }

    const nextHoldings = structuredClone(fallbackHoldings);
    const nextPositions = structuredClone(fallbackPositions);
    applyHoldingTrade(nextHoldings, order);
    applyPositionTrade(nextPositions, order);
    fallbackHoldings = nextHoldings;
    fallbackPositions = nextPositions;

    const saved = { ...order, _id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString() };
    fallbackOrders.push(saved);
    res.status(201).json({ success: true, order: saved });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

async function start() {
  if (uri) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      dbConnected = true;
      dbError = null;
      await seedMongo();
      console.log("MongoDB connected");
    } catch (error) {
      dbError = error.message;
      console.error("MongoDB connection failed; using fallback memory mode:", error.message);
    }
  } else {
    console.warn("MONGO_URL not configured; using fallback memory mode");
  }

  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}

start();
