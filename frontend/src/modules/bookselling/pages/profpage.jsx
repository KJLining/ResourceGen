import Button from "../../../components/ui/button"
import ProfList from "../components/tables/proflist"
import { ArrowLeftFromLine, Plus } from "lucide-react"
import { Link } from "react-router-dom"
export default function ProfPage() {
    return (
        <>
        <div className="flex justify-evenly items-center">
            <Link to="/inventory">
                <Button variant="outline" className="inline-flex items-center">
                    <ArrowLeftFromLine className="mr-2" />
                    Back to Inventory
                </Button>
            </Link>
            <h1 className="text-2xl font-bold">Professors List</h1>
            <Button variant="primary" className="inline-flex items-center">
                <Plus className="mr-2" />
                Add Professor
            </Button>

        </div>
        <ProfList />
        </>
    )
}