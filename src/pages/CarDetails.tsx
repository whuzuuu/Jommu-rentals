import { useState, useEffect, FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Users, Gauge, Fuel, CheckCircle2, ArrowLeft, Calendar, Phone, User } from "lucide-react";
import { Car } from "@/src/types";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    phone: "",
    pickupDate: "",
    returnDate: ""
  });

  useEffect(() => {
    fetch(`/api/cars/${id}`)
      .then(res => res.json())
      .then(data => {
        setCar(data);
        setActiveImage(data.imageUrl);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleBooking = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/booking?carId=${car?.id}&name=${bookingForm.fullName}&phone=${bookingForm.phone}&pickup=${bookingForm.pickupDate}&return=${bookingForm.returnDate}`);
  };

  if (loading) return <div className="pt-32 text-center">Loading...</div>;
  if (!car) return <div className="pt-32 text-center">Car not found</div>;

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/fleet" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Fleet
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Images & Info */}
          <div className="lg:col-span-2 space-y-12">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-video rounded-3xl overflow-hidden shadow-lg bg-white">
                <img
                  src={activeImage}
                  alt={car.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {car.gallery?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-32 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImage === img ? "border-orange-500 scale-95" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* Car Info */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">{car.type}</span>
                  <h1 className="text-4xl font-extrabold text-gray-900">{car.name}</h1>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-4xl font-black text-orange-500">${car.price}</span>
                  <span className="text-gray-500 font-bold text-lg"> / day</span>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center gap-3">
                  <Users className="w-6 h-6 text-orange-500" />
                  <div className="text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase">Seats</p>
                    <p className="font-bold text-gray-900">{car.seats || 5} People</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center gap-3">
                  <Gauge className="w-6 h-6 text-orange-500" />
                  <div className="text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase">Transmission</p>
                    <p className="font-bold text-gray-900">{car.transmission || "Auto"}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center gap-3">
                  <Fuel className="w-6 h-6 text-orange-500" />
                  <div className="text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase">Fuel Type</p>
                    <p className="font-bold text-gray-900">{car.fuelType || "Petrol"}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-orange-500" />
                  <div className="text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase">Status</p>
                    <p className="font-bold text-green-600">Available</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {car.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-600">
                      <div className="bg-orange-100 p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-32 space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Book This Car</h3>
                <p className="text-gray-500 text-sm">Fill in your details to reserve this vehicle.</p>
              </div>

              <form onSubmit={handleBooking} className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                    <User className="w-3 h-3 text-orange-500" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={bookingForm.fullName}
                    onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                    <Phone className="w-3 h-3 text-orange-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+254..."
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                      <Calendar className="w-3 h-3 text-orange-500" />
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={bookingForm.pickupDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, pickupDate: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                      <Calendar className="w-3 h-3 text-orange-500" />
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={bookingForm.returnDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, returnDate: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-orange-200 text-lg"
                >
                  Book Now
                </button>
              </form>

              <div className="pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400 font-medium">No credit card required for booking.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
