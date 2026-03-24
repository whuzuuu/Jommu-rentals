import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  User,
  ExternalLink,
  MessageSquare,
  History
} from "lucide-react";
import Sidebar from "@/src/components/admin/Sidebar";
import Topbar from "@/src/components/admin/Topbar";

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setBookings([
        { id: 1, name: "John Doe", email: "john@example.com", phone: "+254 712 345 678", totalBookings: 5, status: "Active" },
        { id: 2, name: "Sarah Smith", email: "sarah@example.com", phone: "+254 723 456 789", totalBookings: 3, status: "Active" },
        { id: 3, name: "Michael Brown", email: "michael@example.com", phone: "+254 734 567 890", totalBookings: 8, status: "VIP" },
        { id: 4, name: "Emily Davis", email: "emily@example.com", phone: "+254 745 678 901", totalBookings: 1, status: "Active" },
        { id: 5, name: "David Wilson", email: "david@example.com", phone: "+254 756 789 012", totalBookings: 12, status: "VIP" },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Fix: I accidentally used setBookings instead of setCustomers in the mock fetch
  const setBookings = (data: any[]) => setCustomers(data);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Customers Management" />
        
        <main className="p-8 pt-28 space-y-8 max-w-7xl mx-auto">
          {/* Header Actions */}
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search customers..." 
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
              <button className="p-3 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-2xl transition-all">
                <Filter className="w-5 h-5" />
              </button>
            </div>
            
            <button className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-lg shadow-gray-900/20 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Send Newsletter
            </button>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Info</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Details</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Total Bookings</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-lg w-40"></div></td>
                        <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-lg w-48"></div></td>
                        <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-lg w-20"></div></td>
                        <td className="px-8 py-6"><div className="h-8 bg-gray-100 rounded-full w-24"></div></td>
                        <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-xl w-10 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : (
                    customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold group-hover:scale-105 transition-transform">
                              {customer.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{customer.name}</p>
                              <p className="text-xs font-medium text-gray-500">Member since 2023</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {customer.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {customer.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 font-bold text-gray-900">
                            <History className="w-4 h-4 text-orange-500" />
                            {customer.totalBookings}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 border text-xs font-bold rounded-full uppercase tracking-wider ${
                            customer.status === "VIP" 
                              ? "bg-purple-50 text-purple-600 border-purple-100" 
                              : "bg-green-50 text-green-600 border-green-100"
                          }`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all" title="View History">
                              <ExternalLink className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="Message">
                              <MessageSquare className="w-5 h-5" />
                            </button>
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
              <p>Showing {customers.length} of 85 customers</p>
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

export default Customers;
