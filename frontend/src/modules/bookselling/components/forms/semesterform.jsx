import Dropdown from "../../../../components/ui/dropdown";

const SEMESTER_OPTIONS = [
    { value: '1st', label: '1st Semester' },
    { value: '2nd', label: '2nd Semester' },
    { value: 'Summer', label: 'Summer' },
];

const SCHOOL_YEARS = ['2023-2024', '2024-2025', '2025-2026', '2026-2027', '2027-2028']
    .map(sy => ({ value: sy, label: sy }));

export default function SemesterForm({ form, setForm, error }) {
    return (
        <div className="space-y-3">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Label <span className="text-red-500">*</span>
                </label>
                <input type="text" value={form.label}
                    onChange={e => setForm({ ...form, label: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. 1st Semester 2025-2026" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">
                    Semester <span className="text-red-500">*</span>
                </label>
                <Dropdown
                    label=""
                    placeholder="Select semester..."
                    options={SEMESTER_OPTIONS}
                    value={form.semester}
                    onChange={val => setForm({ ...form, semester: val })}
                    width="w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">
                    School Year <span className="text-red-500">*</span>
                </label>
                <Dropdown
                    label=""
                    placeholder="Select school year..."
                    options={SCHOOL_YEARS}
                    value={form.school_year}
                    onChange={val => setForm({ ...form, school_year: val })}
                    width="w-full"
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Start Date <span className="text-red-500">*</span>
                    </label>
                    <input type="date" value={form.start_date}
                        onChange={e => setForm({ ...form, start_date: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        End Date <span className="text-red-500">*</span>
                    </label>
                    <input type="date" value={form.end_date}
                        onChange={e => setForm({ ...form, end_date: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
            </div>
        </div>
    );
}