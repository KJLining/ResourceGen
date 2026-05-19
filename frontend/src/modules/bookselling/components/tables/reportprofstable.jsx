import Table from "../../../../components/ui/table";

export default function ReportProfsTable({ data = [] }) {
    const columns = [
        { header: "Professor", accessor: "professor_name" },
        { header: "Books Prescribed", accessor: "books_prescribed" },
        { header: "Total Copies Sold", accessor: "total_sold" },
        { header: "Total Commission", accessor: "total_commission",
            render: row => `₱ ${Number(row.total_commission).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
    ];

    const total = data.reduce((a, p) => a + Number(p.total_commission), 0);

    return (
        <div className="bg-white rounded-md shadow">
            <div className="bg-green-700 text-white text-center py-2 rounded-t-md font-semibold">
                Professor Commissions
            </div>
            <Table columns={columns} data={data} size="md" width="full" />
            {data.length === 0
                ? <p className="text-center text-neutral-400 py-4 text-sm">No data found.</p>
                : <div className="flex justify-end px-4 py-2 text-sm font-semibold border-t">
                    Total: ₱ {total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </div>
            }
        </div>
    );
}