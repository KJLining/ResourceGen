import { useEffect, useState } from "react";
import api from "../../../../api";
import Dropdown from "../../../../components/ui/dropdown";

export default function SaleForm({ form, setForm, error }) {
    const [professors, setProfessors] = useState([]);
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        api.get('/professors').then(res => setProfessors(res.data));
    }, []);

    useEffect(() => {
        if (form.professor_id) {
            api.get(`/sales/books-by-prof/${form.professor_id}`)
                .then(res => setBooks(res.data));
        } else {
            setBooks([]);
        }
        setForm(prev => ({ ...prev, book_id: '', amount_collected: '' }));
        setSelectedBook(null);
    }, [form.professor_id]);

    useEffect(() => {
        if (form.book_id && books.length > 0) {
            const book = books.find(b => b.id === Number(form.book_id));
            if (book) {
                setSelectedBook(book);
                setForm(prev => ({
                    ...prev,
                    amount_collected: (book.selling_price * (prev.quantity || 1)).toFixed(2)
                }));
            }
        }
    }, [form.book_id, books]);

    useEffect(() => {
        if (selectedBook) {
            setForm(prev => ({
                ...prev,
                amount_collected: (selectedBook.selling_price * (prev.quantity || 1)).toFixed(2)
            }));
        }
    }, [form.quantity]);

    const profOptions = professors.map(p => ({ value: p.id, label: p.name }));
    const bookOptions = books.map(b => ({ value: b.id, label: b.title }));

    return (
        <div className="space-y-3">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Student Name <span className="text-red-500">*</span></label>
                    <input type="text" value={form.student_name}
                        onChange={e => setForm({ ...form, student_name: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g. Juan dela Cruz" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Student Number <span className="text-red-500">*</span></label>
                    <input type="text" value={form.student_number}
                        onChange={e => setForm({ ...form, student_number: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g. 2023-00123" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Course <span className="text-red-500">*</span></label>
                    <input type="text" value={form.course}
                        onChange={e => setForm({ ...form, course: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g. BSIT" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Section <span className="text-red-500">*</span></label>
                    <input type="text" value={form.section}
                        onChange={e => setForm({ ...form, section: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g. 2A" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Sale Date <span className="text-red-500">*</span></label>
                <input type="date" value={form.sale_date}
                    onChange={e => setForm({ ...form, sale_date: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Professor <span className="text-red-500">*</span></label>
                <Dropdown
                    placeholder="Select professor..."
                    options={profOptions}
                    value={form.professor_id}
                    onChange={val => setForm({ ...form, professor_id: val })}
                    width="w-full"
                    label=""
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Book <span className="text-red-500">*</span></label>
                <Dropdown
                    placeholder={form.professor_id ? "Select book..." : "Select a professor first..."}
                    options={bookOptions}
                    value={form.book_id}
                    onChange={val => setForm({ ...form, book_id: val })}
                    width="w-full"
                    label=""
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <input type="number" value={form.quantity} min="1"
                        onChange={e => setForm({ ...form, quantity: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input type="text" value={form.amount_collected ? `₱ ${Number(form.amount_collected).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : ''}
                        readOnly
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-neutral-100 text-neutral-600 cursor-not-allowed" />
                </div>
            </div>
        </div>
    );
}