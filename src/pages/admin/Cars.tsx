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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCar, setNewCar] = useState({
    name: "",
    type: "SUV",
    price: "",
    imageUrl: "",
    description: "",
    features: ""
  });

  const handleAddCar = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newCar,
          price: Number(newCar.price),
          features: newCar.features.split(",").map(f => f.trim())
        })
      });
      if (response.ok) {
        const addedCar = await response.json();
        setCars([...cars, { ...addedCar, id: addedCar._id }]);
        setIsModalOpen(false);
        setNewCar({ name: "", type: "SUV", price: "", imageUrl: "", description: "", features: "" });
      }
    } catch (error) {
      console.error("Failed to add car:", error);
    }
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars");
        const data = await response.json();
        if (response.ok) {
          setCars(data.map((c: any) => ({
            ...c,
            id: c._id
          })));
        }
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
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
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/20 group w-full md:w-auto justify-center"
            >
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

        {/* Add Car Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Add New Vehicle</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <form onSubmit={handleAddCar} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Car Name</label>
                    <input 
                      type="text" 
                      required
                      value={newCar.name}
                      onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                      placeholder="e.g. Toyota Prado"
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vehicle Type</label>
                    <select 
                      value={newCar.type}
                      onChange={(e) => setNewCar({ ...newCar, type: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                    >
                      <option value="SUV">SUV</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Sedan">Sedan</option>
                      <option value="Van">Van</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price per Day ($)</label>
                    <input 
                      type="number" 
                      required
                      value={newCar.price}
                      onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
                      placeholder="e.g. 150"
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Image URL</label>
                    <input 
                      type="url" 
                      required
                      value={newCar.imageUrl}
                      onChange={(e) => setNewCar({ ...newCar, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Features (comma separated)</label>
                  <input 
                    type="text" 
                    value={newCar.features}
                    onChange={(e) => setNewCar({ ...newCar, features: e.target.value })}
                    placeholder="e.g. Automatic, AC, 4x4, GPS"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                  <textarea 
                    rows={3}
                    value={newCar.description}
                    onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
                    placeholder="Brief description of the vehicle..."
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all font-medium resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/20"
                  >
                    Save Vehicle
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
