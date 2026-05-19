import { useEffect, useState } from "react";
import api from "../../../api";
import DashboardCards from "../components/cards/dashboardcards"
import GraphImage from "../../../assets/graph.png"
import SalesbyProf from "../components/tables/salesbyprof"
import LowStocks from "../components/tables/lowstocks"
import RecentSales from "../components/tables/recentsales"

export default function BookDashboard() {
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/dashboard')
            .then(res => {
                setDashData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="p-4 text-neutral-500">Loading dashboard...</p>;

    return (
        <>
            <DashboardCards
                todaySales={dashData?.todaySales}
                monthlySales={dashData?.monthlySales}
                onHand={dashData?.onHand}
                topSelling={dashData?.topSelling}
            />
            <div className="flex flex-row gap-x-5">
                <div className="flex flex-col w-full p-4 bg-neutral-200 rounded-md shadow">
                    <p className="text-2xl font-bold text-center mb-5">Sales Graph</p>
                    <img src={GraphImage} alt="Graph" className="w-full rounded-md shadow" />
                </div>
                <div className="flex flex-col space-y-4">
                    <RecentSales data={dashData?.recentSales} />
                    <div className="flex flex-row space-x-4">
                        <SalesbyProf data={dashData?.salesByProf} />
                        <LowStocks data={dashData?.lowStocks} />
                    </div>
                </div>
            </div>
        </>
    )
}