import { Outlet } from "react-router-dom"
import Topbar from "../../../components/topbar"
import PrintingSidebar from "../components/ui/printingsidebar"
export default function PrintingLayout(){
    return(
        <>
        <Topbar />
        <PrintingSidebar />
        <div className='ml-52 p-4 h-screen mt-16 overflow-y-auto'>
        <Outlet />
        </div>
        </>
    )
}