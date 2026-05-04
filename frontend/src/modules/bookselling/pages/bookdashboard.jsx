import DashboardCards from "../components/cards/dashboardcards"
import GraphImage from "../../../assets/graph.png"
import SalesbyProf from "../components/tables/salesbyprof"
import LowStocks from "../components/tables/lowstocks"
import RecentSales from "../components/tables/recentsales"
export default function BookDashboard() {
    return (
        <>
        <DashboardCards />

        <div className="flex flex-row gap-x-5">
            <div className="flex flex-col w-full p-4 bg-neutral-200 rounded-md shadow">
                <p className="text-2xl font-bold text-center mb-5">Sales Graph</p>
                <img src={GraphImage} alt="Graph" className="w-full rounded-md shadow" />
            </div>
        <div className="flex flex-col space-y-4">
            <RecentSales />
            <div className="flex flex-row space-x-4">
                <SalesbyProf />
                <LowStocks />
            </div>
        </div>
        </div>
        
        </>
    )
}