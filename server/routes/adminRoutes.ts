import express from "express";
import { Car } from "../models/Car";
import { Booking } from "../models/Booking";
import { Customer } from "../models/Customer";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Admin: Get dashboard stats
router.get("/stats", protect, async (req, res) => {
  try {
    const totalCars = await Car.countDocuments({});
    const totalBookings = await Booking.countDocuments({});
    const totalCustomers = await Customer.countDocuments({});
    const bookings = await Booking.find({ paymentStatus: "paid" });
    const totalRevenue = bookings.reduce((acc, curr) => acc + curr.totalPrice, 0);

    res.json({
      totalCars,
      totalBookings,
      totalCustomers,
      totalRevenue,
      trends: {
        carTrend: { value: 2, isUp: true },
        bookingTrend: { value: 12, isUp: true },
        revenueTrend: { value: 8, isUp: true },
        customerTrend: { value: 5, isUp: true },
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
