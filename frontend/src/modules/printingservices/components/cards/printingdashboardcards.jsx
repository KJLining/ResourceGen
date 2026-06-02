// ─── PrintingPipelineBar ────────────────────────────────────────────────────

export function PrintingPipelineBar({
    received,
    forBinding,
    ready,
    claimed,
    cancelled,
}) {
    const steps = [
        { label: "Received",        count: received,   dot: "bg-blue-400"   },
        { label: "For Binding",     count: forBinding,  dot: "bg-purple-400" },
        { label: "Ready for Pickup",count: ready,       dot: "bg-amber-400"  },
        { label: "Claimed",         count: claimed,     dot: "bg-green-500"  },
        { label: "Cancelled",       count: cancelled,   dot: "bg-red-400"    },
    ]

    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">
                Status pipeline
            </p>
            <div className="flex divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-white">
                {steps.map(step => (
                    <div
                        key={step.label}
                        className="flex-1 px-3 py-4 text-center"
                    >
                        <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${step.dot}`} />
                        <span className="block text-2xl font-semibold text-gray-800">
                            {step.count}
                        </span>
                        <span className="block text-xs text-gray-400 mt-1 leading-tight">
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}


// ─── PrintingMetricCards ─────────────────────────────────────────────────────

export function PrintingMetricCards({
    totalRequests,
    totalRevenue,
    claimRate,
    avgPerRequest,
}) {
    const cards = [
        {
            label: "Total requests",
            value: totalRequests,
            sub: "All time",
        },
        {
            label: "Total revenue",
            value: `₱${Number(totalRevenue).toLocaleString()}`,
            sub: "All time",
        },
        {
            label: "Claim rate",
            value: `${claimRate}%`,
            sub: "Claimed vs total",
        },
        {
            label: "Avg. per request",
            value: `₱${Number(avgPerRequest).toLocaleString()}`,
            sub: "Based on claimed",
        },
    ]

    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">
                Overview
            </p>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {cards.map(card => (
                    <div
                        key={card.label}
                        className="bg-gray-50 rounded-xl px-4 py-4"
                    >
                        <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                        <p className="text-2xl font-semibold text-gray-800">{card.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}


// ─── PrintingMonthlyChart ─────────────────────────────────────────────────────
// Uses a simple inline SVG bar chart — no extra dependencies needed.

export function PrintingMonthlyChart({ data }) {
    if (!data || data.length === 0) return null

    const maxVal = Math.max(...data.map(d => d.total), 1)
    const BAR_H = 120

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-700 mb-3">
                Monthly requests
            </p>

            <div className="flex items-end gap-1 mb-1" style={{ height: BAR_H }}>
                {data.map(d => {
                    const totalH = Math.max(Math.round((d.total / maxVal) * BAR_H), 2)
                    const claimedH = d.total > 0
                        ? Math.round((d.claimed / d.total) * totalH)
                        : 0

                    return (
                        <div
                            key={d.label}
                            className="flex-1 flex flex-col items-center justify-end gap-0"
                            style={{ height: BAR_H }}
                            title={`${d.label}: ${d.total} total, ${d.claimed} claimed`}
                        >
                            <span className="text-xs text-gray-400 mb-1">{d.total}</span>
                            <div
                                className="w-full rounded-t-sm overflow-hidden flex flex-col justify-end bg-blue-100"
                                style={{ height: totalH }}
                            >
                                <div
                                    className="w-full bg-green-500 rounded-t-sm"
                                    style={{ height: claimedH }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-between mt-1 mb-3">
                {data.map(d => (
                    <span
                        key={d.label}
                        className="flex-1 text-center text-xs text-gray-400"
                    >
                        {d.label}
                    </span>
                ))}
            </div>

            <div className="flex gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-200 inline-block" />
                    Total
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" />
                    Claimed
                </span>
            </div>
        </div>
    )
}


// ─── PrintingCourseBreakdown ──────────────────────────────────────────────────

export function PrintingCourseBreakdown({ data }) {
    if (!data || data.length === 0) return null

    const max = data[0]?.total || 1
    const visible = data.slice(0, 7)

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-700 mb-3">
                Requests by course
            </p>

            <div className="space-y-2.5">
                {visible.map(row => (
                    <div key={row.course} className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-700 w-16 shrink-0">
                            {row.course}
                        </span>
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-blue-400"
                                style={{ width: `${Math.round((row.total / max) * 100)}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-400 w-5 text-right shrink-0">
                            {row.total}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}


// ─── PrintingRecentActivity ───────────────────────────────────────────────────

const STATUS_META = {
    "Received":         { dot: "bg-blue-400",   verb: "received" },
    "For Binding":      { dot: "bg-purple-400",  verb: "sent for binding" },
    "Ready for Pickup": { dot: "bg-amber-400",   verb: "ready for pickup" },
    "Claimed":          { dot: "bg-green-500",   verb: "claimed" },
    "Cancelled":        { dot: "bg-red-400",     verb: "cancelled" },
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days === 1) return "Yesterday"
    return `${days}d ago`
}

export function PrintingRecentActivity({ requests }) {
    if (!requests || requests.length === 0) return null

    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">
                Recent activity
            </p>
            <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50">
                {requests.map(r => {
                    const meta = STATUS_META[r.status] || { dot: "bg-gray-400", verb: r.status.toLowerCase() }
                    const shortTitle = r.title.length > 45
                        ? r.title.slice(0, 45) + "…"
                        : r.title

                    return (
                        <div
                            key={r.id}
                            className="flex items-center gap-3 px-5 py-3"
                        >
                            <div className={`w-2 h-2 rounded-full shrink-0 ${meta.dot}`} />
                            <p className="flex-1 text-sm text-gray-500 min-w-0">
                                <span className="font-medium text-gray-800">
                                    {shortTitle}
                                </span>
                                {" "}—{" "}
                                {r.course} · {r.document_type} — {meta.verb}
                            </p>
                            <span className="text-xs text-gray-400 shrink-0">
                                {timeAgo(r.created_at)}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}