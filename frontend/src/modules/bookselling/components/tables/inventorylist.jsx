import Table from "../../../../components/ui/table";
import Button from "../../../../components/ui/button";
import { Eye, PencilLine, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InventoryList({ data = [], onEdit, onDelete }) {
    const navigate = useNavigate();

    const columns = [
        { header: "Title", accessor: "title" },
        { header: "Publisher", accessor: "publisher_name" },
        { header: "Selling Price", accessor: "selling_price",
            render: row => `₱ ${Number(row.selling_price || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
        { header: "Prof. Comm.", accessor: "professor_commission",
            render: row => `₱ ${Number(row.professor_commission || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
        { header: "School Comm.", accessor: "school_commission",
            render: row => `${row.school_commission || 0}%` },
        { header: "Books Sold", accessor: "total_sold" },
        { header: "On Hand", accessor: "stock_quantity",
            render: row => (
                <span className={Number(row.stock_quantity) < 10 ? "text-red-500 font-semibold" : ""}>
                    {row.stock_quantity}
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
                    <Button variant="primary" className="inline-flex"
                        onClick={() => navigate(`/bookdetail/${row.id}`)}>
                        <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                    <Button variant="outline" className="inline-flex"
                        onClick={() => onEdit(row)}>
                        <PencilLine className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="danger" className="inline-flex"
                        onClick={() => onDelete(row)}>
                        <Trash className="w-4 h-4 mr-2" /> Delete
                    </Button>
                </div>
            )}
        />
    );
}