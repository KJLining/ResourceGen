import { useEffect, useState } from "react"
import axios from "axios"

import {
    PrintingPipelineBar,
    PrintingMetricCards,
    PrintingMonthlyChart,
    PrintingCourseBreakdown,
    PrintingRecentActivity,
} from "../components/cards/printingdashboardcards"

export default function PrintingDashboard() {

    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchRequests = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/printing-services"
            )
            setRequests(res.data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    // --- Derived stats ---

    const totalRequests = requests.length

    const received    = requests.filter(r => r.status === "Received").length
    const forBinding  = requests.filter(r => r.status === "For Binding").length
    const ready       = requests.filter(r => r.status === "Ready for Pickup").length
    const claimed     = requests.filter(r => r.status === "Claimed").length
    const cancelled   = requests.filter(r => r.status === "Cancelled").length

    const totalRevenue = requests.reduce(
        (sum, r) => sum + Number(r.total_amount || 0), 0
    )

    const claimRate = totalRequests > 0
        ? Math.round((claimed / totalRequests) * 100)
        : 0

    const avgPerRequest = claimed > 0
        ? Math.round(totalRevenue / claimed)
        : 0

    // Monthly buckets (last 6 months)
    const monthlyMap = {}
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        const label = d.toLocaleString("default", { month: "short", year: "2-digit" })
        monthlyMap[key] = { label, total: 0, claimed: 0 }
    }

    requests.forEach(r => {
        const d = new Date(r.created_at)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        if (monthlyMap[key]) {
            monthlyMap[key].total += 1
            if (r.status === "Claimed") monthlyMap[key].claimed += 1
        }
    })

    const monthlyData = Object.values(monthlyMap)

    // Course breakdown
    const courseMap = {}
    requests.forEach(r => {
        if (!courseMap[r.course]) courseMap[r.course] = 0
        courseMap[r.course] += 1
    })

    const courseData = Object.entries(courseMap)
        .map(([course, total]) => ({ course, total }))
        .sort((a, b) => b.total - a.total)

    // Recent activity — last 8 by created_at
    const recentRequests = [...requests]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 8)

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                Loading dashboard...
            </div>
        )
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Printing Dashboard
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Overview of printing services requests
                </p>
            </div>

            {/* Pipeline */}
            <PrintingPipelineBar
                received={received}
                forBinding={forBinding}
                ready={ready}
                claimed={claimed}
                cancelled={cancelled}
            />

            {/* Metric cards */}
            <PrintingMetricCards
                totalRequests={totalRequests}
                totalRevenue={totalRevenue}
                claimRate={claimRate}
                avgPerRequest={avgPerRequest}
            />

            {/* Chart + Course breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <PrintingMonthlyChart data={monthlyData} />
                <PrintingCourseBreakdown data={courseData} />
            </div>

            {/* Recent activity */}
            <PrintingRecentActivity requests={recentRequests} />

        </div>
    )
}