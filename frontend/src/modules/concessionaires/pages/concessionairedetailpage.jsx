import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, FileText, ReceiptText, Building2 } from "lucide-react";
import api from "../../../api";
import BillFormModal from "../components/modals/billformmodal";
import DocumentFormModal from "../components/modals/documentformmodal";

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-500",
  Terminated: "bg-red-100 text-red-600",
};

const PAYMENT_COLORS = {
  Paid: "bg-green-100 text-green-700",
  Partial: "bg-yellow-100 text-yellow-700",
  Unpaid: "bg-red-100 text-red-600",
};

const MONTHS = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function ConcessionaireDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conc, setConc] = useState(null);
  const [bills, setBills] = useState([]);
  const [docs, setDocs] = useState([]);
  const [tab, setTab] = useState("bills");
  const [showBillForm, setShowBillForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [showDocForm, setShowDocForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const fetchConc = () => api.get(`/concessionaires/${id}`).then(r => setConc(r.data));
  const fetchBills = () => api.get(`/concessionaires/${id}/bills`).then(r => setBills(r.data));
  const fetchDocs = () => api.get(`/concessionaires/${id}/documents`).then(r => setDocs(r.data));

  useEffect(() => {
    fetchConc();
    fetchBills();
    fetchDocs();
  }, [id]);

  const deleteBill = async (billId) => {
    if (!confirm("Delete this bill?")) return;
    await api.delete(`/concessionaires/bills/${billId}`);
    fetchBills();
  };

  const deleteDoc = async (docId) => {
    if (!confirm("Delete this document record?")) return;
    await api.delete(`/concessionaires/documents/${docId}`);
    fetchDocs();
  };

  if (!conc) return <div className="text-sm text-gray-400 p-4">Loading...</div>;

  const totalBilled = bills.reduce((s, b) => s + Number(b.total_amount), 0);
  const totalPaid = bills.reduce((s, b) => s + Number(b.amount_paid), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => navigate(-1)} className="mt-1 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-800">{conc.name}</h1>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[conc.status]}`}>
              {conc.status}
            </span>
          </div>
          <p className="text-sm text-gray-400">{conc.business_name} · {conc.type} · {conc.unit_location}</p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Contact", value: conc.contact_no || "—" },
          { label: "Email", value: conc.email || "—" },
          { label: "Contract", value: `${new Date(conc.contract_start).toLocaleDateString()} – ${new Date(conc.contract_end).toLocaleDateString()}` },
          { label: "Base Rent", value: `₱${Number(conc.base_rent).toLocaleString()}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5 break-words">{value}</p>
          </div>
        ))}
      </div>

      {/* Billing summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Billed", value: `₱${totalBilled.toLocaleString()}`, color: "text-gray-800" },
          { label: "Total Collected", value: `₱${totalPaid.toLocaleString()}`, color: "text-green-700" },
          { label: "Outstanding", value: `₱${(totalBilled - totalPaid).toLocaleString()}`, color: (totalBilled - totalPaid) > 0 ? "text-red-600" : "text-gray-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-400">{label}</p>
            <p className={`text-xl font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-100">
          {[
            { key: "bills", icon: ReceiptText, label: "Bills & Payments" },
            { key: "documents", icon: FileText, label: "Documents" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? "border-green-600 text-green-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Bills tab */}
        {tab === "bills" && (
          <div className="p-4 space-y-3">
            <div className="flex justify-end">
              <button
                onClick={() => { setEditingBill(null); setShowBillForm(true); }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus size={15} /> Add Bill
              </button>
            </div>
            {bills.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No bills recorded yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                    {["Period","Rent","Electricity","Water","Other","Total","Paid","Status","Due",""].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bills.map(b => (
                    <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{MONTHS[b.month]} {b.year}</td>
                      <td className="px-3 py-2">₱{Number(b.rent_amount).toLocaleString()}</td>
                      <td className="px-3 py-2">₱{Number(b.electricity_amount).toLocaleString()}</td>
                      <td className="px-3 py-2">₱{Number(b.water_amount).toLocaleString()}</td>
                      <td className="px-3 py-2 text-gray-500">{b.other_fees_label ? `${b.other_fees_label}: ₱${Number(b.other_fees).toLocaleString()}` : "—"}</td>
                      <td className="px-3 py-2 font-semibold">₱{Number(b.total_amount).toLocaleString()}</td>
                      <td className="px-3 py-2 text-green-700">₱{Number(b.amount_paid).toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PAYMENT_COLORS[b.payment_status]}`}>
                          {b.payment_status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-500">{b.due_date ? new Date(b.due_date).toLocaleDateString() : "—"}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1.5">
                          <button onClick={() => { setEditingBill(b); setShowBillForm(true); }} className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => deleteBill(b.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Documents tab */}
        {tab === "documents" && (
          <div className="p-4 space-y-3">
            <div className="flex justify-end">
              <button
                onClick={() => { setEditingDoc(null); setShowDocForm(true); }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus size={15} /> Add Document
              </button>
            </div>
            {docs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No documents on file.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                    {["Type","Title","Document Date","Expiry","Remarks",""].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {docs.map(d => {
                    const isExpiring = d.expiry_date && new Date(d.expiry_date) <= new Date(Date.now() + 30 * 86400000);
                    const isExpired = d.expiry_date && new Date(d.expiry_date) < new Date();
                    return (
                      <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">{d.document_type}</span>
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-700">{d.title}</td>
                        <td className="px-3 py-2 text-gray-500">{d.document_date ? new Date(d.document_date).toLocaleDateString() : "—"}</td>
                        <td className="px-3 py-2">
                          {d.expiry_date ? (
                            <span className={`text-xs font-medium ${isExpired ? "text-red-600" : isExpiring ? "text-orange-500" : "text-gray-500"}`}>
                              {new Date(d.expiry_date).toLocaleDateString()}
                              {isExpired ? " (expired)" : isExpiring ? " (soon)" : ""}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-3 py-2 text-gray-500 max-w-[160px] truncate">{d.remarks || "—"}</td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1.5">
                            <button onClick={() => { setEditingDoc(d); setShowDocForm(true); }} className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                              <Pencil size={13} />
                            </button>
                            <button onClick={() => deleteDoc(d.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {showBillForm && (
        <BillFormModal
          concessionaireId={id}
          data={editingBill}
          baseRent={conc.base_rent}
          onClose={() => setShowBillForm(false)}
          onSaved={fetchBills}
        />
      )}
      {showDocForm && (
        <DocumentFormModal
          concessionaireId={id}
          data={editingDoc}
          onClose={() => setShowDocForm(false)}
          onSaved={fetchDocs}
        />
      )}
    </div>
  );
}