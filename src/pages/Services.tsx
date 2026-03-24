import { motion } from "motion/react";
import { Heart, Tent, Car, Users, UserCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Wedding Services",
    description: "Make your special day unforgettable with our luxury bridal cars. From classic vintage to modern luxury sedans, we provide the perfect ride for your wedding.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    icon: <Heart className="w-8 h-8 text-orange-500" />,
    features: ["Decorated Bridal Cars", "Professional Chauffeurs", "Punctual Service", "Luxury Fleet"]
  },
  {
    title: "Safari Tours",
    description: "Explore the wild beauty of Kenya with our specialized safari vehicles. Our 4x4 Land Cruisers are equipped for the toughest terrains and best viewing experiences.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
    icon: <Tent className="w-8 h-8 text-orange-500" />,
    features: ["4x4 Land Cruisers", "Experienced Guides", "Custom Itineraries", "Pop-up Roofs"]
  },
  {
    title: "Self-Drive Rentals",
    description: "Enjoy the freedom of the open road. Choose from our wide range of well-maintained vehicles and drive yourself to your destination at your own pace.",
    image: "https://images.unsplash.com/photo-1469033092221-85b37a8ced0e?auto=format&fit=crop&q=80&w=1200",
    icon: <Car className="w-8 h-8 text-orange-500" />,
    features: ["Flexible Duration", "Unlimited Mileage", "24/7 Roadside Assist", "Wide Selection"]
  },
  {
    title: "Meetings & Conventions",
    description: "Professional transport solutions for corporate events, conferences, and group meetings. We handle the logistics so you can focus on your business.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200",
    icon: <Users className="w-8 h-8 text-orange-500" />,
    features: ["Group Shuttles", "VIP Transport", "Logistics Planning", "Corporate Billing"]
  },
  {
    title: "Chauffeur Services",
    description: "Sit back and relax while our professional drivers take the wheel. Ideal for airport transfers, business trips, or a stress-free night out.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1200",
    icon: <UserCheck className="w-8 h-8 text-orange-500" />,
    features: ["Vetted Drivers", "Airport Meet & Greet", "Hourly Rentals", "Discreet Service"]
  }
];

export default function Services() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-500 font-bold uppercase tracking-widest text-sm"
          >
            What We Offer
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight"
          >
            Our Premium <span className="text-orange-500">Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto text-lg"
          >
            From luxury weddings to rugged safaris, we provide tailored transport solutions to meet your every need in Kenya.
          </motion.p>
        </div>

        {/* Services List */}
        <div className="space-y-32">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-orange-500/10 rounded-[2rem] transform rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                  {service.icon}
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{service.title}</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-gray-700 font-medium">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-orange-500 transition-all shadow-xl group"
                  >
                    Inquire Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 bg-orange-500 rounded-[3rem] p-12 md:p-20 text-center text-white space-y-8 shadow-2xl shadow-orange-200"
        >
          <h2 className="text-4xl md:text-5xl font-bold">Need a Custom Solution?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            We understand that every journey is unique. Contact our team to discuss your specific requirements and get a personalized quote.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/contact"
              className="bg-white text-orange-500 font-bold px-10 py-4 rounded-2xl hover:bg-gray-100 transition-all shadow-xl"
            >
              Contact Our Team
            </Link>
            <Link
              to="/fleet"
              className="bg-orange-600 text-white font-bold px-10 py-4 rounded-2xl hover:bg-orange-700 transition-all shadow-xl"
            >
              Browse Fleet
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
