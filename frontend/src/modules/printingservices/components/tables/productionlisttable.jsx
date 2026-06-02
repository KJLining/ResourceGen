import Table from "../../../../components/ui/table"

export default function ProductionListTable({
    data
}) {

    const columns = [

        {
            header: "Control No",
            accessor: "control_no"
        },

        {
            header: "Course",
            accessor: "course"
        },

        {
            header: "Type",
            accessor: "document_type"
        },

        {
            header: "Members",
            accessor: "members"
        },

        {
            header: "HB",
            accessor: "hardbound_qty"
        },

        {
            header: "SB",
            accessor: "softbound_qty"
        }
    ]

    return (
        <Table
            columns={columns}
            data={data}
        />
    )
}