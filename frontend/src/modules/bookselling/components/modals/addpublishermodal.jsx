import Modal from "../../../../components/ui/modal";
import PublisherForm from "../forms/PublisherForm";
import Button from "../../../../components/ui/button";

export default function AddPublisherModal({ form, setForm, error, onClose, onSave }) {
    return (
        <Modal title="Add Publisher" onClose={onClose}>
            <PublisherForm form={form} setForm={setForm} error={error} />
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={onSave}>Save</Button>
            </div>
        </Modal>
    );
}