import Table from "../../../../components/ui/table";

export default function ReportPublishersTable({ data = [] }) {
    const columns = [
        { header: "Publisher", accessor: "publisher_name" },
        { header: "Books Supplied", accessor: "books_supplied" },
        { header: "Total Copies Sold", accessor: "total_sold" },
        { header: "Total to Remit", accessor: "total_remittance",
            render: row => `₱ ${Number(row.total_remittance).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
    ];

    const total = data.reduce((a, p) => a + Number(p.total_remittance), 0);

    return (
        <div className="bg-white rounded-md shadow">
            <div className="bg-green-700 text-white text-center py-2 rounded-t-md font-semibold">
                Publisher Remittances
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