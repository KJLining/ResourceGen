import Table from "../../../../components/ui/table";

export default function SchoolCommissionTable({ data = [] }) {
    const columns = [
        { header: "Ctrl #", accessor: "sale_id" },
        { header: "Sale Date", accessor: "sale_date" },
        { header: "Book", accessor: "book_title" },
        { header: "Rate", accessor: "commission_rate",
            render: row => `${row.commission_rate}%` },
        { header: "Commission", accessor: "commission_amount",
            render: row => `₱ ${Number(row.commission_amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
        { header: "Status", accessor: "status",
            render: row => (
                <span className="inline-block text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                    Collected
                </span>
            )},
    ];

    const total = data.reduce((a, r) => a + Number(r.commission_amount), 0);

    return (
        <div className="bg-white rounded-md shadow">
            <div className="bg-green-700 text-white text-center py-2 rounded-t-md font-semibold">
                School Commission
            </div>
            <Table columns={columns} data={data} size="md" width="full" />
            {data.length === 0
                ? <p className="text-center text-neutral-400 py-4 text-sm">No records found.</p>
                : <div className="flex justify-end px-4 py-2 text-sm font-semibold border-t text-green-700">
                    Total Collected: ₱ {total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </div>
            }
        </div>
    );
}