import { Link } from "react-router-dom"
export default function BookSidebar() {
    return (
        <div className="bg-neutral-700 text-white w-50 p-4 flex-col fixed top-13 left-0 h-[calc(100vh-3rem)] text-center">
            <Link to="/bookdashboard" className="block py-2 px-4 hover:bg-green-600 rounded">Dashboard</Link>
            <Link to="/profpage" className="block py-2 px-4 hover:bg-green-600 rounded">Professors List</Link>
            <Link to="/publisherpage" className="block py-2 px-4 hover:bg-green-600 rounded">Publishers List</Link>
            <Link to="/inventory" className="block py-2 px-4 hover:bg-green-600 rounded">Inventory</Link>
            <Link to="/buybook" className="block py-2 px-4 hover:bg-green-600 rounded">Buy Book</Link>
            <Link to="/reports" className="block py-2 px-4 hover:bg-green-600 rounded">Reports</Link>
            <Link to="/remittances" className="block py-2 px-4 hover:bg-green-600 rounded">Remittances</Link>
            <Link to="/" className="block py-2 px-4 hover:bg-green-600 rounded">Exit</Link>
        </div>
    )
}