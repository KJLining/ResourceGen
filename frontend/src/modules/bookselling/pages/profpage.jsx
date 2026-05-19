import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"

import Button from "../../../components/ui/button"
import SearchBar from "../../../components/ui/searchbar"
import Dropdown from "../../../components/ui/dropdown"

import ProfList from "../components/tables/proflist"
import ProfForm from "../components/forms/profform"

import Modal from "../../../components/ui/modal"
import ModalActions from "../../../components/ui/modalactions"

import api from "../../../api"

export default function ProfPage() {
    const navigate = useNavigate()

    const [profs, setProfs] = useState([])
    const [loading, setLoading] = useState(true)

    const [sortBy, setSortBy] = useState("az")

    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)

    const [form, setForm] = useState({
        name: '',
        department: '',
        contact_number: ''
    })

    const [error, setError] = useState('')

    const fetchProfs = (search = '') => {
        setLoading(true)

        api.get(`/professors?search=${search}`)
            .then(res => {
                setProfs(res.data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }

    useEffect(() => {
        api.get('/professors')
            .then(res => setProfs(res.data))
            .finally(() => setLoading(false))
    }, [])

    // SORT OPTIONS
    const sortOptions = [
        { label: "Name (A-Z)", value: "az" },
        { label: "Name (Z-A)", value: "za" },
        { label: "Department (A-Z)", value: "dept-az" },
        { label: "Department (Z-A)", value: "dept-za" },
    ]

    // SORTED DATA
    const sortedProfs = useMemo(() => {
        const sorted = [...profs]

        switch (sortBy) {
            case "az":
                sorted.sort((a, b) =>
                    a.name.localeCompare(b.name)
                )
                break

            case "za":
                sorted.sort((a, b) =>
                    b.name.localeCompare(a.name)
                )
                break

            case "dept-az":
                sorted.sort((a, b) =>
                    (a.department || "").localeCompare(b.department || "")
                )
                break

            case "dept-za":
                sorted.sort((a, b) =>
                    (b.department || "").localeCompare(a.department || "")
                )
                break

            default:
                break
        }

        return sorted
    }, [profs, sortBy])

    const openAdd = () => {
        setForm({
            name: '',
            department: '',
            contact_number: ''
        })

        setError('')
        setModal('add')
    }

    const openEdit = (row) => {
        setSelected(row)

        setForm({
            name: row.name,
            department: row.department || '',
            contact_number: row.contact_number || ''
        })

        setError('')
        setModal('edit')
    }

    // VIEW PAGE NAVIGATION
    const openView = (row) => {
        navigate(`/admin/professors/${row.id}`)
    }

    const openDelete = (row) => {
        setSelected(row)
        setModal('delete')
    }

    const closeModal = () => {
        setModal(null)
        setSelected(null)
        setError('')
    }

    const handleAdd = async () => {
        if (!form.name.trim()) {
            setError('Professor name is required.')
            return
        }

        try {
            await api.post('/professors', form)
            fetchProfs()
            closeModal()
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.')
        }
    }

    const handleEdit = async () => {
        if (!form.name.trim()) {
            setError('Professor name is required.')
            return
        }

        try {
            await api.put(`/professors/${selected.id}`, form)
            fetchProfs()
            closeModal()
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.')
        }
    }

    const handleDelete = async () => {
        try {
            await api.delete(`/professors/${selected.id}`)
            fetchProfs()
            closeModal()
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.')
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-center">
                Professors List
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-4 mb-2">
                <SearchBar
                    placeholder="Search Professors..."
                    onSearch={(val) => fetchProfs(val)}
                    className="mb-4"
                />

                {/* SORT DROPDOWN */}
                <div className="mb-4">
                    <Dropdown
                        label=""
                        placeholder="Sort By"
                        options={sortOptions}
                        value={sortBy}
                        onChange={setSortBy}
                        width="w-52"
                    />
                </div>

                <Button
                    variant="primary"
                    className="inline-flex items-center mb-4"
                    onClick={openAdd}
                >
                    <Plus className="mr-2" />
                    Add Professor
                </Button>
            </div>

            {loading ? (
                <p className="text-neutral-500">
                    Loading professors...
                </p>
            ) : (
                <ProfList
                    data={sortedProfs}
                    onView={openView}
                    onEdit={openEdit}
                    onDelete={openDelete}
                />
            )}

            {/* ADD MODAL */}
            {modal === 'add' && (
                <Modal title="Add Professor" onClose={closeModal}>
                    <ProfForm
                        form={form}
                        setForm={setForm}
                        error={error}
                    />

                    <ModalActions>
                        <Button
                            variant="outline"
                            onClick={closeModal}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="primary"
                            onClick={handleAdd}
                        >
                            Save
                        </Button>
                    </ModalActions>
                </Modal>
            )}

            {/* EDIT MODAL */}
            {modal === 'edit' && (
                <Modal title="Edit Professor" onClose={closeModal}>
                    <ProfForm
                        form={form}
                        setForm={setForm}
                        error={error}
                    />

                    <ModalActions>
                        <Button
                            variant="outline"
                            onClick={closeModal}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="primary"
                            onClick={handleEdit}
                        >
                            Save Changes
                        </Button>
                    </ModalActions>
                </Modal>
            )}

            {/* DELETE MODAL */}
            {modal === 'delete' && selected && (
                <Modal title="Delete Professor" onClose={closeModal}>
                    <p className="text-sm">
                        Are you sure you want to delete{" "}
                        <strong>{selected.name}</strong>?
                        This cannot be undone.
                    </p>

                    {error && (
                        <p className="text-red-500 text-sm mt-2">
                            {error}
                        </p>
                    )}

                    <ModalActions>
                        <Button
                            variant="outline"
                            onClick={closeModal}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="danger"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </ModalActions>
                </Modal>
            )}
        </>
    )
}