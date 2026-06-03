import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, AlertTriangle, DollarSign, TrendingDown, CalendarClock,
} from "lucide-react";
import api from "../../../api";

const MONTH_NAMES = [
  "", "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
];

function StatCard({ icon: Icon, label, value, sub, color = "green" }) {
  const colors = {
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function ConcessionaireDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/concessionaires/dashboard/summary")
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-gray-400 p-4">Loading...</div>;
  if (!data) return null;

  const now = new Date();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Concessionaires Overview</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {MONTH_NAMES[now.getMonth() + 1]} {now.getFullYear()} billing snapshot
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Active Renters" value={data.active_count} sub={`${data.total_concessionaires} total`} color="green" />
        <StatCard icon={DollarSign} label="Billed This Month" value={`₱${Number(data.total_billed).toLocaleString()}`} color="blue" />
        <StatCard icon={TrendingDown} label="Outstanding Balance" value={`₱${Number(data.total_outstanding).toLocaleString()}`} color="red" />
        <StatCard icon={AlertTriangle} label="Expired Contracts" value={data.expired_contracts} sub="Still Active status" color="yellow" />
      </div>

      {/* Expiring soon */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarClock size={18} className="text-orange-500" />
          <h2 className="text-sm font-semibold text-gray-700">Contracts Expiring Within 60 Days</h2>
        </div>
        {data.expiring_soon.length === 0 ? (
          <p className="text-sm text-gray-400">No contracts expiring soon.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="pb-2 text-left font-semibold">Name</th>
                <th className="pb-2 text-left font-semibold">Business</th>
                <th className="pb-2 text-left font-semibold">Contract End</th>
                <th className="pb-2 text-left font-semibold">Days Left</th>
              </tr>
            </thead>
            <tbody>
              {data.expiring_soon.map(c => (
                <tr
                  key={c.id}
                  className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/concessionaires/list/${c.id}`)}
                >
                  <td className="py-2 font-medium text-gray-700">{c.name}</td>
                  <td className="py-2 text-gray-500">{c.business_name}</td>
                  <td className="py-2 text-gray-500">{new Date(c.contract_end).toLocaleDateString()}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.days_left <= 14 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                    }`}>
                      {c.days_left}d
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}