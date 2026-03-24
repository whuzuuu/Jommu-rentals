import express from "express";
import { Car } from "../models/Car";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public: Get all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find({});
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Public: Get single car
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ message: "Car not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Create car
router.post("/", protect, async (req, res) => {
  try {
    const car = new Car(req.body);
    const createdCar = await car.save();
    res.status(201).json(createdCar);
  } catch (error) {
    res.status(400).json({ message: "Invalid car data" });
  }
});

// Admin: Update car
router.put("/:id", protect, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      Object.assign(car, req.body);
      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404).json({ message: "Car not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid car data" });
  }
});

// Admin: Delete car
router.delete("/:id", protect, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      await car.deleteOne();
      res.json({ message: "Car removed" });
    } else {
      res.status(404).json({ message: "Car not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
