import axios from "axios"

import Modal from "../../../../components/ui/modal"
import Button from "../../../../components/ui/button"
import ModalActions from "../../../../components/ui/modalactions"

export default function DeletePrintingModal({
    request,
    onClose,
    refreshData,
}) {

    const handleDelete = async () => {

        try {

            await axios.delete(
                `http://localhost:5000/api/printing-services/${request.id}`
            )

            refreshData()
            onClose()

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Modal
            title="Delete Request"
            onClose={onClose}
        >

            <p className="text-gray-600">
                Are you sure you want to delete this request?
            </p>

            <p className="font-semibold mt-2">
                {request.title}
            </p>

            <ModalActions>

                <Button
                    variant="secondary"
                    onClick={onClose}
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
    )
}