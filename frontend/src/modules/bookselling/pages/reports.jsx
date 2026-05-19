import { useState } from "react";
import Button from "../../../components/ui/button";
import Dropdown from "../../../components/ui/dropdown";
import ReportSalesTable from "../components/tables/reportsalestable";
import ReportProfsTable from "../components/tables/reportprofstable";
import ReportPublishersTable from "../components/tables/reportpublisherstable";
import { exportPDF } from "../utils/exportPDF";
import { exportExcel } from "../utils/exportExcel";
import { FileDown, FileSpreadsheet } from "lucide-react";
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

export default function Reports() {
    const [tab, setTab] = useState('daily');
    const [loading, setLoading] = useState(false);
    const [hasData, setHasData] = useState(false);

    // Daily
    const [dailyDate, setDailyDate] = useState(new Date().toISOString().split('T')[0]);

    // Monthly
    const [month, setMonth] = useState(String(new Date().getMonth() + 1));
    const [year, setYear] = useState(String(new Date().getFullYear()));

    // Semester
    const [semester, setSemester] = useState('1st');
    const [schoolYear, setSchoolYear] = useState('2025-2026');

    // Report data
    const [salesData, setSalesData] = useState([]);
    const [profData, setProfData] = useState([]);
    const [publisherData, setPublisherData] = useState([]);

    const getPeriodLabel = () => {
        if (tab === 'daily') return dailyDate;
        if (tab === 'monthly') {
            const m = MONTHS.find(m => m.value === month);
            return `${m?.label} ${year}`;
        }
        return `${semester} Semester S.Y. ${schoolYear}`;
    };

    const handleView = async () => {
        setLoading(true);
        setHasData(false);
        try {
            let params = {};
            if (tab === 'daily') params = { type: 'daily', date: dailyDate };
            if (tab === 'monthly') params = { type: 'monthly', month, year };
            if (tab === 'semester') params = { type: 'semester', semester, school_year: schoolYear };

            const [salesRes, profsRes, pubsRes] = await Promise.all([
                api.get('/reports/sales', { params }),
                api.get('/reports/professors', { params }),
                api.get('/reports/publishers', { params }),
            ]);

            setSalesData(salesRes.data);
            setProfData(profsRes.data);
            setPublisherData(pubsRes.data);
            setHasData(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = () => {
        exportPDF({
            title: 'Sales Report',
            period: getPeriodLabel(),
            salesData, profData, publisherData,
        });
    };

    const handleExportExcel = () => {
        exportExcel({
            title: 'Sales Report',
            period: getPeriodLabel(),
            salesData, profData, publisherData,
        });
    };

    return (
        <>
            <h1 className="text-2xl font-bold text-center mb-5">Reports</h1>

            {/* Tabs */}
            <div className="flex border-b mb-4">
                {['daily', 'monthly', 'semester'].map(t => (
                    <button key={t} onClick={() => { setTab(t); setHasData(false); }}
                        className={`px-6 py-2 text-sm font-medium border-b-2 transition capitalize ${
                            tab === t
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-neutral-500 hover:text-green-600'
                        }`}>
                        {t === 'semester' ? 'Per Semester' : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-end gap-3 mb-5 p-4 bg-neutral-100 rounded-lg">
                {tab === 'daily' && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Select Date</label>
                        <input type="date" value={dailyDate}
                            onChange={e => setDailyDate(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                )}

                {tab === 'monthly' && (
                    <>
                        <Dropdown label="Month" options={MONTHS} value={month}
                            onChange={setMonth} width="w-40" placeholder="Month" />
                        <Dropdown label="Year" options={YEARS} value={year}
                            onChange={setYear} width="w-32" placeholder="Year" />
                    </>
                )}

                {tab === 'semester' && (
                    <>
                        <Dropdown label="Semester" options={SEMESTERS} value={semester}
                            onChange={setSemester} width="w-44" placeholder="Semester" />
                        <Dropdown label="School Year" options={SCHOOL_YEARS} value={schoolYear}
                            onChange={setSchoolYear} width="w-44" placeholder="School Year" />
                    </>
                )}

                <div className="flex items-end">
                    <Button variant="primary" onClick={handleView} className="h-[38px]">
                        {loading ? 'Loading...' : 'View Report'}
                    </Button>
                </div>

                {hasData && (
                    <div className="flex gap-2 items-end ml-auto">
                        <Button variant="outline" className="inline-flex items-center h-[38px]"
                            onClick={handleExportPDF}>
                            <FileDown className="w-4 h-4 mr-2" /> Export PDF
                        </Button>
                        <Button variant="primary" className="inline-flex items-center h-[38px]"
                            onClick={handleExportExcel}>
                            <FileSpreadsheet className="w-4 h-4 mr-2" /> Export Excel
                        </Button>
                    </div>
                )}
            </div>

            {/* Period label */}
            {hasData && (
                <p className="text-sm text-neutral-500 mb-3">
                    Showing results for: <strong>{getPeriodLabel()}</strong>
                </p>
            )}

            {/* Report Tables */}
            {loading && <p className="text-neutral-500">Loading report...</p>}

            {hasData && !loading && (
                <div className="space-y-6">
                    <ReportSalesTable data={salesData} />
                    <ReportProfsTable data={profData} />
                    <ReportPublishersTable data={publisherData} />
                </div>
            )}

            {!hasData && !loading && (
                <div className="text-center text-neutral-400 py-16 text-sm">
                    Select a period and click <strong>View Report</strong> to generate the report.
                </div>
            )}
        </>
    );
}