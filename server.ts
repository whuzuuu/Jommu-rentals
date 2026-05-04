import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import { DateTime } from "luxon";
import admin from "firebase-admin";

dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.warn("Firebase Admin failed to initialize with applicationDefault. Falling back to env-based config if available.");
    // If you have a service account JSON in an env var:
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // Last resort: initialize with project ID. This might only work for some operations.
      admin.initializeApp({
        projectId: "jommu-rentals", // Or get from config
      });
    }
  }
}

const db = admin.firestore();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- M-Pesa Helpers ---

const getMpesaToken = async () => {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");

  const url = process.env.MPESA_ENVIRONMENT === "production"
    ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Basic ${auth}` },
    });
    return response.data.access_token;
  } catch (error: any) {
    console.error("M-Pesa Token Error:", error.response?.data || error.message);
    throw new Error("Failed to generate M-Pesa access token");
  }
};

const formatPhone = (phone: string) => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "254" + cleaned.substring(1);
  if (cleaned.startsWith("+")) cleaned = cleaned.substring(1);
  if (!cleaned.startsWith("254")) cleaned = "254" + cleaned;
  return cleaned;
};

// --- API Routes ---

app.post("/api/mpesa/stkpush", async (req, res) => {
  const { phoneNumber, amount, bookingId } = req.body;

  if (!phoneNumber || !amount || !bookingId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const token = await getMpesaToken();
    const timestamp = DateTime.now().setZone("Africa/Nairobi").toFormat("yyyyMMddHHmmss");
    const shortcode = process.env.MPESA_SHORTCODE || "174379"; // Default sandbox shortcode
    const passkey = process.env.MPESA_PASSKEY;
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    const url = process.env.MPESA_ENVIRONMENT === "production"
      ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
      : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const callbackUrl = process.env.MPESA_CALLBACK_URL || `${req.protocol}://${req.get("host")}/api/mpesa/callback`;

    const response = await axios.post(
      url,
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline", // or CustomerBuyGoodsOnline
        Amount: Math.round(amount),
        PartyA: formatPhone(phoneNumber),
        PartyB: shortcode,
        PhoneNumber: formatPhone(phoneNumber),
        CallBackURL: callbackUrl,
        AccountReference: `JommuRentals-${bookingId}`,
        TransactionDesc: `Car Rental Payment for Booking ${bookingId}`,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Save CheckoutRequestID to booking for later verification if needed
    await db.collection("bookings").doc(bookingId).update({
      checkoutRequestId: response.data.CheckoutRequestID,
      paymentStatus: "pending_stk",
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("STK Push Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate M-Pesa payment" });
  }
});

app.post("/api/mpesa/callback", async (req, res) => {
  const { Body } = req.body;
  const result = Body.stkCallback;

  console.log("M-Pesa Callback Received:", JSON.stringify(result, null, 2));

  try {
    // Find the booking by CheckoutRequestID
    const bookings = await db.collection("bookings")
      .where("checkoutRequestId", "==", result.CheckoutRequestID)
      .limit(1)
      .get();

    if (!bookings.empty) {
      const bookingDoc = bookings.docs[0];
      
      if (result.ResultCode === 0) {
        // Payment successful
        await bookingDoc.ref.update({
          paymentStatus: "paid",
          mpesaReceipt: result.CallbackMetadata.Item.find((i: any) => i.Name === "MpesaReceiptNumber").Value,
          status: "approved",
          updatedAt: admin.firestore.Timestamp.now(),
        });
        console.log(`Payment confirmed for booking ${bookingDoc.id}`);
      } else {
        // Payment failed or cancelled
        await bookingDoc.ref.update({
          paymentStatus: "failed",
          paymentError: result.ResultDesc,
          updatedAt: admin.firestore.Timestamp.now(),
        });
        console.log(`Payment failed for booking ${bookingDoc.id}: ${result.ResultDesc}`);
      }
    } else {
      console.warn("No booking found for CheckoutRequestID:", result.CheckoutRequestID);
    }

    res.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error: any) {
    console.error("Callback Processing Error:", error.message);
    res.status(500).json({ ResultCode: 1, ResultDesc: "Internal server error" });
  }
});

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

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
