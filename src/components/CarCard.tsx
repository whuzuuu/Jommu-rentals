import React from "react";
import { Link } from "react-router-dom";
import { Users, Fuel, Gauge, ArrowRight } from "lucide-react";
import { Car } from "@/src/types";
import { motion } from "motion/react";

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={car.imageUrl}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {car.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{car.name}</h3>
          <div className="text-right">
            <span className="text-2xl font-bold text-orange-500">${car.price}</span>
            <span className="text-gray-500 text-sm block">/day</span>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-gray-50">
          <div className="flex flex-col items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600 font-medium">{car.seats || 5} Seats</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Gauge className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600 font-medium">{car.transmission || "Auto"}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Fuel className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600 font-medium">{car.fuelType || "Petrol"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to={`/car/${car.id}`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Details
          </Link>
          <Link
            to={`/booking?carId=${car.id}`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
          >
            Book Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
