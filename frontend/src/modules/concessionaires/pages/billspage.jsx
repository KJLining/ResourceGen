import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

const MONTHS = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PAYMENT_COLORS = {
  Paid: "bg-green-100 text-green-700",
  Partial: "bg-yellow-100 text-yellow-700",
  Unpaid: "bg-red-100 text-red-600",
};

export default function BillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/concessionaires/bills/all")
      .then(r => setBills(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = bills.filter(b => {
    if (filterStatus !== "All" && b.payment_status !== filterStatus) return false;
    if (filterYear && b.year !== Number(filterYear)) return false;
    if (filterMonth && b.month !== Number(filterMonth)) return false;
    return true;
  });

  const totalOutstanding = filtered.reduce((s, b) => {
    return b.payment_status !== "Paid" ? s + Number(b.total_amount) - Number(b.amount_paid) : s;
  }, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Bills & Payments</h1>
        <p className="text-sm text-gray-400">All billing records across all concessionaires</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300">
          {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300">
          <option value="">All Months</option>
          {MONTHS.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300">
          {["All", "Unpaid", "Partial", "Paid"].map(s => <option key={s}>{s}</option>)}
        </select>
        {filterStatus !== "All" && (
          <div className="ml-auto text-sm font-semibold text-red-600">
            Outstanding: ₱{totalOutstanding.toLocaleString()}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
              {["Concessionaire","Type","Period","Rent","Electric","Water","Other","Total","Paid","Status","Due"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={11} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={11} className="text-center py-8 text-gray-400">No records found.</td></tr>
            ) : filtered.map(b => (
              <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/concessionaires/list/${b.concessionaire_id}`)}>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{b.name}</p>
                  <p className="text-xs text-gray-400">{b.business_name}</p>
                </td>
                <td className="px-4 py-3 text-gray-500">{b.type}</td>
                <td className="px-4 py-3 font-medium">{MONTHS[b.month]} {b.year}</td>
                <td className="px-4 py-3">₱{Number(b.rent_amount).toLocaleString()}</td>
                <td className="px-4 py-3">₱{Number(b.electricity_amount).toLocaleString()}</td>
                <td className="px-4 py-3">₱{Number(b.water_amount).toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500">{Number(b.other_fees) > 0 ? `₱${Number(b.other_fees).toLocaleString()}` : "—"}</td>
                <td className="px-4 py-3 font-semibold">₱{Number(b.total_amount).toLocaleString()}</td>
                <td className="px-4 py-3 text-green-700">₱{Number(b.amount_paid).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PAYMENT_COLORS[b.payment_status]}`}>
                    {b.payment_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{b.due_date ? new Date(b.due_date).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}