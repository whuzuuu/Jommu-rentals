import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Link } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: string;
  link?: string;
}

const StatCard = ({ title, value, icon: Icon, trend, color = "orange", link }: StatCardProps) => {
  const colorClasses = {
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  }[color] || "bg-gray-50 text-gray-600 border-gray-100";

  const Content = () => (
    <>
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-2xl border transition-transform group-hover:scale-110", colorClasses)}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
            trend.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}>
            {trend.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
      </div>
    </>
  );

  if (link) {
    return (
      <Link to={link} className="block bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
        <Content />
      </Link>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
      <Content />
    </div>
  );
};

export default StatCard;
