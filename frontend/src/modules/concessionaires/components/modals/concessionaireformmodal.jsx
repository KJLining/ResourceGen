import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../../../../api";

const EMPTY = {
  name: "", business_name: "", type: "Canteen", unit_location: "",
  contact_no: "", email: "", contract_start: "", contract_end: "",
  base_rent: "", status: "Active", notes: "",
};

export default function ConcessionaireFormModal({ data, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!data;

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        contract_start: data.contract_start?.slice(0, 10) || "",
        contract_end: data.contract_end?.slice(0, 10) || "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [data]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.business_name || !form.unit_location || !form.contract_start || !form.contract_end || !form.base_rent) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) await api.put(`/concessionaires/${data.id}`, form);
      else await api.post("/concessionaires", form);
      onSaved();
      onClose();
    } catch (e) {
      setError(e.response?.data?.error || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, children, required }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );

  const inputClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{isEdit ? "Edit Concessionaire" : "Add Concessionaire"}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">
          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <input className={inputClass} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Juan Dela Cruz" />
            </Field>
            <Field label="Business Name" required>
              <input className={inputClass} value={form.business_name} onChange={e => set("business_name", e.target.value)} placeholder="JDC Canteen" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Type" required>
              <select className={inputClass} value={form.type} onChange={e => set("type", e.target.value)}>
                {["Canteen","Printing Shop","General Merchandise"].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Unit / Location" required>
              <input className={inputClass} value={form.unit_location} onChange={e => set("unit_location", e.target.value)} placeholder="Building A, Unit 1" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Contact No.">
              <input className={inputClass} value={form.contact_no} onChange={e => set("contact_no", e.target.value)} placeholder="09xxxxxxxxx" />
            </Field>
            <Field label="Email">
              <input className={inputClass} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="email@example.com" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Contract Start" required>
              <input className={inputClass} type="date" value={form.contract_start} onChange={e => set("contract_start", e.target.value)} />
            </Field>
            <Field label="Contract End" required>
              <input className={inputClass} type="date" value={form.contract_end} onChange={e => set("contract_end", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Base Rent (₱)" required>
              <input className={inputClass} type="number" min="0" step="0.01" value={form.base_rent} onChange={e => set("base_rent", e.target.value)} placeholder="0.00" />
            </Field>
            <Field label="Status" required>
              <select className={inputClass} value={form.status} onChange={e => set("status", e.target.value)}>
                {["Active","Inactive","Terminated"].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Notes">
            <textarea className={inputClass} rows={2} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Optional notes..." />
          </Field>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="text-sm px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors">
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Concessionaire"}
          </button>
        </div>
      </div>
    </div>
  );
}