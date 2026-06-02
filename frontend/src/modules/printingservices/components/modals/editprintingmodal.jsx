import { useState } from "react"
import axios from "axios"

import Modal from "../../../../components/ui/modal"
import Button from "../../../../components/ui/button"
import ModalActions from "../../../../components/ui/modalactions"
import Dropdown from "../../../../components/ui/dropdown"

import PrintingRequestForm from "../forms/printingrequestform"

export default function EditPrintingModal({
    request,
    onClose,
    refreshData,
}) {

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        ...request,
    })

    const statusOptions = [
        { label: "Received", value: "Received" },
        { label: "For Binding", value: "For Binding" },
        { label: "Ready for Pickup", value: "Ready for Pickup" },
        { label: "Claimed", value: "Claimed" },
        { label: "Cancelled", value: "Cancelled" },
    ]

    const handleUpdate = async () => {

        try {

            setLoading(true)

            await axios.put(
                `http://localhost:5000/api/printing-services/${request.id}`,
                formData
            )

            refreshData()
            onClose()

        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            title="Edit Printing Request"
            onClose={onClose}
        >

            <div className="space-y-4">

                <PrintingRequestForm
                    formData={formData}
                    setFormData={setFormData}
                />

                <Dropdown
                    label="Status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(value) =>
                        setFormData({
                            ...formData,
                            status: value,
                        })
                    }
                />

            </div>

            <ModalActions>

                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    onClick={handleUpdate}
                    isLoading={loading}
                >
                    Update
                </Button>

            </ModalActions>

        </Modal>
    )
}