import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export const exportPrintingPDF = (
    groupedData,
    summaryData
) => {

    const doc = new jsPDF(
        "p",
        "mm",
        "a4"
    )

    doc.setFontSize(16)

    doc.text(
        "PRINTING SERVICES LIST",
        14,
        15
    )

    let startY = 25

    groupedData.forEach(group => {

        if (
            group.requests.length === 0
        ) {
            return
        }

        doc.setFontSize(12)

        doc.text(
            group.course,
            14,
            startY
        )

        autoTable(doc, {

            startY:
                startY + 4,

            head: [[
                "No",
                "Control No",
                "Members",
                "HB",
                "SB"
            ]],

            body:
                group.requests.map(
                    (
                        item,
                        index
                    ) => [

                        index + 1,
                        item.control_no,
                        item.members,
                        item.hardbound_qty,
                        item.softbound_qty

                    ]
                )

        })

        startY =
            doc.lastAutoTable.finalY + 10

        if (
            startY > 250
        ) {

            doc.addPage()

            startY = 20

        }

    })

    doc.addPage()

    doc.text(
        "SUMMARY",
        14,
        15
    )

    autoTable(doc, {

        startY: 25,

        head: [[
            "Course",
            "HB",
            "SB"
        ]],

        body:
            summaryData.map(
                item => [

                    item.course,
                    item.hardbound,
                    item.softbound

                ]
            )

    })

    doc.save(
        `Printing_List_${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`
    )
}