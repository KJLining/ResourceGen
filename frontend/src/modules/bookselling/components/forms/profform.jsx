export default function ProfForm({ form, setForm, error }) {
    return (
        <div className="space-y-3">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Professor Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. Dr. Santos"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input
                    type="text"
                    value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. Engineering"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Contact Number</label>
                <input
                    type="text"
                    value={form.contact_number}
                    onChange={e => setForm({ ...form, contact_number: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. 09171234567"
                />
            </div>
        </div>
    )
}