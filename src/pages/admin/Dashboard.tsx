import { useEffect, useState } from "react";
import { 
  Car, 
  CalendarCheck, 
  Users, 
  DollarSign, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Sidebar from "@/src/components/admin/Sidebar";
import Topbar from "@/src/components/admin/Topbar";
import StatCard from "@/src/components/admin/StatCard";
import Chart from "@/src/components/admin/Chart";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { getAdminStats } from "@/src/services/firebaseService";

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats({
          ...data,
          ...data.trends
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: "Jan", bookings: 45, revenue: 4500 },
    { name: "Feb", bookings: 52, revenue: 5200 },
    { name: "Mar", bookings: 48, revenue: 4800 },
    { name: "Apr", bookings: 61, revenue: 6100 },
    { name: "May", bookings: 55, revenue: 5500 },
    { name: "Jun", bookings: 67, revenue: 6700 },
  ];

  const recentActivity = [
    { id: 1, text: "John Doe booked Toyota Prado", time: "2 hours ago", icon: Clock, color: "text-blue-500 bg-blue-50" },
    { id: 2, text: "New customer registered: Sarah Smith", time: "4 hours ago", icon: Users, color: "text-green-500 bg-green-50" },
    { id: 3, text: "Booking approved for Range Rover", time: "5 hours ago", icon: CheckCircle2, color: "text-orange-500 bg-orange-50" },
    { id: 4, text: "Payment failed for Booking #1284", time: "1 day ago", icon: AlertCircle, color: "text-red-500 bg-red-50" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="Dashboard Overview" />
        
        <main className="p-8 pt-28 space-y-8 max-w-7xl mx-auto">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Cars" 
              value={stats?.totalCars || 0} 
              icon={Car} 
              trend={stats?.carTrend || "+0%"}
              color="blue"
              link="/admin/cars"
            />
            <StatCard 
              title="Total Bookings" 
              value={stats?.totalBookings || 0} 
              icon={CalendarCheck} 
              trend={stats?.bookingTrend || "+0%"}
              color="orange"
              link="/admin/bookings"
            />
            <StatCard 
              title="Total Revenue" 
              value={`KSh ${(stats?.totalRevenue || 0).toLocaleString()}`} 
              icon={DollarSign} 
              trend={stats?.revenueTrend || "+0%"}
              color="green"
            />
            <StatCard 
              title="Total Customers" 
              value={stats?.totalCustomers || 0} 
              icon={Users} 
              trend={stats?.customerTrend || "+0%"}
              color="purple"
              link="/admin/customers"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Charts */}
            <div className="lg:col-span-2 space-y-8">
              <Chart 
                type="line" 
                data={chartData} 
                dataKey="bookings" 
                title="Bookings Growth" 
                color="#f97316"
              />
              <Chart 
                type="bar" 
                data={chartData} 
                dataKey="revenue" 
                title="Revenue Performance" 
                color="#3b82f6"
              />
            </div>

            {/* Sidebar Content */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <Link 
                    to="/admin/cars" 
                    className="flex items-center justify-between w-full p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl transition-all shadow-lg shadow-orange-500/20 group"
                  >
                    <div className="flex items-center gap-3">
                      <Plus className="w-5 h-5" />
                      <span className="font-bold">Add New Car</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/admin/bookings" 
                    className="flex items-center justify-between w-full p-4 bg-gray-900 hover:bg-black text-white rounded-2xl transition-all shadow-lg shadow-gray-900/20 group"
                  >
                    <div className="flex items-center gap-3">
                      <CalendarCheck className="w-5 h-5" />
                      <span className="font-bold">View Bookings</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Recent Activity</h3>
                  <button className="text-xs font-bold text-orange-500 hover:underline">View All</button>
                </div>
                <div className="space-y-6">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                        <activity.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight mb-1">{activity.text}</p>
                        <p className="text-xs font-medium text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
