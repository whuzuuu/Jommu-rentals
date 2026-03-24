import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import CarCard from "@/src/components/CarCard";
import { Car } from "@/src/types";

export default function Fleet() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");

  useEffect(() => {
    fetch("/api/cars")
      .then(res => res.json())
      .then(data => {
        setCars(data);
        setFilteredCars(data);
      });
  }, []);

  useEffect(() => {
    let result = cars.filter(car => 
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (typeFilter === "All" || car.type === typeFilter)
    );

    if (sortBy === "Price Low → High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price High → Low") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredCars(result);
  }, [searchTerm, typeFilter, sortBy, cars]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Our Fleet</h1>
          <p className="text-gray-500">Choose from our wide range of premium vehicles.</p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row gap-6 justify-between items-center">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            {/* Type Filter */}
            <div className="relative flex-1 md:flex-none">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border-none rounded-2xl appearance-none focus:ring-2 focus:ring-orange-500 transition-all font-medium text-gray-700"
              >
                <option>All</option>
                <option>SUV</option>
                <option>Sedan</option>
                <option>Luxury</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative flex-1 md:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-gray-50 border-none rounded-2xl appearance-none focus:ring-2 focus:ring-orange-500 transition-all font-medium text-gray-700"
              >
                <option>Recommended</option>
                <option>Price Low → High</option>
                <option>Price High → Low</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-500">Try adjusting your filters or search term.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("All");
                setSortBy("Recommended");
              }}
              className="mt-6 text-orange-500 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
