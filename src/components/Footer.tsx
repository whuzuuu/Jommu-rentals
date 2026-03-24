import { Link } from "react-router-dom";
import { Car, Instagram, MessageCircle, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Jommu Safaris" 
                className="h-10 w-auto object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.querySelector('.logo-fallback')?.classList.remove('hidden');
                }}
              />
              <div className="logo-fallback hidden flex items-center gap-2">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <Car className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Jommu <span className="text-orange-500">Safaris</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium car rental services in Nairobi. We provide luxury, comfort, and reliability for all your travel needs in Kenya.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/jommusafaris" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/254726865347" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-orange-500 transition-colors">Our Services</Link></li>
              <li><Link to="/fleet" className="hover:text-orange-500 transition-colors">Our Fleet</Link></li>
              <li><Link to="/#reviews" className="hover:text-orange-500 transition-colors">Reviews</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>Self-Drive Rentals</li>
              <li>Chauffeur Services</li>
              <li>Airport Transfers</li>
              <li>Corporate Rentals</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span>Westlands, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <span>+254 726865347</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <span>info@jommusafaris.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Jommu Safaris. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
