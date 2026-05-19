import Table from "../../../../components/ui/table"

export default function SalesbyProf({ data = [] }) {
    const columns = [
        { header: "Professor Name", accessor: "professor_name" },
        { 
            header: "Total Sales", 
            accessor: "total_sales",
            render: (row) => `₱ ${Number(row.total_sales).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
        },
        { header: "Books Sold", accessor: "books_sold" },
    ];

    return (
        <div className="w-md p-2 bg-neutral-200 rounded-md shadow">
            <h2 className="text-xl font-bold mb-4 text-center">Sales by Professor</h2>
            <div className="flex justify-center">
                <Table columns={columns} data={data} size="md" width="fit" />
            </div>
        </div>
    )
}