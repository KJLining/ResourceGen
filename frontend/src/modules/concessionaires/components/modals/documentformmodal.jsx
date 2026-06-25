import { useState, useEffect, useRef } from "react";
import { X, Paperclip, FileX } from "lucide-react";
import api from "../../../../api";

const EMPTY = {
  document_type: "Contract", title: "", description: "",
  document_date: "", expiry_date: "", remarks: "",
};

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

export default function DocumentFormModal({ concessionaireId, data, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const isEdit = !!data;

  useEffect(() => {
    if (data) {
      setForm({
        document_type: data.document_type || "Contract",
        title: data.title || "",
        description: data.description || "",
        document_date: data.document_date?.slice(0, 10) || "",
        expiry_date: data.expiry_date?.slice(0, 10) || "",
        remarks: data.remarks || "",
      });
    } else {
      setForm(EMPTY);
    }
    setFile(null);
  }, [data]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!form.title || !form.document_type) {
      setError("Title and type are required.");
      return;
    }
    setSaving(true);
    try {
      // Use FormData so we can send both fields and the file
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (file) formData.append("file", file);

      if (isEdit) {
        await api.put(`/concessionaires/documents/${data.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post(`/concessionaires/${concessionaireId}/documents`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
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

          <Field label="Remarks">
            <textarea className={inputClass} rows={2} value={form.remarks} onChange={e => set("remarks", e.target.value)} placeholder="Optional remarks..." />
          </Field>

          {/* File upload */}
          <Field label="Attach File">
            <div
              className="border-2 border-dashed border-gray-200 rounded-lg px-4 py-5 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                onChange={handleFileChange}
              />
              {file ? (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-green-700">
                    <Paperclip size={15} />
                    <span className="font-medium truncate max-w-[260px]">{file.name}</span>
                    <span className="text-gray-400">({(file.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); clearFile(); }}
                    className="p-1 text-gray-400 hover:text-red-500 rounded"
                  >
                    <FileX size={15} />
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-400 space-y-1">
                  <Paperclip size={20} className="mx-auto text-gray-300" />
                  {isEdit && data?.file_name ? (
                    <>
                      <p className="text-green-700 font-medium">{data.file_name}</p>
                      <p>Click to replace the file</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-gray-500">Click to upload a file</p>
                      <p>PDF, Word, Excel, or image — max 10MB</p>
                    </>
                  )}
                </div>
              )}
            </div>
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