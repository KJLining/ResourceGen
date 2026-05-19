import Modal from "../../../../components/ui/modal";
import SaleForm from "../forms/SaleForm";
import Button from "../../../../components/ui/button";

export default function AddSaleModal({ form, setForm, error, onClose, onSave }) {
    return (
        <Modal title="Add Sale" onClose={onClose}>
            <div className="max-h-[75vh] overflow-y-auto pr-1">
                <SaleForm form={form} setForm={setForm} error={error} />
            </div>
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={onSave}>Save Sale</Button>
            </div>
        </Modal>
    );
}