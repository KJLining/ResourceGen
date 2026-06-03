import { Link } from "react-router-dom"
 
export default function ConcessionaireSidebar() {
    return (
        <div className="bg-neutral-700 text-white w-50 p-4 flex-col fixed top-13 left-0 h-[calc(100vh-3rem)] text-center">
            <Link to="/concessionaires" className="block py-2 px-4 hover:bg-green-600 rounded">Dashboard</Link>
            <Link to="/concessionaires/list" className="block py-2 px-4 hover:bg-green-600 rounded">Concessionaires</Link>
            <Link to="/concessionaires/bills" className="block py-2 px-4 hover:bg-green-600 rounded">Bills & Payments</Link>
            <Link to="/concessionaires/documents" className="block py-2 px-4 hover:bg-green-600 rounded">Documents</Link>
            <Link to="/" className="block py-2 px-4 hover:bg-green-600 rounded">Exit</Link>
        </div>
    )
}