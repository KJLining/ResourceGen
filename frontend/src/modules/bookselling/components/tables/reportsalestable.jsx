import Table from "../../../../components/ui/table";

export default function ReportSalesTable({ data = [] }) {
    const columns = [
        { header: "Ctrl #", accessor: "control_number" },
        { header: "Date", accessor: "sale_date" },
        { header: "Student Name", accessor: "student_name" },
        { header: "Course & Section", accessor: "course",
            render: row => `${row.course} ${row.section}` },
        { header: "Professor", accessor: "professor_name" },
        { header: "Book Title", accessor: "book_title" },
        { header: "Amount", accessor: "amount_collected",
            render: row => `₱ ${Number(row.amount_collected).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
    ];

    const total = data.reduce((a, s) => a + Number(s.amount_collected), 0);

    return (
        <div className="bg-white rounded-md shadow">
            <div className="bg-green-700 text-white text-center py-2 rounded-t-md font-semibold">
                Sales Log
            </div>
            <Table columns={columns} data={data} size="md" width="full" />
            {data.length === 0
                ? <p className="text-center text-neutral-400 py-4 text-sm">No sales found.</p>
                : <div className="flex justify-end px-4 py-2 text-sm font-semibold border-t">
                    Total: ₱ {total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </div>
            }
        </div>
    );
}