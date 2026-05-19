import Modal from "../../../../components/ui/modal";
import DeliveryForm from "../forms/DeliveryForm";
import Button from "../../../../components/ui/button";

export default function AddDeliveryModal({ form, setForm, error, onClose, onSave }) {
    return (
        <Modal title="Record Delivery" onClose={onClose}>
            <div className="max-h-[70vh] overflow-y-auto pr-1">
                <DeliveryForm form={form} setForm={setForm} error={error} />
            </div>
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={onSave}>Save Delivery</Button>
            </div>
        </Modal>
    );
}