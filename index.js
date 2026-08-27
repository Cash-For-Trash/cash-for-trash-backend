import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";
import { generalLimiter } from "./middlewares/rate_limit_middleware.js";
import authRoutes from "./routes/auth_routes.js";
import userRoutes from "./routes/user_routes.js";
import areaRoutes from "./routes/area_routes.js";
import garbageTypesRoutes from "./routes/garbageType_routes.js";
import adminRoutes from "./routes/admin_routes.js";
import addressRoutes from "./routes/address_routes.js";
import availabilityRoutes from "./routes/availability_routes.js";
import rewardsRoutes from "./routes/rewards_routes.js";
import rewardRedeemRoutes from "./routes/rewardRedeem_routes.js";
import collectionRequestRoutes from "./routes/collection_request_routes.js";
import workerRoutes from "./routes/worker_routes.js";
import pricingRoutes from "./routes/pricing_routes.js";
import customerRoutes from "./routes/customer_routes.js";
import paymentRoutes from "./routes/payment_routes.js";
import webhooksRoutes from "./routes/webhook_routes.js";
import notificationRoutes from "./routes/notification_routes.js";
import userDeviceRoutes from "./routes/userdevice_routes.js";
import { errorHandler } from "./middlewares/error_middleware.js";
import { swaggerUi, swaggerSpec } from "./swagger.js";

dotenv.config();

import "./config/db.js";
const app = express();


app.set("trust proxy", 1);
app.use(compression());
app.use(helmet());
app.use(cors());

app.use(generalLimiter);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/garbage-types", garbageTypesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/availabilities", availabilityRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/reward-redeems", rewardRedeemRoutes);
app.use("/api/collection-requests", collectionRequestRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/webhook", webhooksRoutes);
app.use("/api/userdevice", userDeviceRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Cash For Trash API is Running 🚀",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

const PORT = process.env.PORT || 3000;
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
