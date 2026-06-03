import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import api from "../../../../api";

export default function DeleteConcessionaireModal({ concessionaire, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/concessionaires/${concessionaire.id}`);
      onDeleted();
      onClose();
    } catch (e) {
      alert(e.response?.data?.error || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Delete Concessionaire</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X size={18} /></button>
        </div>
        <div className="p-6 text-sm text-gray-600">
          <p>Are you sure you want to delete <strong>{concessionaire.name}</strong> ({concessionaire.business_name})?</p>
          <p className="mt-2 text-red-500 text-xs">This will also delete all their bills and documents permanently.</p>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="flex items-center gap-2 text-sm px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors">
            <Trash2 size={14} /> {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}