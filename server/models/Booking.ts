import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "cancelled", "completed"], default: "pending" },
  paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
}, { timestamps: true });

export const Booking = mongoose.model("Booking", bookingSchema);
