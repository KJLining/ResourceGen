import { Outlet } from "react-router-dom"
import Topbar from "../../../components/topbar"
import ConcessionaireSidebar from "../components/concessionairesidebar"

export default function ConcessionaireLayout() {
    return (
        <>
            <Topbar />
            <ConcessionaireSidebar />
            <div className="ml-52 p-4 h-screen mt-16 overflow-y-auto">
                <Outlet />
            </div>
        </>
    )
}