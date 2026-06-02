import { useEffect, useState } from "react"
import axios from "axios"

import Button from "../../../components/ui/button"
import Table from "../../../components/ui/table"

import {
    exportPrintingExcel
}
from "../utils/exportPrintingExcel"

import {
    exportPrintingPDF
}
from "../utils/exportPrintingPdf"

export default function PrintingLists() {

    const [activeTab, setActiveTab] = useState("details")
    const [requests, setRequests] = useState([])

    const courses = [
        "BSIT",
        "BSCS",
        "BSEd",
        "BEEd",
        "BECE",
        "BSBA",
        "BENT",
        "BSHM",
        "BSOA",
        "BAJOURN",
        "BSPSYCH",
    ]

    const fetchRequests = async () => {

        try {

            const res = await axios.get(
                "http://localhost:5000/api/printing-services"
            )

            const filtered = res.data.filter(
                item =>
                    item.status === "For Binding" ||
                    item.status === "Ready for Pickup"
            )

            setRequests(filtered)

        } catch (err) {

            console.log(err)

        }

    }

    useEffect(() => {

        fetchRequests()

    }, [])

    const groupedData = courses.map(course => ({
        course,
        requests: requests.filter(
            item => item.course === course
        )
    }))

    const summaryData = courses
        .map(course => {

            const records = requests.filter(
                item => item.course === course
            )

            const hardbound = records.reduce(
                (sum, item) =>
                    sum + Number(item.hardbound_qty || 0),
                0
            )

            const softbound = records.reduce(
                (sum, item) =>
                    sum + Number(item.softbound_qty || 0),
                0
            )

            return {
                course,
                hardbound,
                softbound,
            }

        })
        .filter(
            item =>
                item.hardbound > 0 ||
                item.softbound > 0
        )

    const grandHB = summaryData.reduce(
        (sum, item) => sum + item.hardbound,
        0
    )

    const grandSB = summaryData.reduce(
        (sum, item) => sum + item.softbound,
        0
    )

    return (

        <div>

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold">
                        Printing Lists
                    </h1>

                    <p className="text-gray-500">
                        Printable lists for printing services
                    </p>

                </div>

<div className="flex gap-2">

    <Button
        onClick={() =>
            exportPrintingExcel({
                groupedData,
                summaryData,
            })
        }
    >
        Export Excel
    </Button>

    <Button
        variant="outline"
        onClick={() =>
            exportPrintingPDF(
                groupedData,
                summaryData
            )
        }
    >
        Export PDF
    </Button>

</div>

            </div>

            <div className="flex gap-2 mb-6">

                <Button
                    variant={
                        activeTab === "details"
                            ? "primary"
                            : "secondary"
                    }
                    onClick={() =>
                        setActiveTab("details")
                    }
                >
                    Detailed List
                </Button>

                <Button
                    variant={
                        activeTab === "summary"
                            ? "primary"
                            : "secondary"
                    }
                    onClick={() =>
                        setActiveTab("summary")
                    }
                >
                    Summary
                </Button>

            </div>

            {activeTab === "details" && (

                <div className="space-y-10">

                    {groupedData.map(group => {

                        if (
                            group.requests.length === 0
                        )
                            return null

                        const tableData =
                            group.requests.map(
                                (item, index) => ({

                                    no: index + 1,

                                    control_no:
                                        item.control_no,

                                    members:
                                        item.members,

                                    course:
                                        item.course,

                                    hardbound_qty:
                                        item.hardbound_qty,

                                    softbound_qty:
                                        item.softbound_qty,

                                })
                            )

                        return (

                            <div
                                key={group.course}
                                className="bg-white border rounded-xl p-4"
                            >

                                <h2 className="text-xl font-bold mb-4 text-green-700">
                                    {group.course}
                                </h2>

                                <Table
                                    width="full"
                                    columns={[

                                        {
                                            header: "No.",
                                            accessor: "no",
                                        },

                                        {
                                            header: "Control No",
                                            accessor: "control_no",
                                        },

                                        {
                                            header: "Members",
                                            accessor: "members",
                                        },

                                        {
                                            header: "Course",
                                            accessor: "course",
                                        },

                                        {
                                            header: "HB",
                                            accessor: "hardbound_qty",
                                        },

                                        {
                                            header: "SB",
                                            accessor: "softbound_qty",
                                        },

                                    ]}
                                    data={tableData}
                                />

                                <div className="mt-4 text-sm">

                                    <strong>
                                        Total Requests:
                                    </strong>
                                    {" "}
                                    {group.requests.length}

                                    <br />

                                    <strong>
                                        Total HB:
                                    </strong>
                                    {" "}
                                    {group.requests.reduce(
                                        (sum, item) =>
                                            sum +
                                            Number(
                                                item.hardbound_qty || 0
                                            ),
                                        0
                                    )}

                                    <br />

                                    <strong>
                                        Total SB:
                                    </strong>
                                    {" "}
                                    {group.requests.reduce(
                                        (sum, item) =>
                                            sum +
                                            Number(
                                                item.softbound_qty || 0
                                            ),
                                        0
                                    )}

                                </div>

                            </div>

                        )

                    })}

                </div>

            )}

            {activeTab === "summary" && (

                <div className="bg-white border rounded-xl p-4">

                    <h2 className="text-xl font-bold mb-4">
                        Summary
                    </h2>

                    <Table
                        width="full"
                        columns={[

                            {
                                header: "Course",
                                accessor: "course",
                            },

                            {
                                header: "Hardbound",
                                accessor: "hardbound",
                            },

                            {
                                header: "Softbound",
                                accessor: "softbound",
                            },

                        ]}
                        data={summaryData}
                    />

                    <div className="mt-6 border-t pt-4">

                        <p>
                            <strong>
                                Grand Total Hardbound:
                            </strong>
                            {" "}
                            {grandHB}
                        </p>

                        <p>
                            <strong>
                                Grand Total Softbound:
                            </strong>
                            {" "}
                            {grandSB}
                        </p>

                    </div>

                </div>

            )}

        </div>

    )

}