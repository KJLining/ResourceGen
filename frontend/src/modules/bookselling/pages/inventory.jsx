import { useEffect, useState, useCallback } from "react";
import InventoryList from "../components/tables/inventorylist";
import DeliveryList from "../components/tables/deliverylist";
import Button from "../../../components/ui/button";
import SearchBar from "../../../components/ui/searchbar";
import AddBookModal from "../components/modals/AddBookModal";
import EditBookModal from "../components/modals/EditBookModal";
import DeleteBookModal from "../components/modals/DeleteBookModal";
import AddDeliveryModal from "../components/modals/AddDeliveryModal";
import { Plus, Truck } from "lucide-react";
import api from "../../../api";

const emptyBook = {
    title: '', isbn: '', publisher_id: '',
    selling_price: '', wholesale_price: '',
    professor_commission: '', school_commission: '',
    professor_ids: []
};

const emptyDelivery = {
    publisher_id: '', delivery_date: '',
    reference_no: '', book_id: '',
    quantity: '', wholesale_price: '', notes: ''
};

export default function Inventory() {
    const [tab, setTab] = useState('books');
    const [books, setBooks] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [bookForm, setBookForm] = useState(emptyBook);
    const [deliveryForm, setDeliveryForm] = useState(emptyDelivery);
    const [error, setError] = useState('');
    const fetchBooks = useCallback((search = '') => {
        setLoading(true);
        api.get(`/books?search=${search}`)
            .then(res => setBooks(res.data))
            .finally(() => setLoading(false));
    }, []);

    const fetchDeliveries = useCallback(() => {
        api.get('/deliveries')
            .then(res => setDeliveries(res.data));
    }, []);

    useEffect(() => {
        fetchBooks();
        fetchDeliveries();
    }, [fetchBooks, fetchDeliveries]);
    
    useEffect(() => {
        setLoading(true);
        api.get('/books')
            .then(res => setBooks(res.data))
            .finally(() => setLoading(false));
    
        api.get('/deliveries')
            .then(res => setDeliveries(res.data));
    }, []);


    const openAddBook = () => {
        setBookForm(emptyBook);
        setError('');
        setModal('addBook');
    };

    const openEditBook = (row) => {
        setSelected(row);
        setBookForm({
            title: row.title || '',
            isbn: row.isbn || '',
            publisher_id: row.publisher_id || '',
            selling_price: row.selling_price || '',
            wholesale_price: row.wholesale_price || '',
            professor_commission: row.professor_commission || '',
            school_commission: row.school_commission || '',
            professor_ids: row.professor_ids || [],
        });
        setError('');
        setModal('editBook');
    };

    const openDeleteBook = (row) => {
        setSelected(row);
        setError('');
        setModal('deleteBook');
    };

    const openAddDelivery = () => {
        setDeliveryForm(emptyDelivery);
        setError('');
        setModal('addDelivery');
    };

    const closeModal = () => {
        setModal(null);
        setSelected(null);
        setError('');
    };

    const handleAddBook = async () => {
        if (!bookForm.title.trim()) { setError('Book title is required.'); return; }
        if (!bookForm.publisher_id) { setError('Publisher is required.'); return; }
        if (!bookForm.selling_price) { setError('Selling price is required.'); return; }
        try {
            await api.post('/books', bookForm);
            fetchBooks();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleEditBook = async () => {
        if (!bookForm.title.trim()) { setError('Book title is required.'); return; }
        try {
            await api.put(`/books/${selected.id}`, bookForm);
            fetchBooks();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleDeleteBook = async () => {
        try {
            await api.delete(`/books/${selected.id}`);
            fetchBooks();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleAddDelivery = async () => {
        if (!deliveryForm.publisher_id) { setError('Publisher is required.'); return; }
        if (!deliveryForm.delivery_date) { setError('Delivery date is required.'); return; }
        if (!deliveryForm.book_id) { setError('Book is required.'); return; }
        if (!deliveryForm.quantity || deliveryForm.quantity < 1) { setError('Quantity must be at least 1.'); return; }
        try {
            await api.post('/deliveries', deliveryForm);
            fetchBooks();
            fetchDeliveries();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold text-center mb-5">Inventory</h1>

            {/* Tabs */}
            <div className="flex border-b mb-4">
                <button
                    onClick={() => setTab('books')}
                    className={`px-6 py-2 text-sm font-medium border-b-2 transition ${
                        tab === 'books'
                            ? 'border-green-600 text-green-700'
                            : 'border-transparent text-neutral-500 hover:text-green-600'
                    }`}
                >
                    Books
                </button>
                <button
                    onClick={() => setTab('deliveries')}
                    className={`px-6 py-2 text-sm font-medium border-b-2 transition ${
                        tab === 'deliveries'
                            ? 'border-green-600 text-green-700'
                            : 'border-transparent text-neutral-500 hover:text-green-600'
                    }`}
                >
                    Deliveries
                </button>
            </div>

            {/* Books Tab */}
            {tab === 'books' && (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <SearchBar
                            placeholder="Search books..."
                            onSearch={(val) => fetchBooks(val)}
                        />
                        <Button variant="primary" className="inline-flex items-center" onClick={openAddBook}>
                            <Plus className="w-4 h-4 mr-2" /> Add Book
                        </Button>
                    </div>
                    {loading
                        ? <p className="text-neutral-500">Loading books...</p>
                        : <InventoryList data={books} onEdit={openEditBook} onDelete={openDeleteBook} />
                    }
                </>
            )}

            {/* Deliveries Tab */}
            {tab === 'deliveries' && (
                <>
                    <div className="flex justify-end mb-4">
                        <Button variant="primary" className="inline-flex items-center" onClick={openAddDelivery}>
                            <Truck className="w-4 h-4 mr-2" /> Record Delivery
                        </Button>
                    </div>
                    <DeliveryList data={deliveries} />
                </>
            )}

            {modal === 'addBook' && (
                <AddBookModal form={bookForm} setForm={setBookForm} error={error} onClose={closeModal} onSave={handleAddBook} />
            )}
            {modal === 'editBook' && (
                <EditBookModal form={bookForm} setForm={setBookForm} error={error} onClose={closeModal} onSave={handleEditBook} />
            )}
            {modal === 'deleteBook' && (
                <DeleteBookModal selected={selected} error={error} onClose={closeModal} onDelete={handleDeleteBook} />
            )}
            {modal === 'addDelivery' && (
                <AddDeliveryModal form={deliveryForm} setForm={setDeliveryForm} error={error} onClose={closeModal} onSave={handleAddDelivery} />
            )}
        </>
    );
}