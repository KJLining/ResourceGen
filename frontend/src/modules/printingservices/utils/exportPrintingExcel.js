import * as XLSX from "xlsx"

export function exportPrintingExcel({
    groupedData,
    summaryData,
}) {

    const wb = XLSX.utils.book_new()

    groupedData.forEach(group => {

        if (group.requests.length === 0) return

        const rows = [

            [group.course],
            [],

            [
                "NO.",
                "CONTROL NO.",
                "MEMBERS",
                "COURSE",
                "HB",
                "SB",
            ],

            ...group.requests.map(
                (item, index) => [

                    index + 1,

                    item.control_no,

                    item.members,

                    item.course,

                    Number(item.hardbound_qty || 0),

                    Number(item.softbound_qty || 0),

                ]
            ),

            [],

            [
                "",
                "",
                "",
                "TOTAL",

                group.requests.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.hardbound_qty || 0
                        ),
                    0
                ),

                group.requests.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.softbound_qty || 0
                        ),
                    0
                ),

            ],

        ]

        const ws =
            XLSX.utils.aoa_to_sheet(rows)

        ws["!cols"] = [
            { wch: 8 },
            { wch: 15 },
            { wch: 50 },
            { wch: 12 },
            { wch: 8 },
            { wch: 8 },
        ]

        XLSX.utils.book_append_sheet(
            wb,
            ws,
            group.course
        )

    })

    const summaryRows = [

        ["SUMMARY"],
        [],

        [
            "COURSE",
            "HARDBOUND",
            "SOFTBOUND",
        ],

        ...summaryData.map(item => [

            item.course,

            item.hardbound,

            item.softbound,

        ]),

        [],

        [
            "TOTAL",

            summaryData.reduce(
                (sum, item) =>
                    sum + item.hardbound,
                0
            ),

            summaryData.reduce(
                (sum, item) =>
                    sum + item.softbound,
                0
            ),
        ],

    ]

    const summarySheet =
        XLSX.utils.aoa_to_sheet(summaryRows)

    summarySheet["!cols"] = [
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
    ]

    XLSX.utils.book_append_sheet(
        wb,
        summarySheet,
        "SUMMARY"
    )

    XLSX.writeFile(
        wb,
        `Printing_List_${
            new Date()
                .toISOString()
                .slice(0, 10)
        }.xlsx`
    )
}