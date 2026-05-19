import { useEffect, useState } from "react";
import api from "../../../../api";

export default function DeliveryForm({ form, setForm, error }) {
    const [publishers, setPublishers] = useState([]);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        api.get('/publishers').then(res => setPublishers(res.data));
        api.get('/books').then(res => setBooks(res.data));
    }, []);

    return (
        <div className="space-y-3">
            {error && <p className="text-red-500 text-sm">{error}</p>}
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
            <div>
                <label className="block text-sm font-medium mb-1">Delivery Date <span className="text-red-500">*</span></label>
                <input type="date" value={form.delivery_date}
                    onChange={e => setForm({ ...form, delivery_date: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">DR / Reference No.</label>
                <input type="text" value={form.reference_no}
                    onChange={e => setForm({ ...form, reference_no: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. DR-2026-001" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Book <span className="text-red-500">*</span></label>
                <select value={form.book_id}
                    onChange={e => setForm({ ...form, book_id: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Select book...</option>
                    {books.map(b => (
                        <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Quantity <span className="text-red-500">*</span></label>
                    <input type="number" value={form.quantity}
                        onChange={e => setForm({ ...form, quantity: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0" min="1" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Wholesale Price (₱) <span className="text-red-500">*</span></label>
                    <input type="number" value={form.wholesale_price}
                        onChange={e => setForm({ ...form, wholesale_price: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0.00" min="0" step="0.01" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Optional notes..." rows={2} />
            </div>
        </div>
    );
}