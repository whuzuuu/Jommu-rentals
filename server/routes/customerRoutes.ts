import express from "express";
import { Customer } from "../models/Customer";
import { Booking } from "../models/Booking";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Admin: Get all customers with their booking counts
router.get("/", protect, async (req, res) => {
  try {
    const customers = await Customer.find({});
    const customersWithBookings = await Promise.all(customers.map(async (customer) => {
      const totalBookings = await Booking.countDocuments({ customerId: customer._id });
      return {
        ...customer.toObject(),
        totalBookings,
      };
    }));
    res.json(customersWithBookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
