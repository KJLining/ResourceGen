import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../../../../api"
import Button from "../../../../components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeftFromLine } from "lucide-react"

import ProfBooksTable from "../tables/ProfBooksTable"

export default function ProfDetailsPage() {
    const { id } = useParams()

    const [prof, setProf] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get(`/professors/${id}`)
            .then(res => {
                setProf(res.data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [id])

    if (loading) {
        return <p className="text-neutral-500">Loading...</p>
    }

    if (!prof) {
        return <p className="text-red-500">Professor not found.</p>
    }

    return (
        <div>
            <div className="flex flex-row">
                <h1 className="text-2xl font-bold">
                    {prof.name}
                </h1>
                <Button
                    variant="outline"
                    className="ml-auto"
                    asChild
                >
                    <Link to="/profpage" className="inline-flex">
                        <ArrowLeftFromLine className="mr-2" />
                        Back to Professors List
                    </Link>
                </Button>
            </div>


            <ProfBooksTable data={prof.books || []} />
        </div>
    )
}