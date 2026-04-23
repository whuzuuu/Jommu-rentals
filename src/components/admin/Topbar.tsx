import { 
  Search, 
  Bell, 
  User, 
  LogOut,
  Settings,
  HelpCircle
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";

const Topbar = ({ title }: { title: string }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-40 shadow-sm backdrop-blur-md bg-white/80">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search anything..."
            className="block w-80 pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-2xl transition-all group">
          <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-gray-100 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold group-hover:scale-105 transition-transform">
              AD
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-sm font-bold text-gray-900">Admin User</p>
              <p className="text-xs font-medium text-gray-500">Super Admin</p>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-50 mb-2">
                <p className="text-sm font-bold text-gray-900">Admin User</p>
                <p className="text-xs font-medium text-gray-500">admin@jommurentals.com</p>
              </div>
              <button 
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/admin/profile");
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                <HelpCircle className="w-4 h-4" />
                Help Center
              </button>
              <div className="border-t border-gray-50 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
