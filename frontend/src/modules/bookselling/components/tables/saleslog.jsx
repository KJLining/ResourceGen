import Table from "../../../../components/ui/table";
import Button from "../../../../components/ui/button";
import { PencilLine, Trash } from "lucide-react";

export default function SalesLog({ data = [], onEdit, onDelete }) {
    const columns = [
        { header: "Ctrl #", accessor: "control_number" },
        { header: "Date", accessor: "sale_date" },
        { header: "Student Name", accessor: "student_name" },
        { header: "Course", accessor: "course",
            render: row => `${row.course} ${row.section}` },
        { header: "Prof Name", accessor: "professor_name" },
        { header: "Book Name", accessor: "book_title" },
        { header: "Amount", accessor: "amount_collected",
            render: row => `₱ ${Number(row.amount_collected).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
    ];

    return (
        <Table
            columns={columns}
            data={data}
            size="md"
            width="full"
            renderActions={(row) => (
                <div className="flex gap-2 justify-center">
                    <Button variant="outline" className="inline-flex"
                        onClick={() => onEdit(row)}>
                        <PencilLine className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="danger" className="inline-flex"
                        onClick={() => onDelete(row)}>
                        <Trash className="w-4 h-4 mr-1" /> Remove
                    </Button>
                </div>
            )}
        />
    );
}