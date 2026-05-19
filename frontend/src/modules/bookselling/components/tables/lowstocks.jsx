import Table from "../../../../components/ui/table";

export default function LowStocks({ data = [] }) {
    const columns = [
        { header: "Book Title", accessor: "book_title" },
        { header: "Publisher", accessor: "publisher_name" },
        { header: "Current Stock", accessor: "current_stock" },
    ];

    return (
        <div className="w-md p-4 bg-neutral-200 rounded-md shadow">
            <h2 className="text-xl font-bold mb-4 text-center">Low Stock Books</h2>
            <div className="flex justify-center">
                <Table columns={columns} data={data} size="sm" width="fit" />
            </div>
        </div>
    )
}