import { useEffect, useState } from "react"
import axios from "axios"

import Button from "../../../components/ui/button"
import SearchBar from "../../../components/ui/searchbar"

import PrintingRequestTable from "../components/tables/printingrequesttable"
import AddPrintingModal from "../components/modals/addprintingmodal"

export default function PrintingRequests() {

    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(false)

    const [showAddModal, setShowAddModal] = useState(false)

    const fetchRequests = async (search = "") => {

        try {

            setLoading(true)

            const res = await axios.get(
                `http://localhost:5000/api/printing-services?search=${search}`
            )

            setRequests(res.data)

        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
    
        const loadData = async () => {
            await fetchRequests()
        }
    
        loadData()
    
    }, [])

    return (
        <div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Printing Services
                    </h1>

                    <p className="text-gray-500 text-sm">
                        Manage thesis and document binding requests
                    </p>
                </div>

                <Button
                    onClick={() => setShowAddModal(true)}
                >
                    Add Request
                </Button>

            </div>

            {/* Search */}
            <div className="mb-4">

                <SearchBar
                    placeholder="Search requests..."
                    onSearch={fetchRequests}
                />

            </div>

            {/* Table */}
            <PrintingRequestTable
                data={requests}
                loading={loading}
                refreshData={fetchRequests}
            />

            {/* Add Modal */}
            {showAddModal && (
                <AddPrintingModal
                    onClose={() => setShowAddModal(false)}
                    refreshData={fetchRequests}
                />
            )}

        </div>
    )
}