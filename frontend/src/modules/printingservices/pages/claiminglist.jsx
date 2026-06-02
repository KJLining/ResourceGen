import { useEffect, useState } from "react"
import axios from "axios"
import Button from "../../../components/ui/button"
import Table from "../../../components/ui/table"
import ClaimModal from "../components/modals/claimprintingmodal"

const COURSES = [
    "BSIT", "BSCS", "BSEd", "BEEd", "BECE",
    "BSBA", "BENT", "BSHM", "BSOA", "BAJOURN", "BSPSYCH",
]

const DOCUMENT_TYPES = ["Thesis", "EDP", "Narrative", "Portfolio"]

const STATUS_COLORS = {
    "Ready for Pickup": "bg-green-100 text-green-700",
}

export default function ClaimingList() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(false)

    const [filterCourse, setFilterCourse] = useState("")
    const [filterType, setFilterType] = useState("")
    const [search, setSearch] = useState("")
    const [searchInput, setSearchInput] = useState("")

    const [selectedRequest, setSelectedRequest] = useState(null)
    const [showClaimModal, setShowClaimModal] = useState(false)

    const fetchRequests = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (filterCourse) params.append("course", filterCourse)
            if (filterType) params.append("document_type", filterType)
            if (search) params.append("search", search)

            const res = await axios.get(
                `http://localhost:5000/api/printing-claiming?${params.toString()}`
            )
            setRequests(res.data.rows)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [filterCourse, filterType, search])

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        setSearch(searchInput)
    }

    const handleClearFilters = () => {
        setFilterCourse("")
        setFilterType("")
        setSearch("")
        setSearchInput("")
    }

    // Group by course for the grouped view
    const groupedData = COURSES
        .map(course => ({
            course,
            items: requests.filter(r => r.course === course),
        }))
        .filter(g => g.items.length > 0)

    const totalShown = requests.length
    const hasFilters = filterCourse || filterType || search

    const columns = [
        {
            header: "No.",
            render: (row, i) => i + 1,
        },
        {
            header: "Control No",
            accessor: "control_no",
        },
        {
            header: "Title",
            accessor: "title",
        },
        {
            header: "Members / Name",
            accessor: "members",
        },
        {
            header: "Type",
            render: (row) => (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    {row.document_type}
                </span>
            ),
        },
        {
            header: "HB",
            accessor: "hardbound_qty",
        },
        {
            header: "SB",
            accessor: "softbound_qty",
        },
        {
            header: "Amount",
            render: (row) => `₱${Number(row.total_amount).toLocaleString()}`,
        },
    ]

    return (
        <div>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Claiming List
                </h1>
                <p className="text-gray-500 text-sm">
                    Documents ready for pickup — grouped by course
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white border rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-end">

                {/* Search by name */}
                <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 min-w-[220px]">
                    <input
                        type="text"
                        className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="Search by name, title, control no..."
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />
                    <Button type="submit" className="text-sm shrink-0">
                        Search
                    </Button>
                </form>

                {/* Course filter */}
                <div className="flex flex-col gap-1 min-w-[140px]">
                    <label className="text-xs text-gray-500 font-medium">Course</label>
                    <select
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={filterCourse}
                        onChange={e => setFilterCourse(e.target.value)}
                    >
                        <option value="">All Courses</option>
                        {COURSES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Type filter */}
                <div className="flex flex-col gap-1 min-w-[140px]">
                    <label className="text-xs text-gray-500 font-medium">Document Type</label>
                    <select
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        {DOCUMENT_TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                {/* Clear */}
                {hasFilters && (
                    <Button
                        variant="outline"
                        className="text-sm shrink-0"
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </Button>
                )}

            </div>

            {/* Result count */}
            <div className="mb-4 text-sm text-gray-500">
                {loading
                    ? "Loading..."
                    : `${totalShown} document${totalShown !== 1 ? "s" : ""} ready for pickup`
                }
            </div>

            {/* Grouped tables */}
            {!loading && groupedData.length === 0 && (
                <div className="bg-white border rounded-xl p-10 text-center text-gray-400">
                    <p className="text-lg font-medium">No documents ready for pickup</p>
                    <p className="text-sm mt-1">
                        {hasFilters
                            ? "Try adjusting your filters."
                            : "All documents have been claimed or are still being processed."}
                    </p>
                </div>
            )}

            <div className="space-y-8">
                {groupedData.map(group => (
                    <div
                        key={group.course}
                        className="bg-white border rounded-xl overflow-hidden"
                    >
                        {/* Course header */}
                        <div className="flex items-center justify-between px-5 py-3 border-b bg-green-50">
                            <div className="flex items-center gap-3">
                                <h2 className="text-base font-bold text-green-800">
                                    {group.course}
                                </h2>
                                <span className="bg-green-200 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    {group.items.length} {group.items.length === 1 ? "document" : "documents"}
                                </span>
                            </div>
                            <div className="text-xs text-green-700 font-medium flex gap-4">
                                <span>
                                    HB: {group.items.reduce((s, r) => s + Number(r.hardbound_qty || 0), 0)}
                                </span>
                                <span>
                                    SB: {group.items.reduce((s, r) => s + Number(r.softbound_qty || 0), 0)}
                                </span>
                            </div>
                        </div>

                        {/* Table */}
                        <Table
                            columns={columns}
                            data={group.items}
                            width="full"
                            size="md"
                            renderActions={(row, i) => (
                                <Button
                                    variant="primary"
                                    className="text-xs"
                                    onClick={() => {
                                        setSelectedRequest(row)
                                        setShowClaimModal(true)
                                    }}
                                >
                                    Mark as Claimed
                                </Button>
                            )}
                        />
                    </div>
                ))}
            </div>

            {/* Claim Modal */}
            {showClaimModal && selectedRequest && (
                <ClaimModal
                    request={selectedRequest}
                    onClose={() => {
                        setShowClaimModal(false)
                        setSelectedRequest(null)
                    }}
                    refreshData={fetchRequests}
                />
            )}

        </div>
    )
}