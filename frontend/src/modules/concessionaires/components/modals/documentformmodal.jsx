import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../../../../api";

const EMPTY = {
  document_type: "Contract", title: "", description: "",
  file_path: "", file_name: "", document_date: "", expiry_date: "", remarks: "",
};

export default function DocumentFormModal({ concessionaireId, data, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!data;

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        document_date: data.document_date?.slice(0, 10) || "",
        expiry_date: data.expiry_date?.slice(0, 10) || "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [data]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title || !form.document_type) {
      setError("Title and type are required.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) await api.put(`/concessionaires/documents/${data.id}`, form);
      else await api.post(`/concessionaires/${concessionaireId}/documents`, form);
      onSaved();
      onClose();
    } catch (e) {
      setError(e.response?.data?.error || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300";
  const Field = ({ label, children, required }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{isEdit ? "Edit Document" : "Add Document"}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">
          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Document Type" required>
              <select className={inputClass} value={form.document_type} onChange={e => set("document_type", e.target.value)}>
                {["Contract","Promissory Letter","Agreement","Permit","Receipt","Other"].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Title" required>
              <input className={inputClass} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Business Permit 2026" />
            </Field>
          </div>

          <Field label="Description">
            <textarea className={inputClass} rows={2} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Brief description..." />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Document Date">
              <input className={inputClass} type="date" value={form.document_date} onChange={e => set("document_date", e.target.value)} />
            </Field>
            <Field label="Expiry Date">
              <input className={inputClass} type="date" value={form.expiry_date} onChange={e => set("expiry_date", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="File Name">
              <input className={inputClass} value={form.file_name} onChange={e => set("file_name", e.target.value)} placeholder="document.pdf" />
            </Field>
            <Field label="File Path / URL">
              <input className={inputClass} value={form.file_path} onChange={e => set("file_path", e.target.value)} placeholder="/uploads/... or URL" />
            </Field>
          </div>

          <Field label="Remarks">
            <textarea className={inputClass} rows={2} value={form.remarks} onChange={e => set("remarks", e.target.value)} placeholder="Optional remarks..." />
          </Field>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="text-sm px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors">
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Document"}
          </button>
        </div>
      </div>
    </div>
  );
}