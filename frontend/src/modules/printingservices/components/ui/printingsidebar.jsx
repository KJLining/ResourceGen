import { Link } from "react-router-dom"

export default function PrintingSidebar() {
    return (
        <div className="bg-neutral-700 text-white w-50 p-4 flex-col fixed top-13 left-0 h-[calc(100vh-3rem)] text-center">

            <Link
                to="/printingdashboard"
                className="block py-2 px-4 hover:bg-green-600 rounded"
            >
                Dashboard
            </Link>

            <Link
                to="/allrequests"
                className="block py-2 px-4 hover:bg-green-600 rounded"
            >
                All Requests
            </Link>

            <Link
                to="/receivedrequests"
                className="block py-2 px-4 hover:bg-green-600 rounded"
            >
                Received Requests
            </Link>
            <Link
                to="/forbinding"
                className="block py-2 px-4 hover:bg-green-600 rounded"
            >
                For Binding
            </Link>

            <Link
                to="/readyforpickup"
                className="block py-2 px-4 hover:bg-green-600 rounded"
            >
                Ready For Pickup
            </Link>

            <Link
                to="/claimedrequests"
                className="block py-2 px-4 hover:bg-green-600 rounded"
            >
                Claimed Requests
            </Link>

            <Link
                to="/cancelledrequests"
                className="block py-2 px-4 hover:bg-green-600 rounded"
            >
                Cancelled Requests
            </Link>
            
            <Link to="/printinglists" className="block py-2 px-4 hover:bg-green-600 rounded">
                Printing Lists
            </Link>
            <Link to ="/claiminglist" className="block py-2 px-4 hover:bg-green-600 rounded">
                Claiming List
            </Link>
            <Link
                to="/printingreports"
                className="block py-2 px-4 hover:bg-green-600 rounded"
            >
                Reports
            </Link>
            <Link to="/" className="block py-2 px-4 hover:bg-green-600 rounded">
                Back to Home
            </Link>


        </div>
    )
}