import { useEffect, useState } from "react"
import axios from "axios"
import Table from "../../../components/ui/table"
import Button from "../../../components/ui/button"

const STATUS_PIPELINE = [
    { key: "received",        label: "Received",          color: "bg-blue-100 text-blue-700 border-blue-200" },
    { key: "for_binding",     label: "For Binding",       color: "bg-purple-100 text-purple-700 border-purple-200" },
    { key: "ready_for_pickup",label: "Ready for Pickup",  color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { key: "claimed",         label: "Claimed",           color: "bg-green-100 text-green-700 border-green-200" },
    { key: "cancelled",       label: "Cancelled",         color: "bg-red-100 text-red-700 border-red-200" },
]

function StatCard({ label, value, sub, colorClass = "text-gray-800" }) {
    return (
        <div className="bg-white border rounded-xl p-4 flex flex-col gap-1">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
            <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
            {sub && <p className="text-xs text-gray-400">{sub}</p>}
        </div>
    )
}

function MonthlyBar({ monthly }) {
    if (!monthly || monthly.length === 0) return null

    const maxTotal = Math.max(...monthly.map(m => Number(m.total)), 1)

    return (
        <div className="bg-white border rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-700 mb-4">Monthly Requests (Last 6 Months)</h2>
            <div className="flex items-end gap-3 h-36">
                {monthly.map(m => {
                    const total = Number(m.total)
                    const claimed = Number(m.claimed)
                    const heightPct = Math.round((total / maxTotal) * 100)
                    const claimedPct = total > 0 ? Math.round((claimed / total) * 100) : 0

                    return (
                        <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-xs text-gray-500 font-medium">{total}</span>
                            <div
                                className="w-full rounded-t-md bg-green-100 relative overflow-hidden"
                                style={{ height: `${Math.max(heightPct, 6)}%` }}
                                title={`${m.month_label}: ${total} total, ${claimed} claimed`}
                            >
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-green-500 rounded-t-md"
                                    style={{ height: `${claimedPct}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-400 text-center leading-tight">
                                {m.month_label}
                            </span>
                        </div>
                    )
                })}
            </div>
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-300 inline-block" />
                    Total
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />
                    Claimed
                </span>
            </div>
        </div>
    )
}

export default function Reports() {

    const [reportData, setReportData] = useState(null)
    const [loading, setLoading] = useState(false)

    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [appliedFrom, setAppliedFrom] = useState("")
    const [appliedTo, setAppliedTo] = useState("")

    const fetchReports = async (from = "", to = "") => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (from) params.append("date_from", from)
            if (to) params.append("date_to", to)

            const res = await axios.get(
                `http://localhost:5000/api/printing-reports?${params.toString()}`
            )
            setReportData(res.data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [])

    const handleApplyFilter = () => {
        setAppliedFrom(dateFrom)
        setAppliedTo(dateTo)
        fetchReports(dateFrom, dateTo)
    }

    const handleClearFilter = () => {
        setDateFrom("")
        setDateTo("")
        setAppliedFrom("")
        setAppliedTo("")
        fetchReports()
    }

    const hasDateFilter = appliedFrom || appliedTo

    if (!reportData && !loading) return null

    if (loading && !reportData) return (
        <div className="p-10 text-center text-gray-400">Loading reports...</div>
    )

    const s = reportData?.summary || {}

    return (
        <div>

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Printing Reports</h1>
                    <p className="text-gray-500 text-sm">
                        {hasDateFilter
                            ? `Showing results from ${appliedFrom || "—"} to ${appliedTo || "—"}`
                            : "All-time statistics for printing services"}
                    </p>
                </div>

                {/* Date filter */}
                <div className="flex flex-wrap gap-2 items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-medium">From</label>
                        <input
                            type="date"
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-medium">To</label>
                        <input
                            type="date"
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleApplyFilter} className="text-sm">
                        Apply
                    </Button>
                    {hasDateFilter && (
                        <Button variant="outline" onClick={handleClearFilter} className="text-sm">
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Top stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                <StatCard
                    label="Total Requests"
                    value={s.total_requests ?? 0}
                    colorClass="text-gray-800"
                />
                <StatCard
                    label="Total Revenue"
                    value={`₱${Number(s.total_revenue || 0).toLocaleString()}`}
                    colorClass="text-green-700"
                />
                {STATUS_PIPELINE.map(st => (
                    <div key={st.key} className={`border rounded-xl p-4 flex flex-col gap-1 ${st.color}`}>
                        <p className="text-xs font-medium uppercase tracking-wide opacity-70">{st.label}</p>
                        <p className="text-3xl font-bold">{s[st.key] ?? 0}</p>
                    </div>
                ))}
            </div>

            {/* Pipeline visual */}
            <div className="bg-white border rounded-xl p-5 mb-6">
                <h2 className="text-base font-semibold text-gray-700 mb-3">Status Pipeline</h2>
                <div className="flex items-center gap-1 flex-wrap">
                    {STATUS_PIPELINE.filter(st => st.key !== "cancelled").map((st, idx, arr) => {
                        const count = s[st.key] ?? 0
                        const total = s.total_requests || 1
                        const pct = Math.round((count / total) * 100)
                        return (
                            <div key={st.key} className="flex items-center gap-1 flex-1 min-w-[80px]">
                                <div className={`flex-1 rounded-lg p-3 text-center border ${st.color}`}>
                                    <p className="text-lg font-bold">{count}</p>
                                    <p className="text-xs font-medium">{st.label}</p>
                                    <p className="text-xs opacity-60">{pct}%</p>
                                </div>
                                {idx < arr.length - 1 && (
                                    <span className="text-gray-300 text-lg">›</span>
                                )}
                            </div>
                        )
                    })}
                </div>
                {(s.cancelled ?? 0) > 0 && (
                    <p className="text-xs text-red-400 mt-2">
                        + {s.cancelled} cancelled request{s.cancelled !== 1 ? "s" : ""} not shown in pipeline
                    </p>
                )}
            </div>

            {/* Monthly bar chart */}
            {reportData?.monthly && (
                <div className="mb-6">
                    <MonthlyBar monthly={reportData.monthly} />
                </div>
            )}

            {/* Two column: courses + types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                {/* Requests by Course */}
                <div className="bg-white border rounded-xl p-5">
                    <h2 className="text-base font-semibold text-gray-700 mb-3">Requests by Course</h2>
                    <Table
                        width="full"
                        size="sm"
                        columns={[
                            { header: "Course", accessor: "course" },
                            { header: "Total", accessor: "total" },
                            {
                                header: "Claimed",
                                render: row => (
                                    <span className="text-green-600 font-medium">{row.claimed}</span>
                                ),
                            },
                            {
                                header: "Revenue",
                                render: row =>
                                    `₱${Number(row.revenue || 0).toLocaleString()}`,
                            },
                        ]}
                        data={reportData?.courses ?? []}
                    />
                </div>

                {/* Requests by Document Type */}
                <div className="bg-white border rounded-xl p-5">
                    <h2 className="text-base font-semibold text-gray-700 mb-3">Requests by Document Type</h2>
                    <Table
                        width="full"
                        size="sm"
                        columns={[
                            { header: "Type", accessor: "document_type" },
                            { header: "Total", accessor: "total" },
                            {
                                header: "Claimed",
                                render: row => (
                                    <span className="text-green-600 font-medium">{row.claimed}</span>
                                ),
                            },
                            {
                                header: "Revenue",
                                render: row =>
                                    `₱${Number(row.revenue || 0).toLocaleString()}`,
                            },
                        ]}
                        data={reportData?.types ?? []}
                    />
                </div>

            </div>

            {/* Binding Summary */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border rounded-xl p-5 text-center">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Total Hardbound Copies
                    </p>
                    <p className="text-4xl font-bold text-gray-800">
                        {reportData?.bindings?.hardbound_total ?? 0}
                    </p>
                </div>
                <div className="bg-white border rounded-xl p-5 text-center">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Total Softbound Copies
                    </p>
                    <p className="text-4xl font-bold text-gray-800">
                        {reportData?.bindings?.softbound_total ?? 0}
                    </p>
                </div>
            </div>

        </div>
    )
}