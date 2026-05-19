import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftFromLine } from "lucide-react";
import Button from "../../../../components/ui/button";
import Table from "../../../../components/ui/table";
import api from "../../../../api";

export default function BookDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/books/${id}`)
            .then(res => setBook(res.data))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="text-neutral-500 p-4">Loading...</p>;
    if (!book) return <p className="text-red-500 p-4">Book not found.</p>;

    const rateColumns = [
        { header: "Effective Date", accessor: "effective_date" },
        { header: "Selling Price", accessor: "selling_price",
            render: row => `₱ ${Number(row.selling_price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
        { header: "Wholesale Price", accessor: "wholesale_price",
            render: row => `₱ ${Number(row.wholesale_price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
        { header: "Prof. Comm.", accessor: "professor_commission",
            render: row => `₱ ${Number(row.professor_commission).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
        { header: "School Comm.", accessor: "school_commission",
            render: row => `${row.school_commission}%` },
    ];

    const profColumns = [
        { header: "Professor", accessor: "name" },
        { header: "Department", accessor: "department" },
    ];

    return (
        <div className="p-2 space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
                <Button variant="outline" className="inline-flex items-center"
                    onClick={() => navigate('/inventory')}>
                    <ArrowLeftFromLine className="mr-2" size={16} /> Back
                </Button>
                <h1 className="text-2xl font-bold">{book.title}</h1>
            </div>

            {/* Info row */}
            <div className="flex gap-6 text-sm text-neutral-600 flex-wrap">
                <span><span className="font-medium">Publisher:</span> {book.publisher_name || '—'}</span>
                <span><span className="font-medium">ISBN:</span> {book.isbn || '—'}</span>
                <span><span className="font-medium">Stock on hand:</span>
                    <span className={Number(book.stock_quantity) < 10 ? " text-red-500 font-semibold" : ""}>
                        {" "}{book.stock_quantity}
                    </span>
                </span>
                <span><span className="font-medium">Total sold:</span> {book.total_sold || 0}</span>
            </div>

            {/* Rate history */}
            <div className="bg-white rounded-md shadow">
                <div className="bg-green-700 text-white text-center py-2 rounded-t-md font-semibold">
                    Rate History
                </div>
                <Table columns={rateColumns} data={book.rates || []} size="lg" width="full" />
                {(!book.rates || book.rates.length === 0) && (
                    <p className="text-center text-neutral-400 py-6 text-sm">No rates set yet.</p>
                )}
            </div>

            {/* Prescribed professors */}
            <div className="bg-white rounded-md shadow">
                <div className="bg-green-700 text-white text-center py-2 rounded-t-md font-semibold">
                    Prescribed by Professors
                </div>
                <Table columns={profColumns} data={book.professors || []} size="lg" width="full" />
                {(!book.professors || book.professors.length === 0) && (
                    <p className="text-center text-neutral-400 py-6 text-sm">No professors assigned yet.</p>
                )}
            </div>
        </div>
    );
}