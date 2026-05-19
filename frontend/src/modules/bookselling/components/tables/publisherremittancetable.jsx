import Table from "../../../../components/ui/table";
import Button from "../../../../components/ui/button";

export default function PublisherRemittanceTable({ data = [], onMarkPaid }) {
    const columns = [
        { header: "Ctrl #", accessor: "sale_id" },
        { header: "Sale Date", accessor: "sale_date" },
        { header: "Publisher", accessor: "publisher_name" },
        { header: "Book", accessor: "book_title" },
        { header: "Remittance", accessor: "remittance_amount",
            render: row => `₱ ${Number(row.remittance_amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
        { header: "Status", accessor: "status",
            render: row => (
                <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                    row.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                }`}>
                    {row.status === 'paid' ? 'Paid' : 'Unpaid'}
                </span>
            )},
        { header: "Date Paid", accessor: "date_paid",
            render: row => row.date_paid || '—' },
        { header: "Mode", accessor: "mode_of_payment",
            render: row => row.mode_of_payment || '—' },
    ];

    const totalUnpaid = data
        .filter(r => r.status === 'unpaid')
        .reduce((a, r) => a + Number(r.remittance_amount), 0);

    return (
        <div className="bg-white rounded-md shadow">
            <div className="bg-green-700 text-white text-center py-2 rounded-t-md font-semibold">
                Publisher Remittances
            </div>
            <Table
                columns={columns}
                data={data}
                size="md"
                width="full"
                renderActions={(row) => (
                    <div className="flex justify-center">
                        {row.status === 'unpaid'
                            ? <Button variant="primary" className="text-xs py-1 px-3"
                                onClick={() => onMarkPaid(row)}>
                                Mark as Paid
                            </Button>
                            : <span className="text-xs text-neutral-400">—</span>
                        }
                    </div>
                )}
            />
            {data.length === 0
                ? <p className="text-center text-neutral-400 py-4 text-sm">No records found.</p>
                : <div className="flex justify-end px-4 py-2 text-sm font-semibold border-t text-yellow-700">
                    Total Unpaid: ₱ {totalUnpaid.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </div>
            }
        </div>
    );
}