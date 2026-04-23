import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Car, 
  CalendarCheck, 
  Users, 
  User,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/src/firebase";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("isAdminAuthenticated");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Cars", path: "/admin/cars", icon: Car },
    { name: "Bookings", path: "/admin/bookings", icon: CalendarCheck },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Profile", path: "/admin/profile", icon: User },
  ];

  return (
    <div className="w-64 bg-gray-900 h-screen fixed left-0 top-0 text-white flex flex-col shadow-2xl z-50">
      <div className="p-6 border-b border-gray-800">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="bg-orange-500 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Jommu <span className="text-orange-500">Admin</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-orange-500")} />
                <span className="font-medium">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
