import { useState } from "react"

import Table from "../../../../components/ui/table"
import Button from "../../../../components/ui/button"

import EditPrintingModal from "../modals/editprintingmodal"
import DeletePrintingModal from "../modals/deleteprintingmodal"

export default function PrintingRequestTable({
    data,
    refreshData,
    hideActions = false,
}) {

    const [selectedRequest, setSelectedRequest] = useState(null)

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const columns = [

        {
            header: "Control No",
            accessor: "control_no",
        },

        {
            header: "Course",
            accessor: "course",
        },

        {
            header: "Type",
            accessor: "document_type",
        },

        {
            header: "Title",
            accessor: "title",
        },

        {
            header: "Members",
            accessor: "members",
        },

        {
            header: "Hardbound",
            accessor: "hardbound_qty",
        },

        {
            header: "Softbound",
            accessor: "softbound_qty",
        },

        {
            header: "Amount",
            render: (row) => `₱${Number(row.total_amount).toLocaleString()}`,
        },

        {
            header: "Status",
            render: (row) => {

                const colors = {
                    Received: "bg-blue-100 text-blue-700",
                    "For Binding": "bg-purple-100 text-purple-700",
                    "Ready for Pickup": "bg-green-100 text-green-700",
                    Claimed: "bg-gray-200 text-gray-700",
                    Cancelled: "bg-red-100 text-red-700",
                }
                return (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[row.status]}`}
                    >
                        {row.status}
                    </span>
                )
            },
        },
    ]
    return (
        <>

            <Table
                columns={columns}
                data={data}
                size="md"
                width="full"
                renderActions={hideActions ? null : (row) => (
                    <div className="flex gap-2">

                        <Button
                            variant="outline"
                            className="text-xs"
                            onClick={() => {
                                setSelectedRequest(row)
                                setShowEditModal(true)
                            }}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="danger"
                            className="text-xs"
                            onClick={() => {
                                setSelectedRequest(row)
                                setShowDeleteModal(true)
                            }}
                        >
                            Delete
                        </Button>

                    </div>
                )}
            />

            {showEditModal && selectedRequest && (
                <EditPrintingModal
                    request={selectedRequest}
                    onClose={() => {
                        setShowEditModal(false)
                        setSelectedRequest(null)
                    }}
                    refreshData={refreshData}
                />
            )}

            {showDeleteModal && selectedRequest && (
                <DeletePrintingModal
                    request={selectedRequest}
                    onClose={() => {
                        setShowDeleteModal(false)
                        setSelectedRequest(null)
                    }}
                    refreshData={refreshData}
                />
            )}

        </>
    )
}