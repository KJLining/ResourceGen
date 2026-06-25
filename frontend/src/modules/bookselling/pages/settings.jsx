import { useCallback, useEffect, useState } from "react";
import Button from "../../../components/ui/button";
import SemesterList from "../components/tables/semesterlist";
import AddSemesterModal from "../components/modals/AddSemesterModal";
import EditSemesterModal from "../components/modals/EditSemesterModal";
import DeleteSemesterModal from "../components/modals/DeleteSemesterModal";
import { Plus } from "lucide-react";
import api from "../../../api";

const emptyForm = {
    label: '', semester: '', school_year: '',
    start_date: '', end_date: '',
};

export default function Settings() {
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState('');

    const activeSemester = semesters.find(s => s.is_active);

    const fetchSemesters = useCallback(() => {
        setLoading(true);
        api.get('/semesters')
            .then(res => setSemesters(res.data))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchSemesters();
    }, [fetchSemesters]);

    const openAdd = () => {
        setForm(emptyForm);
        setError('');
        setModal('add');
    };

    const openEdit = (row) => {
        setSelected(row);
        setForm({
            label: row.label,
            semester: row.semester,
            school_year: row.school_year,
            start_date: row.start_date,
            end_date: row.end_date,
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
        if (!form.label.trim()) { setError('Label is required.'); return; }
        if (!form.semester) { setError('Semester is required.'); return; }
        if (!form.school_year) { setError('School year is required.'); return; }
        if (!form.start_date) { setError('Start date is required.'); return; }
        if (!form.end_date) { setError('End date is required.'); return; }
        try {
            await api.post('/semesters', form);
            fetchSemesters();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleEdit = async () => {
        if (!form.label.trim()) { setError('Label is required.'); return; }
        try {
            await api.put(`/semesters/${selected.id}`, form);
            fetchSemesters();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/semesters/${selected.id}`);
            fetchSemesters();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleSetActive = async (row) => {
        try {
            await api.put(`/semesters/${row.id}/set-active`);
            fetchSemesters();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold text-center mb-5">Settings</h1>

            {/* Active semester banner */}
            <div className={`mb-5 p-4 rounded-lg flex items-center justify-between ${
                activeSemester
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-yellow-50 border border-yellow-200'
            }`}>
                <div>
                    <p className="text-sm font-medium text-neutral-700">Currently Active Semester</p>
                    <p className={`text-lg font-bold ${activeSemester ? 'text-green-700' : 'text-yellow-600'}`}>
                        {activeSemester ? activeSemester.label : 'No active semester set'}
                    </p>
                    {activeSemester && (
                        <p className="text-xs text-neutral-500 mt-1">
                            {activeSemester.start_date} → {activeSemester.end_date}
                        </p>
                    )}
                </div>
                {!activeSemester && (
                    <p className="text-xs text-yellow-600">
                        ⚠️ Sales won't be linked to a semester until one is set active.
                    </p>
                )}
            </div>

            {/* Semesters table */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Semesters</h2>
                <Button variant="primary" className="inline-flex items-center" onClick={openAdd}>
                    <Plus className="w-4 h-4 mr-2" /> Add Semester
                </Button>
            </div>

            {loading
                ? <p className="text-neutral-500">Loading...</p>
                : <SemesterList
                    data={semesters}
                    onEdit={openEdit}
                    onDelete={openDelete}
                    onSetActive={handleSetActive}
                />
            }

            {modal === 'add' && (
                <AddSemesterModal form={form} setForm={setForm} error={error}
                    onClose={closeModal} onSave={handleAdd} />
            )}
            {modal === 'edit' && (
                <EditSemesterModal form={form} setForm={setForm} error={error}
                    onClose={closeModal} onSave={handleEdit} />
            )}
            {modal === 'delete' && (
                <DeleteSemesterModal selected={selected} error={error}
                    onClose={closeModal} onDelete={handleDelete} />
            )}
        </>
    );
}