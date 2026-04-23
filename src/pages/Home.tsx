import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Clock, Heart, Star, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import SearchBox from "@/src/components/SearchBox";
import CarCard from "@/src/components/CarCard";
import { Car } from "@/src/types";
import { subscribeToCars } from "@/src/services/firebaseService";

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToCars((cars) => {
      setFeaturedCars(cars.slice(0, 3));
    });
    return () => unsubscribe();
  }, []);

  const trustIndicators = [
    { icon: <Heart className="w-6 h-6 text-orange-500" />, label: "500+ Happy Customers" },
    { icon: <Clock className="w-6 h-6 text-orange-500" />, label: "24/7 Support" },
    { icon: <Shield className="w-6 h-6 text-orange-500" />, label: "Verified Vehicles" },
  ];

  const whyChooseUs = [
    {
      title: "Reliability",
      desc: "Our vehicles are meticulously maintained to ensure your safety and comfort.",
      icon: <Shield className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Comfort",
      desc: "Experience luxury with our premium fleet of SUVs and sedans.",
      icon: <Heart className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Customer Support",
      desc: "Our dedicated team is available around the clock to assist you.",
      icon: <Clock className="w-8 h-8 text-orange-500" />
    }
  ];

  const testimonials = [
    {
      name: "John Kamau",
      review: "The best car rental service in Nairobi. The Land Cruiser was in perfect condition and the service was top-notch.",
      rating: 5
    },
    {
      name: "Sarah Wanjiku",
      review: "Very reliable and affordable. I rented a Prado for my family trip and it was a smooth experience.",
      rating: 5
    },
    {
      name: "David Omondi",
      review: "Excellent customer support. They were very helpful when I needed to extend my rental period.",
      rating: 5
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=1081007964226557"
            alt="Lion in Nairobi National Park"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
              Premium Car Rentals <br />
              <span className="text-orange-500">in Nairobi</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto">
              Reliable. Affordable. Luxury. Experience the best of Kenya with Jommu Rentals.
            </p>
            
            {/* Search Box */}
            <div className="pt-12">
              <SearchBox />
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-12">
              {trustIndicators.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white/90">
                  <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                    {item.icon}
                  </div>
                  <span className="text-sm font-bold tracking-wide uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">Featured Fleet</h2>
              <p className="text-gray-500 max-w-xl">
                Explore our most popular vehicles, handpicked for your comfort and style.
              </p>
            </div>
            <Link
              to="/fleet"
              className="hidden md:flex items-center gap-2 text-orange-500 font-bold hover:gap-3 transition-all"
            >
              View All Fleet <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="mt-12 md:hidden">
            <Link
              to="/fleet"
              className="flex items-center justify-center gap-2 w-full bg-white border-2 border-orange-500 text-orange-500 font-bold py-4 rounded-2xl"
            >
              View All Fleet <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We go above and beyond to ensure your car rental experience is seamless and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {whyChooseUs.map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-10 rounded-3xl space-y-6 hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-orange-100">
                <div className="bg-white p-4 rounded-2xl shadow-sm w-fit group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">What Our Clients Say</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our happy customers have to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="text-gray-600 italic leading-relaxed">
                  "{item.review}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold">
                    {item.name.charAt(0)}
                  </div>
                  <span className="font-bold text-gray-900">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to Start Your Journey?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Book your dream car today and explore Nairobi with style and comfort.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/fleet"
              className="bg-white text-orange-500 font-bold px-10 py-4 rounded-2xl hover:bg-gray-100 transition-all shadow-xl"
            >
              Browse Fleet
            </Link>
            <Link
              to="/contact"
              className="bg-orange-600 text-white font-bold px-10 py-4 rounded-2xl hover:bg-orange-700 transition-all shadow-xl"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
