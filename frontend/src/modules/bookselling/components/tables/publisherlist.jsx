import Table from "../../../../components/ui/table";
import Button from "../../../../components/ui/button";
import { Eye, PencilLine, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PublisherList({ data = [], onEdit, onDelete }) {
    const navigate = useNavigate();

    const columns = [
        { header: "Publisher Name", accessor: "name" },
        { header: "Contact Person", accessor: "contact_person" },
        { header: "Phone", accessor: "phone" },
        { header: "Email", accessor: "email" },
        { header: "No. of Books", accessor: "book_count" },
    ];

    return (
        <Table
            columns={columns}
            data={data}
            size="lg"
            width="full"
            renderActions={(row) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        variant="primary"
                        className="inline-flex"
                        onClick={() => navigate(`/publisherdetail/${row.id}`)}
                    >
                        <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                    <Button
                        variant="outline"
                        className="inline-flex"
                        onClick={() => onEdit(row)}
                    >
                        <PencilLine className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                        variant="danger"
                        className="inline-flex"
                        onClick={() => onDelete(row)}
                    >
                        <Trash className="w-4 h-4 mr-2" /> Delete
                    </Button>
                </div>
            )}
        />
    );
}