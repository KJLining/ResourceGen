import Table from "../../../../components/ui/table";

export default function DeliveryList({ data = [] }) {
    const columns = [
        { header: "DR / Ref No.", accessor: "reference_no" },
        { header: "Delivery Date", accessor: "delivery_date" },
        { header: "Publisher", accessor: "publisher_name" },
        { header: "Book Title", accessor: "book_title" },
        { header: "Quantity", accessor: "quantity" },
        { header: "Wholesale Price", accessor: "wholesale_price",
            render: row => `₱ ${Number(row.wholesale_price || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
    ];

    return (
        <Table columns={columns} data={data} size="lg" width="full" />
    );
}