import Table from "../../../../components/ui/table"

export default function ProfBooksTable({ data = [] }) {
    const columns = [
        {
            header: "Delivery ID",
            accessor: "delivery_id",
        },
        {
            header: "Book Title",
            accessor: "title",
        },
        {
            header: "Price",
            accessor: "price",
        },
        {
            header: "Sold",
            accessor: "sold_count",
        },
        {
            header: "Unpaid Commission",
            accessor: "unpaid_commission",
        },
        {
            header: "Paid Commission",
            accessor: "paid_commission",
        },
    ]

    return (
        <div className="mt-6">
            <Table
                columns={columns}
                data={data}
                size="md"
                width="full"
            />
        </div>
    )
}