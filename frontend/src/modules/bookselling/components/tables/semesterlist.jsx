import Table from "../../../../components/ui/table";
import Button from "../../../../components/ui/button";
import { PencilLine, Trash, CheckCircle } from "lucide-react";

export default function SemesterList({ data = [], onEdit, onDelete, onSetActive }) {
    const columns = [
        { header: "Label", accessor: "label" },
        { header: "Semester", accessor: "semester" },
        { header: "School Year", accessor: "school_year" },
        { header: "Start Date", accessor: "start_date" },
        { header: "End Date", accessor: "end_date" },
        {
            header: "Status", accessor: "is_active",
            render: row => (
                <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                    row.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-neutral-100 text-neutral-500'
                }`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        },
    ];

    return (
        <Table
            columns={columns}
            data={data}
            size="lg"
            width="full"
            renderActions={(row) => (
                <div className="flex gap-2 justify-center">
                    {!row.is_active && (
                        <Button variant="outline" className="inline-flex text-green-700 border-green-600 hover:bg-green-50"
                            onClick={() => onSetActive(row)}>
                            <CheckCircle className="w-4 h-4 mr-1" /> Set Active
                        </Button>
                    )}
                    <Button variant="outline" className="inline-flex"
                        onClick={() => onEdit(row)}>
                        <PencilLine className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="danger" className="inline-flex"
                        onClick={() => onDelete(row)}>
                        <Trash className="w-4 h-4 mr-1" /> Delete
                    </Button>
                </div>
            )}
        />
    );
}