import Modal from "../../../../components/ui/modal";
import Button from "../../../../components/ui/button";
import { useState } from "react";

export default function MarkPaidModal({ selected, type, onClose, onConfirm }) {
    const [datePaid, setDatePaid] = useState(new Date().toISOString().split('T')[0]);
    const [mode, setMode] = useState('Cash');
    const [notes, setNotes] = useState('');

    const modeOptions = ['Cash', 'Bank transfer', 'Check', 'GCash', 'Maya'];

    const label = type === 'professor'
        ? `Prof. commission for Ctrl #${selected?.sale_id}`
        : `Publisher remittance for Ctrl #${selected?.sale_id}`;

    return (
        <Modal title="Mark as Paid" onClose={onClose}>
            <div className="space-y-3">
                <p className="text-sm text-neutral-600">{label}</p>
                <div className="bg-neutral-100 rounded-lg px-4 py-3">
                    <p className="text-xs text-neutral-500 mb-1">Amount</p>
                    <p className="text-xl font-semibold text-green-700">
                        ₱ {Number(selected?.commission_amount || selected?.remittance_amount || 0)
                            .toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Date Paid</label>
                    <input type="date" value={datePaid}
                        onChange={e => setDatePaid(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Mode of Payment</label>
                    <select value={mode} onChange={e => setMode(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                        {modeOptions.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                    <input type="text" value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="e.g. OR No. 12345"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={() => onConfirm({ date_paid: datePaid, mode_of_payment: mode, notes })}>
                    Confirm Payment
                </Button>
            </div>
        </Modal>
    );
}