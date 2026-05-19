import Modal from "../../../../components/ui/modal";
import Button from "../../../../components/ui/button";

export default function DeleteSaleModal({ selected, error, onClose, onDelete }) {
    return (
        <Modal title="Remove Sale" onClose={onClose}>
            <p className="text-sm">
                Are you sure you want to remove sale <strong>#{selected?.control_number}</strong> for <strong>{selected?.student_name}</strong>? This cannot be undone.
            </p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button variant="danger" onClick={onDelete}>Remove</Button>
            </div>
        </Modal>
    );
}