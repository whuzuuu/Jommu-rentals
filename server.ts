import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data
  const cars = [
    {
      id: "1",
      name: "Toyota Land Cruiser V8",
      price: 150,
      type: "SUV",
      imageUrl: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800",
      transmission: "Automatic",
      fuelType: "Diesel",
      seats: 7,
      features: ["4WD", "Leather Seats", "Sunroof", "GPS Navigation", "Bluetooth"],
      gallery: [
        "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      id: "2",
      name: "Range Rover Sport",
      price: 250,
      type: "Luxury",
      imageUrl: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80&w=800",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      features: ["Panoramic Roof", "Premium Sound", "Air Suspension", "Heated Seats"],
      gallery: [
        "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      id: "3",
      name: "Mercedes-Benz E-Class",
      price: 180,
      type: "Luxury",
      imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      features: ["Ambient Lighting", "Luxury Interior", "Driver Assist", "Quiet Cabin"],
      gallery: [
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      id: "4",
      name: "Toyota Prado TXL",
      price: 120,
      type: "SUV",
      imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
      transmission: "Automatic",
      fuelType: "Diesel",
      seats: 7,
      features: ["Reliable", "Off-road Capable", "Spacious", "AC"],
      gallery: [
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      id: "5",
      name: "Nissan X-Trail",
      price: 70,
      type: "SUV",
      imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      features: ["Economical", "Family Friendly", "Modern Tech"],
      gallery: [
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      id: "6",
      name: "BMW X5",
      price: 220,
      type: "Luxury",
      imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800",
      transmission: "Automatic",
      fuelType: "Diesel",
      seats: 5,
      features: ["Performance", "Luxury Tech", "Safe", "Fast"],
      gallery: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800"
      ]
    }
  ];

  // API Routes
  app.get("/api/cars", (req, res) => {
    res.json(cars);
  });

  app.get("/api/cars/:id", (req, res) => {
    const car = cars.find(c => c.id === req.params.id);
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ message: "Car not found" });
    }
  });

  app.post("/api/bookings", (req, res) => {
    const { carId, carName, fullName, email, phone, pickupDate, returnDate, notes, paymentMethod, paymentDetails } = req.body;
    
    console.log("New Booking Received:");
    console.log(`- Car: ${carName} (${carId})`);
    console.log(`- Customer: ${fullName} (${email}, ${phone})`);
    console.log(`- Dates: ${pickupDate} to ${returnDate}`);
    console.log(`- Payment: ${paymentMethod.toUpperCase()}`);
    
    if (paymentMethod === "mpesa") {
      console.log(`- M-Pesa Phone: ${paymentDetails.mpesaPhone}`);
    } else {
      console.log(`- Card: ${paymentDetails.cardNumber.replace(/\d(?=\d{4})/g, "*")} (Exp: ${paymentDetails.expiryDate})`);
    }

    // In a real app, integrate with M-Pesa Daraja API or Stripe/Paystack
    res.status(201).json({ message: "Booking successful", booking: req.body });
  });

  // Vite middleware for development
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
