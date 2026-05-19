import { useEffect, useState } from "react";
import PublisherList from "../components/tables/publisherlist";
import Button from "../../../components/ui/button";
import SearchBar from "../../../components/ui/searchbar";
import AddPublisherModal from "../components/modals/AddPublisherModal";
import EditPublisherModal from "../components/modals/EditPublisherModal";
import DeletePublisherModal from "../components/modals/DeletePublisherModal";
import { Plus } from "lucide-react";
import api from "../../../api";

const emptyForm = { name: '', contact_person: '', phone: '', email: '', address: '' };

export default function PublisherPage() {
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPublishers();
    }, []);

    const fetchPublishers = (search = '') => {
        setLoading(true);
        api.get(`/publishers?search=${search}`)
            .then(res => setPublishers(res.data))
            .finally(() => setLoading(false));
    };

    const openAdd = () => {
        setForm(emptyForm);
        setError('');
        setModal('add');
    };

    const openEdit = (row) => {
        setSelected(row);
        setForm({
            name: row.name || '',
            contact_person: row.contact_person || '',
            phone: row.phone || '',
            email: row.email || '',
            address: row.address || '',
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
        if (!form.name.trim()) { setError('Publisher name is required.'); return; }
        try {
            await api.post('/publishers', form);
            fetchPublishers();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleEdit = async () => {
        if (!form.name.trim()) { setError('Publisher name is required.'); return; }
        try {
            await api.put(`/publishers/${selected.id}`, form);
            fetchPublishers();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/publishers/${selected.id}`);
            fetchPublishers();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold text-center mb-5">Publishers List</h1>

            <div className="flex justify-between items-center mb-4">
                <SearchBar
                    placeholder="Search publishers..."
                    onSearch={(val) => fetchPublishers(val)}
                />
                <Button variant="primary" className="inline-flex items-center" onClick={openAdd}>
                    <Plus className="w-4 h-4 mr-2" /> Add Publisher
                </Button>
            </div>

            {loading
                ? <p className="text-neutral-500">Loading publishers...</p>
                : <PublisherList data={publishers} onEdit={openEdit} onDelete={openDelete} />
            }

            {modal === 'add' && (
                <AddPublisherModal form={form} setForm={setForm} error={error} onClose={closeModal} onSave={handleAdd} />
            )}
            {modal === 'edit' && (
                <EditPublisherModal form={form} setForm={setForm} error={error} onClose={closeModal} onSave={handleEdit} />
            )}
            {modal === 'delete' && (
                <DeletePublisherModal selected={selected} error={error} onClose={closeModal} onDelete={handleDelete} />
            )}
        </>
    );
}