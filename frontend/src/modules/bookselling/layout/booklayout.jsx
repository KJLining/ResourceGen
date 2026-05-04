import { Outlet } from "react-router-dom"
import Topbar from "../../../components/topbar"
import BookSidebar from "../components/booksidebar"

export default function BookLayout(){
    return(
        <>
        <Topbar />
        <BookSidebar />
        <div className='ml-52 p-4 h-screen mt-16 overflow-y-auto'>
        <Outlet />
        </div>
        </>
    )
}