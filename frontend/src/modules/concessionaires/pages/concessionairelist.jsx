import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import api from "../../../api";
import ConcessionaireFormModal from "../components/modals/concessionaireformmodal";
import DeleteConfirmModal from "../components/modals/deleteconcessionairemodal";

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-500",
  Terminated: "bg-red-100 text-red-600",
};

export default function ConcessionaireListPage() {
  const [concessionaires, setConcessionaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const fetchAll = () => {
    setLoading(true);
    api.get("/concessionaires")
      .then(r => setConcessionaires(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = concessionaires.filter(c =>
    `${c.name} ${c.business_name} ${c.type} ${c.unit_location}`
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Concessionaires</h1>
          <p className="text-sm text-gray-400">Manage all renters and their details</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Concessionaire
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, business, type, location..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                {["Name / Business", "Type", "Location", "Contract End", "Base Rent", "Outstanding", "Status", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">No concessionaires found.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.business_name}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{c.type}</td>
                  <td className="px-4 py-3 text-gray-600">{c.unit_location}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(c.contract_end).toLocaleDateString()}
                    {c.days_until_expiry < 0 && (
                      <span className="ml-1 text-xs text-red-500">(expired)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">₱{Number(c.base_rent).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={Number(c.outstanding_balance) > 0 ? "text-red-600 font-medium" : "text-gray-400"}>
                      ₱{Number(c.outstanding_balance).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/concessionaires/list/${c.id}`)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => { setEditing(c); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleting(c)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <ConcessionaireFormModal
          data={editing}
          onClose={() => setShowForm(false)}
          onSaved={fetchAll}
        />
      )}
      {deleting && (
        <DeleteConfirmModal
          concessionaire={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={fetchAll}
        />
      )}
    </div>
  );
}