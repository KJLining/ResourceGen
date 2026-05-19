import { useEffect, useState } from "react";
import api from "../../../../api";

export default function BookForm({ form, setForm, error }) {
    const [publishers, setPublishers] = useState([]);
    const [professors, setProfessors] = useState([]);

    useEffect(() => {
        api.get('/publishers').then(res => setPublishers(res.data));
        api.get('/professors').then(res => setProfessors(res.data));
    }, []);

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
                <select value={form.publisher_id}
                    onChange={e => setForm({ ...form, publisher_id: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Select publisher...</option>
                    {publishers.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
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
                <label className="block text-sm font-medium mb-1">Prescribed by Professors</label>
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
    );
}