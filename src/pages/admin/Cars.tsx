import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Car as CarIcon,
  DollarSign,
  Tag
} from "lucide-react";
import Sidebar from "@/src/components/admin/Sidebar";
import Topbar from "@/src/components/admin/Topbar";
import { motion } from "motion/react";

const Cars = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setCars([
        { id: 1, name: "Toyota Prado", price: 150, type: "SUV", imageUrl: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800" },
        { id: 2, name: "Range Rover Sport", price: 250, type: "Luxury", imageUrl: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80&w=800" },
        { id: 3, name: "Mercedes S-Class", price: 300, type: "Luxury", imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800" },
        { id: 4, name: "Land Cruiser V8", price: 200, type: "SUV", imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800" },
        { id: 5, name: "BMW X5", price: 180, type: "SUV", imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800" },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Cars Management" />
        
        <main className="p-8 pt-28 space-y-8 max-w-7xl mx-auto">
          {/* Header Actions */}
          <div className="flex flex-col md:row justify-between items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search cars..." 
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
              <button className="p-3 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-2xl transition-all">
                <Filter className="w-5 h-5" />
              </button>
            </div>
            
            <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/20 group w-full md:w-auto justify-center">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Add New Car
            </button>
          </div>

          {/* Cars Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Car Details</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Price / Day</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-8 py-6"><div className="h-12 bg-gray-100 rounded-xl w-48"></div></td>
                        <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-lg w-24"></div></td>
                        <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-lg w-20"></div></td>
                        <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-xl w-10 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : (
                    cars.map((car) => (
                      <tr key={car.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
                              <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{car.name}</p>
                              <p className="text-xs font-medium text-gray-500">ID: #JS-{car.id}00</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                            {car.type}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-bold text-gray-900">${car.price}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                              <MoreVertical className="w-4 h-4" />
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
              <p>Showing {cars.length} of 42 cars</p>
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

export default Cars;
