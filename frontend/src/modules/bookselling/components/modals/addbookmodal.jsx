import Modal from "../../../../components/ui/modal";
import BookForm from "../forms/BookForm";
import Button from "../../../../components/ui/button";

export default function AddBookModal({ form, setForm, error, onClose, onSave }) {
    return (
        <Modal title="Add Book" onClose={onClose}>
            <div className="max-h-[70vh] overflow-y-auto pr-1">
                <BookForm form={form} setForm={setForm} error={error} />
            </div>
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={onSave}>Save</Button>
            </div>
        </Modal>
    );
}