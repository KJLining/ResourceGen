import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../../../../api";

const now = new Date();
const EMPTY = {
  year: now.getFullYear(), month: now.getMonth() + 1,
  rent_amount: "", electricity_amount: "", water_amount: "",
  other_fees: "", other_fees_label: "", payment_status: "Unpaid",
  amount_paid: "", due_date: "", paid_date: "", notes: "",
};

const MONTHS = ["","January","February","March","April","May","June","July","August","September","October","November","December"];

const inputClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300";

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function BillFormModal({ concessionaireId, data, baseRent, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!data;

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        due_date: data.due_date?.slice(0, 10) || "",
        paid_date: data.paid_date?.slice(0, 10) || "",
      });
    } else {
      setForm({ ...EMPTY, rent_amount: baseRent || "" });
    }
  }, [data, baseRent]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const total =
    (Number(form.rent_amount) || 0) +
    (Number(form.electricity_amount) || 0) +
    (Number(form.water_amount) || 0) +
    (Number(form.other_fees) || 0);

  const handleSubmit = async () => {
    if (!form.year || !form.month || !form.rent_amount) {
      setError("Year, month, and rent amount are required.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) await api.put(`/concessionaires/bills/${data.id}`, form);
      else await api.post(`/concessionaires/${concessionaireId}/bills`, form);
      onSaved();
      onClose();
    } catch (e) {
      setError(e.response?.data?.error || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{isEdit ? "Edit Bill" : "Add Bill"}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">
          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Year" required>
              <input className={inputClass} type="number" value={form.year} onChange={e => set("year", e.target.value)} />
            </Field>
            <Field label="Month" required>
              <select className={inputClass} value={form.month} onChange={e => set("month", e.target.value)}>
                {MONTHS.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Rent (₱)" required>
              <input className={inputClass} type="number" min="0" step="0.01" value={form.rent_amount} onChange={e => set("rent_amount", e.target.value)} />
            </Field>
            <Field label="Electricity (₱)">
              <input className={inputClass} type="number" min="0" step="0.01" value={form.electricity_amount} onChange={e => set("electricity_amount", e.target.value)} placeholder="0.00" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Water (₱)">
              <input className={inputClass} type="number" min="0" step="0.01" value={form.water_amount} onChange={e => set("water_amount", e.target.value)} placeholder="0.00" />
            </Field>
            <Field label="Other Fees (₱)">
              <input className={inputClass} type="number" min="0" step="0.01" value={form.other_fees} onChange={e => set("other_fees", e.target.value)} placeholder="0.00" />
            </Field>
          </div>

          <Field label="Other Fees Label">
            <input className={inputClass} value={form.other_fees_label} onChange={e => set("other_fees_label", e.target.value)} placeholder="e.g. Garbage fee" />
          </Field>

          <div className="bg-gray-50 rounded-lg px-4 py-3 flex justify-between text-sm">
            <span className="text-gray-500">Computed Total</span>
            <span className="font-bold text-gray-800">₱{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Payment Status">
              <select className={inputClass} value={form.payment_status} onChange={e => set("payment_status", e.target.value)}>
                {["Unpaid","Partial","Paid"].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Amount Paid (₱)">
              <input className={inputClass} type="number" min="0" step="0.01" value={form.amount_paid} onChange={e => set("amount_paid", e.target.value)} placeholder="0.00" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Due Date">
              <input className={inputClass} type="date" value={form.due_date} onChange={e => set("due_date", e.target.value)} />
            </Field>
            <Field label="Date Paid">
              <input className={inputClass} type="date" value={form.paid_date} onChange={e => set("paid_date", e.target.value)} />
            </Field>
          </div>

          <Field label="Notes">
            <textarea className={inputClass} rows={2} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Optional notes..." />
          </Field>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="text-sm px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors">
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Bill"}
          </button>
        </div>
      </div>
    </div>
  );
}