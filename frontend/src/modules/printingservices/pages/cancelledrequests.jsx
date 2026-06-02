import { useEffect, useState } from "react"
import axios from "axios"

import PrintingRequestTable from "../components/tables/printingrequesttable"

export default function CancelledRequests() {

    const [requests, setRequests] = useState([])

    const fetchRequests = async () => {

        try {

            const res = await axios.get(
                "http://localhost:5000/api/printing-services"
            )

            const filtered = res.data.filter(
                item => item.status === "Cancelled"
            )

            setRequests(filtered)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {

        const loadData = async () => {
            await fetchRequests()
        }

        loadData()

    }, [])

    return (
        <div>

            <div className="mb-6">

                <h1 className="text-3xl font-bold">
                    Cancelled Requests
                </h1>

                <p className="text-gray-500 text-sm">
                    Cancelled or abandoned requests
                </p>

            </div>

            <PrintingRequestTable
                data={requests}
                refreshData={fetchRequests}
            />

        </div>
    )
}