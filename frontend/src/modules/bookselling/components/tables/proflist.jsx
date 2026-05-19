import Table from "../../../../components/ui/table"
import Button from "../../../../components/ui/button"
import { Eye, Trash, PencilLine } from "lucide-react"

export default function ProfList({ data = [], onEdit, onDelete, onView }) {
    const columns = [
        { header: "Professor Name", accessor: "name" },
        { header: "Department", accessor: "department" },
        { header: "Contact Number", accessor: "contact_number" },
        { header: "No. of Books Prescribed", accessor: "books_prescribed_count" },
    ]

    return (
        <div className="mt-10">
            <Table
                columns={columns}
                data={data}
                size="lg"
                width="full"
                renderActions={(row) => (
                    <div className="flex gap-2 justify-center">
                        {/* VIEW (now uses navigate from parent) */}
                        <Button
                            variant="primary"
                            className="inline-flex items-center"
                            onClick={() => onView(row)}
                        >
                            <Eye className="mr-2" />
                            View
                        </Button>

                        {/* EDIT */}
                        <Button
                            variant="outline"
                            className="inline-flex items-center"
                            onClick={() => onEdit(row)}
                        >
                            <PencilLine className="mr-2" />
                            Edit
                        </Button>

                        {/* DELETE */}
                        <Button
                            variant="danger"
                            className="inline-flex items-center"
                            onClick={() => onDelete(row)}
                        >
                            <Trash className="mr-2" />
                            Delete
                        </Button>
                    </div>
                )}
            />
        </div>
    )
}