import { useState, FormEvent } from "react";
import { MapPin, Calendar, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("Nairobi");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/fleet?location=${location}&pickup=${pickupDate}&return=${returnDate}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-4 md:p-6 border border-gray-100">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
            <MapPin className="w-3 h-3 text-orange-500" />
            Location
          </label>
          <div className="relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all appearance-none"
            >
              <option>Nairobi</option>
              <option>Mombasa</option>
              <option>Kisumu</option>
              <option>Nakuru</option>
            </select>
          </div>
        </div>

        {/* Pickup Date */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
            <Calendar className="w-3 h-3 text-orange-500" />
            Pickup Date
          </label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
            required
          />
        </div>

        {/* Return Date */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
            <Calendar className="w-3 h-3 text-orange-500" />
            Return Date
          </label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 transition-all"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 group"
        >
          <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Find Your Car
        </button>
      </form>
    </div>
  );
}
