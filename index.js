import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth_routes.js";
import userRoutes from "./routes/user_routes.js";
import garbageTypesRoutes from "./routes/garbageType_routes.js"
import { errorHandler } from "./middlewares/error_middleware.js";
import { swaggerUi, swaggerSpec } from "./swagger.js";

dotenv.config();

import "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/garbage-Types",garbageTypesRoutes)

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

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
