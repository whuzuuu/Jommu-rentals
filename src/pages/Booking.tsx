import { useState, useEffect, FormEvent } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Car as CarIcon, Calendar, User, Mail, Phone, FileText, Loader2, CreditCard, Smartphone, Lock } from "lucide-react";
import { Car } from "@/src/types";
import { getCarById, createBooking, getCustomerByEmail, createCustomer } from "@/src/services/firebaseService";

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: searchParams.get("name") || "",
    email: "",
    phone: searchParams.get("phone") || "",
    pickupDate: searchParams.get("pickup") || "",
    returnDate: searchParams.get("return") || "",
    notes: "",
    paymentMethod: "mpesa" as "mpesa" | "card",
    paymentDetails: {
      mpesaPhone: searchParams.get("phone") || "",
      cardNumber: "",
      expiryDate: "",
      cvv: ""
    }
  });

  useEffect(() => {
    const carId = searchParams.get("carId");
    if (carId) {
      getCarById(carId)
        .then(data => {
          if (data) {
            setCar(data as any);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Ensure customer exists
      let customerId = "";
      const existingCustomer = await getCustomerByEmail(formData.email);
      
      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        customerId = await createCustomer({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        }) || "";
      }

      // 2. Create booking record first
      const bookingData = {
        customerId,
        carId: car?.id || "",
        carName: car?.name || "",
        pickupDate: new Date(formData.pickupDate),
        returnDate: new Date(formData.returnDate),
        totalPrice: car?.price || 0,
        status: "pending" as const,
        paymentStatus: "unpaid" as const,
        paymentMethod: formData.paymentMethod,
        mpesaPhone: formData.paymentDetails.mpesaPhone,
        notes: formData.notes
      };

      const bookingId = await createBooking(bookingData);
      
      if (!bookingId) throw new Error("Failed to create booking");

      // 3. If M-Pesa, trigger STK Push
      if (formData.paymentMethod === "mpesa") {
        const response = await fetch("/api/mpesa/stkpush", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: formData.paymentDetails.mpesaPhone,
            amount: car?.price || 0,
            bookingId: bookingId
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "M-Pesa push failed");
        }

        // 4. Listen for real-time status update from backend callback
        const { onSnapshot, doc } = await import("firebase/firestore");
        const { db } = await import("@/src/firebase");
        
        onSnapshot(doc(db, "bookings", bookingId), (docSnap) => {
          const data = docSnap.data();
          if (data?.paymentStatus === "paid") {
            setSuccess(true);
            setSubmitting(false);
            setTimeout(() => navigate("/"), 5000);
          } else if (data?.paymentStatus === "failed") {
            setSubmitting(false);
            alert(`Payment failed: ${data.paymentError || "Transaction cancelled"}`);
          }
        });
      } else {
        // Card or other methods (mocked for now, but following the same flow)
        setSuccess(true);
        setSubmitting(false);
        setTimeout(() => navigate("/"), 5000);
      }

    } catch (error: any) {
      console.error("Booking failed:", error);
      alert(error.message || "An error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="pt-32 text-center">Loading...</div>;

  if (success) {
    return (
      <div className="pt-48 pb-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl text-center space-y-8 border border-gray-100">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h2>
            <p className="text-gray-500 leading-relaxed">
              Thank you for choosing Jommu Rentals. We've received your booking for the <strong>{car?.name}</strong>. Our team will contact you shortly to finalize the details.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition-all"
          >
            Back to Home
          </button>
          <p className="text-xs text-gray-400">Redirecting to home in 5 seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-500">Just a few more details to get you on the road.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Details */}
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={formData.pickupDate}
                      onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-orange-500" />
                    Payment Method
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">
                    <Lock className="w-3 h-3" />
                    Secure Payment
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: "mpesa" })}
                    className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left ${
                      formData.paymentMethod === "mpesa"
                        ? "border-orange-500 bg-orange-50/50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${formData.paymentMethod === "mpesa" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">M-Pesa</p>
                      <p className="text-xs text-gray-500">Instant mobile payment</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: "card" })}
                    className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left ${
                      formData.paymentMethod === "card"
                        ? "border-orange-500 bg-orange-50/50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${formData.paymentMethod === "card" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Debit / Credit Card</p>
                      <p className="text-xs text-gray-500">Visa, Mastercard, Amex</p>
                    </div>
                  </button>
                </div>

                {/* Conditional Payment Fields */}
                <div className="pt-4">
                  {formData.paymentMethod === "mpesa" ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">M-Pesa Phone Number</label>
                        <input
                          type="tel"
                          placeholder="07..."
                          value={formData.paymentDetails.mpesaPhone}
                          onChange={(e) => setFormData({
                            ...formData,
                            paymentDetails: { ...formData.paymentDetails, mpesaPhone: e.target.value }
                          })}
                          className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                          required={formData.paymentMethod === "mpesa"}
                        />
                      </div>
                      <p className="text-xs text-gray-500 italic">You will receive an STK push on your phone to authorize the payment.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Card Number</label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={formData.paymentDetails.cardNumber}
                          onChange={(e) => setFormData({
                            ...formData,
                            paymentDetails: { ...formData.paymentDetails, cardNumber: e.target.value }
                          })}
                          className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                          required={formData.paymentMethod === "card"}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={formData.paymentDetails.expiryDate}
                            onChange={(e) => setFormData({
                              ...formData,
                              paymentDetails: { ...formData.paymentDetails, expiryDate: e.target.value }
                            })}
                            className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                            required={formData.paymentMethod === "card"}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            value={formData.paymentDetails.cvv}
                            onChange={(e) => setFormData({
                              ...formData,
                              paymentDetails: { ...formData.paymentDetails, cvv: e.target.value }
                            })}
                            className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                            required={formData.paymentMethod === "card"}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  <FileText className="w-3 h-3 text-orange-500" />
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                  placeholder="Any special requirements?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-orange-200 text-lg flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay KSh ${car?.price} & Confirm Booking`
                )}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-32 space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Booking Summary</h3>
              
              {car ? (
                <div className="space-y-6">
                  <div className="aspect-video rounded-2xl overflow-hidden">
                    <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-orange-500 font-bold uppercase tracking-widest">{car.type}</p>
                    <h4 className="text-xl font-bold text-gray-900">{car.name}</h4>
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Daily Rate</span>
                    <span className="text-xl font-bold text-gray-900">KSh {car.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Insurance</span>
                    <span className="text-green-600 font-bold">Included</span>
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-orange-500">KSh {car.price}*</span>
                  </div>
                  <p className="text-[10px] text-gray-400 italic">* Final price calculated based on duration and optional extras.</p>
                </div>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <CarIcon className="w-12 h-12 text-gray-200 mx-auto" />
                  <p className="text-gray-400 text-sm">No car selected.</p>
                  <Link to="/fleet" className="text-orange-500 font-bold text-sm hover:underline">Browse Fleet</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
