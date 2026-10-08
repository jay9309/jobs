const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const jobRoutes = require("./routes/job.routes");
const companyRoutes = require("./routes/company.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const paymentRoutes = require("./routes/payment.routes");
const applicationRoutes = require("./routes/application.routes");
const adminRoutes = require("./routes/admin.routes");
const revenueRoutes = require("./routes/revenue.routes");
const connectDB = require("./config/db");

const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();
const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "https://frontend-black-psi-72.vercel.app",
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGINS
  ]
    .filter(Boolean)
    .flatMap((origins) => origins.split(","))
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean)
);

app.use(cors({
  origin: (origin, callback) => {
    callback(null, !origin || allowedOrigins.has(origin));
  },
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Job Portal API is running",
    health: "/api/health"
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Job Portal API is running" });
});

app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/revenue", revenueRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
