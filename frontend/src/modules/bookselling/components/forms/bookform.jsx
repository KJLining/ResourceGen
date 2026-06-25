import { useEffect, useState } from "react";
import api from "../../../../api";
import PublisherForm from "./PublisherForm";
import ProfForm from "./ProfForm";

const EMPTY_PUBLISHER_FORM = {
    name: "", contact_person: "", phone: "", email: "", address: ""
};

const EMPTY_PROFESSOR_FORM = {
    name: "", department: "", contact_number: ""
};

export default function BookForm({ form, setForm, error }) {
    const [publishers, setPublishers] = useState([]);
    const [professors, setProfessors] = useState([]);

    const [showPublisherModal, setShowPublisherModal] = useState(false);
    const [publisherForm, setPublisherForm] = useState(EMPTY_PUBLISHER_FORM);
    const [publisherError, setPublisherError] = useState("");
    const [publisherSaving, setPublisherSaving] = useState(false);

    const [showProfessorModal, setShowProfessorModal] = useState(false);
    const [professorForm, setProfessorForm] = useState(EMPTY_PROFESSOR_FORM);
    const [professorError, setProfessorError] = useState("");
    const [professorSaving, setProfessorSaving] = useState(false);

    useEffect(() => {
        api.get('/publishers').then(res => setPublishers(res.data));
        api.get('/professors').then(res => setProfessors(res.data));
    }, []);

    const handlePublisherSelectChange = (e) => {
        if (e.target.value === "__add_new__") {
            setPublisherForm(EMPTY_PUBLISHER_FORM);
            setPublisherError("");
            setShowPublisherModal(true);
        } else {
            setForm({ ...form, publisher_id: e.target.value });
        }
    };

    const handlePublisherSave = async () => {
        if (!publisherForm.name.trim()) {
            setPublisherError("Publisher name is required.");
            return;
        }
        setPublisherSaving(true);
        setPublisherError("");
        try {
            const res = await api.post('/publishers', publisherForm);
            const newPublisher = res.data;
            setPublishers(prev => [...prev, newPublisher]);
            setForm({ ...form, publisher_id: String(newPublisher.id) });
            setShowPublisherModal(false);
        } catch (err) {
            setPublisherError(
                err?.response?.data?.message || "Failed to save publisher."
            );
        } finally {
            setPublisherSaving(false);
        }
    };

    const handleProfessorSave = async () => {
        if (!professorForm.name.trim()) {
            setProfessorError("Professor name is required.");
            return;
        }
        setProfessorSaving(true);
        setProfessorError("");
        try {
            const res = await api.post('/professors', professorForm);
            const newProfessor = res.data;
            setProfessors(prev => [...prev, newProfessor]);
            setForm({
                ...form,
                professor_ids: [...(form.professor_ids || []), newProfessor.id]
            });
            setShowProfessorModal(false);
        } catch (err) {
            setProfessorError(
                err?.response?.data?.message || "Failed to save professor."
            );
        } finally {
            setProfessorSaving(false);
        }
    };

    const toggleProf = (id) => {
        const current = form.professor_ids || [];
        setForm({
            ...form,
            professor_ids: current.includes(id)
                ? current.filter(p => p !== id)
                : [...current, id]
        });
    };

    return (
        <>
            <div className="space-y-3">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div>
                    <label className="block text-sm font-medium mb-1">Book Title <span className="text-red-500">*</span></label>
                    <input type="text" value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g. Engineering Mathematics" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">ISBN</label>
                    <input type="text" value={form.isbn}
                        onChange={e => setForm({ ...form, isbn: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g. 978-971-23-4567-8" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Publisher <span className="text-red-500">*</span></label>
                    <select
                        value={form.publisher_id}
                        onChange={handlePublisherSelectChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">Select publisher...</option>
                        {publishers.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                        <option value="__add_new__">➕ Add Publisher</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Selling Price (₱) <span className="text-red-500">*</span></label>
                        <input type="number" value={form.selling_price}
                            onChange={e => setForm({ ...form, selling_price: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="0.00" min="0" step="0.01" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Wholesale Price (₱) <span className="text-red-500">*</span></label>
                        <input type="number" value={form.wholesale_price}
                            onChange={e => setForm({ ...form, wholesale_price: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="0.00" min="0" step="0.01" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Prof. Commission (₱) <span className="text-red-500">*</span></label>
                        <input type="number" value={form.professor_commission}
                            onChange={e => setForm({ ...form, professor_commission: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g. 40" min="0" step="0.01" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">School Commission (%) <span className="text-red-500">*</span></label>
                        <input type="number" value={form.school_commission}
                            onChange={e => setForm({ ...form, school_commission: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g. 15" min="0" max="100" step="0.01" />
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium">Prescribed by Professors</label>
                        <button
                            type="button"
                            onClick={() => {
                                setProfessorForm(EMPTY_PROFESSOR_FORM);
                                setProfessorError("");
                                setShowProfessorModal(true);
                            }}
                            className="text-xs text-green-600 hover:text-green-700 font-medium"
                        >
                            ➕ Add Professor
                        </button>
                    </div>
                    <div className="border rounded-lg p-2 max-h-32 overflow-y-auto space-y-1">
                        {professors.length === 0
                            ? <p className="text-xs text-neutral-400">No professors found.</p>
                            : professors.map(p => (
                                <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox"
                                        checked={(form.professor_ids || []).includes(p.id)}
                                        onChange={() => toggleProf(p.id)}
                                        className="accent-green-600" />
                                    {p.name} {p.department ? `(${p.department})` : ''}
                                </label>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Add Publisher Modal */}
            {showPublisherModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <h2 className="text-base font-semibold">Add Publisher</h2>
                            <button
                                onClick={() => setShowPublisherModal(false)}
                                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="px-5 py-4">
                            <PublisherForm
                                form={publisherForm}
                                setForm={setPublisherForm}
                                error={publisherError}
                            />
                        </div>
                        <div className="flex justify-end gap-2 px-5 py-4 border-t bg-neutral-50">
                            <button
                                onClick={() => setShowPublisherModal(false)}
                                className="px-4 py-2 text-sm rounded-lg border hover:bg-neutral-100"
                                disabled={publisherSaving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePublisherSave}
                                disabled={publisherSaving}
                                className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                {publisherSaving ? "Saving..." : "Save Publisher"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Professor Modal */}
            {showProfessorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <h2 className="text-base font-semibold">Add Professor</h2>
                            <button
                                onClick={() => setShowProfessorModal(false)}
                                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="px-5 py-4">
                            <ProfForm
                                form={professorForm}
                                setForm={setProfessorForm}
                                error={professorError}
                            />
                        </div>
                        <div className="flex justify-end gap-2 px-5 py-4 border-t bg-neutral-50">
                            <button
                                onClick={() => setShowProfessorModal(false)}
                                className="px-4 py-2 text-sm rounded-lg border hover:bg-neutral-100"
                                disabled={professorSaving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProfessorSave}
                                disabled={professorSaving}
                                className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                {professorSaving ? "Saving..." : "Save Professor"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}