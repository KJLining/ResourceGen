import { useCallback, useEffect, useState } from "react";
import ProfRemittanceTable from "../components/tables/profremittancetable";
import PublisherRemittanceTable from "../components/tables/publisherremittancetable";
import SchoolCommissionTable from "../components/tables/schoolcommissiontable";
import MarkPaidModal from "../components/modals/MarkPaidModal";
import Dropdown from "../../../components/ui/dropdown";
import api from "../../../api";

const MONTHS = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
];
const YEARS = ['2023', '2024', '2025', '2026'].map(y => ({ value: y, label: y }));
const SEMESTERS = [
    { value: '1st', label: '1st Semester' },
    { value: '2nd', label: '2nd Semester' },
    { value: 'Summer', label: 'Summer' },
];
const SCHOOL_YEARS = ['2023-2024', '2024-2025', '2025-2026', '2026-2027']
    .map(sy => ({ value: sy, label: `S.Y. ${sy}` }));

export default function Remittances() {
    const [tab, setTab] = useState('professors');
    const [period, setPeriod] = useState('all');
    const [month, setMonth] = useState(String(new Date().getMonth() + 1));
    const [year, setYear] = useState(String(new Date().getFullYear()));
    const [semester, setSemester] = useState('1st');
    const [schoolYear, setSchoolYear] = useState('2025-2026');

    const [profData, setProfData] = useState([]);
    const [publisherData, setPublisherData] = useState([]);
    const [schoolData, setSchoolData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [markType, setMarkType] = useState(null);

    // Summary counts
    const unpaidProf = profData.filter(r => r.status === 'unpaid')
        .reduce((a, r) => a + Number(r.commission_amount), 0);
    const unpaidPub = publisherData.filter(r => r.status === 'unpaid')
        .reduce((a, r) => a + Number(r.remittance_amount), 0);
    const totalSchool = schoolData.reduce((a, r) => a + Number(r.commission_amount), 0);

    const getParams = useCallback(() => {
        if (period === 'monthly') return { period: 'monthly', month, year };
        if (period === 'semester') return { period: 'semester', semester, school_year: schoolYear };
        return { period: 'all' };
    }, [period, month, year, semester, schoolYear]);

    const fetchAll = useCallback(() => {
        setLoading(true);
        const params = getParams();
        Promise.all([
            api.get('/remittances/professors', { params }),
            api.get('/remittances/publishers', { params }),
            api.get('/remittances/school', { params }),
        ]).then(([profRes, pubRes, schoolRes]) => {
            setProfData(profRes.data);
            setPublisherData(pubRes.data);
            setSchoolData(schoolRes.data);
        }).finally(() => setLoading(false));
    }, [getParams]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const openMarkPaid = (row, type) => {
        setSelected(row);
        setMarkType(type);
        setModal('markPaid');
    };

    const closeModal = () => {
        setModal(null);
        setSelected(null);
        setMarkType(null);
    };

    const handleConfirmPaid = async ({ date_paid, mode_of_payment, notes }) => {
        try {
            const endpoint = markType === 'professor'
                ? `/remittances/professors/${selected.id}`
                : `/remittances/publishers/${selected.id}`;

            await api.put(endpoint, { date_paid, mode_of_payment, notes });
            fetchAll();
            closeModal();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold text-center mb-5">Remittances</h1>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="bg-neutral-200 p-4 rounded-md shadow">
                    <p className="text-sm text-neutral-500">Unpaid — Professors</p>
                    <p className="text-xl font-bold text-yellow-600">
                        ₱ {unpaidProf.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-neutral-200 p-4 rounded-md shadow">
                    <p className="text-sm text-neutral-500">Unpaid — Publishers</p>
                    <p className="text-xl font-bold text-yellow-600">
                        ₱ {unpaidPub.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-neutral-200 p-4 rounded-md shadow">
                    <p className="text-sm text-neutral-500">School Commission (Collected)</p>
                    <p className="text-xl font-bold text-green-700">
                        ₱ {totalSchool.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* Period filter */}
            <div className="flex flex-wrap items-end gap-3 mb-4 p-4 bg-neutral-100 rounded-lg">
                <div>
                    <label className="block text-sm font-medium mb-1">Period</label>
                    <select value={period} onChange={e => setPeriod(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="all">All time</option>
                        <option value="monthly">Monthly</option>
                        <option value="semester">Per Semester</option>
                    </select>
                </div>

                {period === 'monthly' && (
                    <>
                        <Dropdown label="Month" options={MONTHS} value={month}
                            onChange={setMonth} width="w-36" placeholder="Month" />
                        <Dropdown label="Year" options={YEARS} value={year}
                            onChange={setYear} width="w-28" placeholder="Year" />
                    </>
                )}

                {period === 'semester' && (
                    <>
                        <Dropdown label="Semester" options={SEMESTERS} value={semester}
                            onChange={setSemester} width="w-40" placeholder="Semester" />
                        <Dropdown label="School Year" options={SCHOOL_YEARS} value={schoolYear}
                            onChange={setSchoolYear} width="w-44" placeholder="School Year" />
                    </>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-4">
                {[
                    { key: 'professors', label: 'Professors' },
                    { key: 'publishers', label: 'Publishers' },
                    { key: 'school', label: 'School' },
                ].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`px-6 py-2 text-sm font-medium border-b-2 transition ${
                            tab === t.key
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-neutral-500 hover:text-green-600'
                        }`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {loading
                ? <p className="text-neutral-500">Loading...</p>
                : <>
                    {tab === 'professors' && (
                        <ProfRemittanceTable
                            data={profData}
                            onMarkPaid={row => openMarkPaid(row, 'professor')}
                        />
                    )}
                    {tab === 'publishers' && (
                        <PublisherRemittanceTable
                            data={publisherData}
                            onMarkPaid={row => openMarkPaid(row, 'publisher')}
                        />
                    )}
                    {tab === 'school' && (
                        <SchoolCommissionTable data={schoolData} />
                    )}
                </>
            }

            {modal === 'markPaid' && (
                <MarkPaidModal
                    selected={selected}
                    type={markType}
                    onClose={closeModal}
                    onConfirm={handleConfirmPaid}
                />
            )}
        </>
    );
}