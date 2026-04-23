import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  User,
  Car,
  Clock,
  ArrowRight
} from "lucide-react";
import Sidebar from "@/src/components/admin/Sidebar";
import Topbar from "@/src/components/admin/Topbar";
import { cn } from "@/src/lib/utils";
import { subscribeToBookings, updateBookingStatus as updateStatus } from "@/src/services/firebaseService";

const Bookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const unsubscribe = subscribeToBookings((data) => {
      setBookings(data.map((b: any) => ({
        id: b.id,
        customer: b.customerName || "Unknown",
        car: b.carName || "Unknown",
        pickupDate: b.pickupDate,
        returnDate: b.returnDate,
        status: b.status.charAt(0).toUpperCase() + b.status.slice(1)
      })));
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         booking.car.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "All" || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statuses = ["All", "Pending", "Approved", "Cancelled", "Completed"];

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await updateStatus(id, status.toLowerCase() as any);
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-orange-50 text-orange-600 border-orange-100";
      case "Approved": return "bg-green-50 text-green-600 border-green-100";
      case "Completed": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Cancelled": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Bookings Management" />
        
        <main className="p-8 pt-28 space-y-8 max-w-7xl mx-auto">
          {/* Header Actions */}
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search bookings..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
              <div className="relative">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-4 pr-10 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 transition-all appearance-none cursor-pointer"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="px-5 py-2.5 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all text-sm">Export CSV</button>
              <button className="px-5 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all text-sm shadow-lg shadow-orange-500/20">New Booking</button>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Car Model</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Pickup / Return</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-lg w-32"></div></td>
                        <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-lg w-40"></div></td>
                        <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-lg w-48"></div></td>
                        <td className="px-8 py-6"><div className="h-8 bg-gray-100 rounded-full w-24"></div></td>
                        <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-xl w-10 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold group-hover:scale-105 transition-transform">
                              {booking.customer.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{booking.customer}</p>
                              <p className="text-xs font-medium text-gray-500">Booking ID: #BK-{booking.id}284</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-gray-700 font-bold">
                            <Car className="w-4 h-4 text-orange-500" />
                            {booking.car}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3 text-sm font-bold text-gray-900">
                            <span>{booking.pickupDate}</span>
                            <ArrowRight className="w-4 h-4 text-gray-300" />
                            <span>{booking.returnDate}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "px-4 py-1.5 border text-xs font-bold rounded-full uppercase tracking-wider",
                            getStatusColor(booking.status)
                          )}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-2">
                            {booking.status === "Pending" && (
                              <>
                                <button 
                                  onClick={() => updateBookingStatus(booking.id, "Approved")}
                                  className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-all" 
                                  title="Approve"
                                >
                                  <CheckCircle2 className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => updateBookingStatus(booking.id, "Cancelled")}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all" 
                                  title="Cancel"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="px-8 py-6 border-t border-gray-50 flex justify-between items-center text-sm font-medium text-gray-500">
              <p>Showing {bookings.length} of 128 bookings</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50">Previous</button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-xl transition-all shadow-lg shadow-orange-500/20">Next</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Bookings;
