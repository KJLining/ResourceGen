import { useState } from "react"
import axios from "axios"

import Modal from "../../../../components/ui/modal"
import Button from "../../../../components/ui/button"
import ModalActions from "../../../../components/ui/modalactions"

import PrintingRequestForm from "../forms/printingrequestform"

export default function AddPrintingModal({
    onClose,
    refreshData,
}) {

    const [loading, setLoading] = useState(false)

const generatedControlNo =
    `PR-${new Date().getTime()}`

const [formData, setFormData] = useState({

    control_no: generatedControlNo,

        course: "",
        document_type: "",
        title: "",
        members: "",

        date_received: new Date()
            .toISOString()
            .split("T")[0],

        hardbound_qty: 0,
        softbound_qty: 0,

        total_amount: 0,

        remarks: "",
    })

    const handleSubmit = async () => {

        try {

            setLoading(true)

            await axios.post(
                "http://localhost:5000/api/printing-services",
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
            title="Add Printing Request"
            onClose={onClose}
        >

            <PrintingRequestForm
                formData={formData}
                setFormData={setFormData}
            />

            <ModalActions>

                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    onClick={handleSubmit}
                    isLoading={loading}
                >
                    Save
                </Button>

            </ModalActions>

        </Modal>
    )
}