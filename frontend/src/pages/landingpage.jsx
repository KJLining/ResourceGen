import { Link } from "react-router-dom"
import Topbar from "../components/topbar"
import Button from "../components/ui/button"
import { Book, Printer, UserRound, Store, Banknote } from "lucide-react"
export default function LandingPage() {
    return (
        <>
            <Topbar />
            <h1 className="text-3xl text-center mt-20">Welcome Admin</h1>
            <div className="mt-10 flex justify-center">
                <div className=" flex flex-col space-y-10">
                    <Link to="/bookdashboard">
                        <Button variant="primary" className="flex justify-center items-center gap-2 w-md">
                            <Book size={20} />
                            <span className="text-2xl">Book Selling</span>
                        </Button>
                    </Link>
                    <Link to="/printingdashboard">
                        <Button variant="primary" className="flex justify-center items-center gap-2 w-md">
                            <Printer size={20} />
                            <span className="text-2xl">Printing Services</span>
                        </Button>
                    </Link>
                    <Link to="/concessionairelist">
                        <Button variant="primary" className="flex justify-center items-center gap-2 w-md">
                            <UserRound size={20} />
                            <span className="text-2xl">Concessionaires</span>
                        </Button>
                    </Link>
                    <Link to="/rentdashboard">
                        <Button variant="primary" className="flex justify-center items-center gap-2 w-md">
                            <Store size={20} />
                            <span className="text-2xl">Rentals</span>
                        </Button>
                    </Link>
                    <Link to="/igpdashboard">
                        <Button variant="primary" className="flex justify-center items-center gap-2 w-md">
                            <Banknote size={20} />
                            <span className="text-2xl">Department IGP</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    )
}