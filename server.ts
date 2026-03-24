import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { createServer as createViteServer } from "vite";

// Routes
import { Admin } from "./server/models/Admin";
import bcrypt from "bcryptjs";
import authRoutes from "./server/routes/authRoutes";
import carRoutes from "./server/routes/carRoutes";
import bookingRoutes from "./server/routes/bookingRoutes";
import customerRoutes from "./server/routes/customerRoutes";
import adminRoutes from "./server/routes/adminRoutes";
import paymentRoutes from "./server/routes/paymentRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/jommusafaris";

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
if (MONGODB_URI && (MONGODB_URI.startsWith("mongodb://") || MONGODB_URI.startsWith("mongodb+srv://"))) {
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log("Connected to MongoDB");
      // Seed default admin
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await Admin.create({
          email: "admin@jommusafaris.com",
          password: hashedPassword
        });
        console.log("Default admin created: admin@jommusafaris.com / admin123");
      }
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      console.log("Running with mock database mode (in-memory simulation)...");
    });
} else {
  console.error("Invalid MONGODB_URI scheme. Expected 'mongodb://' or 'mongodb+srv://'");
  console.log("Running with mock database mode (in-memory simulation)...");
}

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

// Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
