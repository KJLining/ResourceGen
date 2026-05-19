import Modal from "../../../../components/ui/modal";
import Button from "../../../../components/ui/button";

export default function DeleteBookModal({ selected, error, onClose, onDelete }) {
    return (
        <Modal title="Delete Book" onClose={onClose}>
            <p className="text-sm">
                Are you sure you want to delete <strong>{selected?.title}</strong>? This cannot be undone.
            </p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button variant="danger" onClick={onDelete}>Delete</Button>
            </div>
        </Modal>
    );
}