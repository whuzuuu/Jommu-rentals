import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  imageUrl: { type: String, required: true },
  images: [String],
  transmission: { type: String, enum: ["Automatic", "Manual"], default: "Automatic" },
  fuelType: { type: String, enum: ["Petrol", "Diesel", "Electric", "Hybrid"], default: "Petrol" },
  seats: { type: Number, default: 5 },
  available: { type: Boolean, default: true },
}, { timestamps: true });

export const Car = mongoose.model("Car", carSchema);
