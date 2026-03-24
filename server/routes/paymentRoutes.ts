import express from "express";
import { Booking } from "../models/Booking";

const router = express.Router();

// Public: Simulate M-Pesa payment
router.post("/mpesa", async (req, res) => {
  const { bookingId, phone, amount } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Simulate STK Push and success
    console.log(`Simulating M-Pesa payment for booking ${bookingId} from ${phone} for amount ${amount}`);

    // Update booking payment status
    booking.paymentStatus = "paid";
    await booking.save();

    res.json({ message: "Payment successful", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
