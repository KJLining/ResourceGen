import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftFromLine } from "lucide-react";
import Button from "../../../../components/ui/button";
import Table from "../../../../components/ui/table";
import api from "../../../../api";

export default function PublisherDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [publisher, setPublisher] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/publishers/${id}`)
            .then(res => setPublisher(res.data))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="text-neutral-500 p-4">Loading...</p>;
    if (!publisher) return <p className="text-red-500 p-4">Publisher not found.</p>;

    const columns = [
        { header: "Book Title", accessor: "title" },
        { header: "Stock", accessor: "stock_quantity" },
        { header: "Selling Price", accessor: "selling_price",
            render: (row) => `₱ ${Number(row.selling_price || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
        { header: "Wholesale Price", accessor: "wholesale_price",
            render: (row) => `₱ ${Number(row.wholesale_price || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
        { header: "Copies Sold", accessor: "copies_sold" },
        { header: "Unpaid Remittance", accessor: "unpaid_remittance",
            render: (row) => `₱ ${Number(row.unpaid_remittance || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
        { header: "Paid Remittance", accessor: "paid_remittance",
            render: (row) => `₱ ${Number(row.paid_remittance || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
    ];

    return (
        <div className="p-2">
            <h1 className="text-2xl font-bold mb-2">{publisher.name}</h1>

            <div className="flex items-center gap-4 mb-6 flex-wrap">
                <Button variant="outline" className="inline-flex items-center" onClick={() => navigate('/publisherpage')}>
                    <ArrowLeftFromLine className="mr-2" size={16} /> Back
                </Button>
                <div className="flex gap-6 text-sm text-neutral-600 flex-wrap">
                    <span><span className="font-medium">Contact Person:</span> {publisher.contact_person || '—'}</span>
                    <span><span className="font-medium">Phone:</span> {publisher.phone || '—'}</span>
                    <span><span className="font-medium">Email:</span> {publisher.email || '—'}</span>
                    <span><span className="font-medium">Address:</span> {publisher.address || '—'}</span>
                </div>
            </div>

            <div className="bg-white rounded-md shadow">
                <div className="bg-green-700 text-white text-center py-2 rounded-t-md font-semibold">
                    Books Supplied
                </div>
                <Table
                    columns={columns}
                    data={publisher.books || []}
                    size="lg"
                    width="full"
                />
                {(!publisher.books || publisher.books.length === 0) && (
                    <p className="text-center text-neutral-400 py-6 text-sm">No books supplied yet.</p>
                )}
            </div>
        </div>
    );
}