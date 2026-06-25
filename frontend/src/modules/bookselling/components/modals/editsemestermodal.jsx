import Modal from "../../../../components/ui/modal";
import SemesterForm from "../forms/SemesterForm";
import Button from "../../../../components/ui/button";

export default function EditSemesterModal({ form, setForm, error, onClose, onSave }) {
    return (
        <Modal title="Edit Semester" onClose={onClose}>
            <SemesterForm form={form} setForm={setForm} error={error} />
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={onSave}>Save Changes</Button>
            </div>
        </Modal>
    );
}