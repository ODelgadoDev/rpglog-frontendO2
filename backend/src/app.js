const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const questsRoutes = require("./routes/quests.routes");
const syncRoutes = require("./routes/sync.routes");
const progressRoutes = require("./routes/progress.routes");
const pushRoutes = require("./routes/push.routes");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Postman, curl, apps móviles, server-to-server
    if (!origin) return callback(null, true);

    // Si no se configuró nada, permitir todo en local/dev
    if (allowedOrigins.length === 0) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origen no permitido por CORS"));
  },
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    ok: true,
    name: "RPGLog API",
    message: "RPGLog API funcionando 🚀"
  });
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/api/info", (req, res) => {
  res.json({
    ok: true,
    app: "RPGLog API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/quests", questsRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/push", pushRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: "Ruta no encontrada"
  });
});

app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  if (err.message === "Origen no permitido por CORS") {
    return res.status(403).json({
      ok: false,
      message: err.message
    });
  }

  return res.status(500).json({
    ok: false,
    message: "Error interno del servidor"
  });
});

module.exports = app;