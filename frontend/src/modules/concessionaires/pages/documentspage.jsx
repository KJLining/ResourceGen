import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

export default function DocumentsPage() {
  const [concessionaires, setConcessionaires] = useState([]);
  const [allDocs, setAllDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/concessionaires").then(async r => {
      const list = r.data;
      setConcessionaires(list);
      const docsArrays = await Promise.all(
        list.map(c => api.get(`/concessionaires/${c.id}/documents`).then(res => res.data.map(d => ({ ...d, concessionaire: c }))))
      );
      setAllDocs(docsArrays.flat().sort((a, b) => {
        if (!a.expiry_date) return 1;
        if (!b.expiry_date) return -1;
        return new Date(a.expiry_date) - new Date(b.expiry_date);
      }));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const docTypes = ["All", "Contract", "Promissory Letter", "Agreement", "Permit", "Receipt", "Other"];
  const filtered = allDocs.filter(d => filterType === "All" || d.document_type === filterType);

  const today = new Date();
  const in30 = new Date(Date.now() + 30 * 86400000);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Documents</h1>
        <p className="text-sm text-gray-400">All documents across concessionaires, sorted by expiry</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3">
        {docTypes.map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              filterType === t ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
              {["Concessionaire","Type","Title","Document Date","Expiry","Remarks"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No documents found.</td></tr>
            ) : filtered.map(d => {
              const expiry = d.expiry_date ? new Date(d.expiry_date) : null;
              const expired = expiry && expiry < today;
              const soonExpiring = expiry && !expired && expiry <= in30;
              return (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/concessionaires/list/${d.concessionaire.id}?tab=documents`)}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{d.concessionaire.name}</p>
                    <p className="text-xs text-gray-400">{d.concessionaire.business_name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">{d.document_type}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">{d.title}</td>
                  <td className="px-4 py-3 text-gray-500">{d.document_date ? new Date(d.document_date).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3">
                    {expiry ? (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        expired ? "bg-red-100 text-red-600" : soonExpiring ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"
                      }`}>
                        {expiry.toLocaleDateString()} {expired ? "· Expired" : soonExpiring ? "· Soon" : ""}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{d.remarks || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}