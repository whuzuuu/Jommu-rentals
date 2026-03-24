import express from "express";
import { Booking } from "../models/Booking";
import { Customer } from "../models/Customer";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public: Create booking
router.post("/", async (req, res) => {
  const { customer, booking } = req.body;

  try {
    // Find or create customer
    let existingCustomer = await Customer.findOne({ email: customer.email });
    if (!existingCustomer) {
      existingCustomer = await Customer.create(customer);
    }

    const newBooking = new Booking({
      ...booking,
      customerId: existingCustomer._id,
    });

    const createdBooking = await newBooking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: "Invalid booking data" });
  }
});

// Admin: Get all bookings
router.get("/", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate("customerId").populate("carId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Update booking status
router.put("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      Object.assign(booking, req.body);
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid booking data" });
  }
});

export default router;
