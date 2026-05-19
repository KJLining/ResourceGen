export default function PublisherForm({ form, setForm, error }) {
    return (
        <div className="space-y-3">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Publisher Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. Rex Bookstore"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Contact Person</label>
                <input
                    type="text"
                    value={form.contact_person}
                    onChange={e => setForm({ ...form, contact_person: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. Juan dela Cruz"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                    type="text"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. 09171234567"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. publisher@email.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. 123 Main St, Manila"
                    rows={2}
                />
            </div>
        </div>
    );
}