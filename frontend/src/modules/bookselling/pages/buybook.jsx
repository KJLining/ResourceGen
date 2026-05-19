import { useCallback, useEffect, useState } from "react";
import SalesLog from "../components/tables/saleslog";
import AddSaleModal from "../components/modals/AddSaleModal";
import DeleteSaleModal from "../components/modals/DeleteSaleModal";
import Button from "../../../components/ui/button";
import SearchBar from "../../../components/ui/searchbar";
import Dropdown from "../../../components/ui/dropdown";
import { Plus } from "lucide-react";
import api from "../../../api";

const today = new Date().toISOString().split('T')[0];

const emptySale = {
    student_name: '', student_number: '',
    course: '', section: '',
    sale_date: today,
    professor_id: '', book_id: '',
    quantity: 1, amount_collected: '',
};

export default function BuyBook() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(emptySale);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterBy, setFilterBy] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const fetchSales = useCallback(() => {
        setLoading(true);
        api.get('/sales')
            .then(res => setSales(res.data))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    const openAdd = () => {
        setForm({ ...emptySale, sale_date: today });
        setError('');
        setModal('add');
    };

    const openEdit = (row) => {
        setSelected(row);
        setForm({
            student_name: row.student_name,
            student_number: row.student_number,
            course: row.course,
            section: row.section,
            sale_date: row.sale_date,
            professor_id: row.professor_id,
            book_id: row.book_id,
            quantity: row.quantity,
            amount_collected: row.amount_collected,
        });
        setError('');
        setModal('edit');
    };

    const openDelete = (row) => {
        setSelected(row);
        setError('');
        setModal('delete');
    };

    const closeModal = () => {
        setModal(null);
        setSelected(null);
        setError('');
    };

    const handleAdd = async () => {
        if (!form.student_name.trim()) { setError('Student name is required.'); return; }
        if (!form.student_number.trim()) { setError('Student number is required.'); return; }
        if (!form.course.trim()) { setError('Course is required.'); return; }
        if (!form.section.trim()) { setError('Section is required.'); return; }
        if (!form.professor_id) { setError('Professor is required.'); return; }
        if (!form.book_id) { setError('Book is required.'); return; }
        try {
            await api.post('/sales', form);
            fetchSales();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleEdit = async () => {
        if (!form.student_name.trim()) { setError('Student name is required.'); return; }
        try {
            await api.put(`/sales/${selected.id}`, form);
            fetchSales();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/sales/${selected.id}`);
            fetchSales();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    // Filter and sort
    const filtered = sales
        .filter(s => {
            const q = search.toLowerCase();
            const matchSearch = !q || [s.student_name, s.control_number?.toString(),
                s.professor_name, s.book_title, s.course]
                .some(f => f?.toLowerCase().includes(q));
            const matchDate = !dateFilter || s.sale_date === dateFilter;
            return matchSearch && matchDate;
        })
        .sort((a, b) => {
            if (sortBy === 'date_asc') return new Date(a.sale_date) - new Date(b.sale_date);
            if (sortBy === 'date_desc') return new Date(b.sale_date) - new Date(a.sale_date);
            if (sortBy === 'amount_asc') return a.amount_collected - b.amount_collected;
            if (sortBy === 'amount_desc') return b.amount_collected - a.amount_collected;
            if (sortBy === 'ctrl_asc') return a.control_number - b.control_number;
            if (sortBy === 'ctrl_desc') return b.control_number - a.control_number;
            return b.control_number - a.control_number; // default: newest first
        });

    const filterOptions = [
        { value: '', label: 'All' },
        { value: 'today', label: 'Today' },
        { value: 'this_month', label: 'This Month' },
    ];

    const sortOptions = [
        { value: 'ctrl_desc', label: 'Control # (Newest)' },
        { value: 'ctrl_asc', label: 'Control # (Oldest)' },
        { value: 'date_desc', label: 'Date (Newest)' },
        { value: 'date_asc', label: 'Date (Oldest)' },
        { value: 'amount_desc', label: 'Amount (High → Low)' },
        { value: 'amount_asc', label: 'Amount (Low → High)' },
    ];

    return (
        <>
            <h1 className="text-2xl font-bold text-center mb-5">
                Sales Log
            </h1>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <SearchBar
                    placeholder="Search..."
                    onSearch={val => setSearch(val)}
                    className="mb-0"
                />
                <Button variant="primary" className="inline-flex items-center" onClick={openAdd}>
                    <Plus className="w-4 h-4 mr-2" /> Add Sale
                </Button>
                <Dropdown
                    label=""
                    placeholder="Filter By"
                    options={filterOptions}
                    value={filterBy}
                    onChange={val => setFilterBy(val)}
                    width="w-40"
                />
                <Dropdown
                    label=""
                    placeholder="Sort By"
                    options={sortOptions}
                    value={sortBy}
                    onChange={val => setSortBy(val)}
                    width="w-48"
                />
                <input
                    type="date"
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    className="border rounded-xl px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            {loading
                ? <p className="text-neutral-500">Loading sales...</p>
                : <SalesLog data={filtered} onEdit={openEdit} onDelete={openDelete} />
            }

            {modal === 'add' && (
                <AddSaleModal form={form} setForm={setForm} error={error}
                    onClose={closeModal} onSave={handleAdd} />
            )}
            {modal === 'edit' && (
                <AddSaleModal form={form} setForm={setForm} error={error}
                    onClose={closeModal} onSave={handleEdit} />
            )}
            {modal === 'delete' && (
                <DeleteSaleModal selected={selected} error={error}
                    onClose={closeModal} onDelete={handleDelete} />
            )}
        </>
    );
}