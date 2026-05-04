import Table from "../../../../components/ui/table";
export default function LowStocks() {
    const columns = [
        { header: "Book Title", accessor: "bookTitle" },
        { header: "Author", accessor: "author" },
        { header: "Current Stock", accessor: "currentStock" },
    ];
    const data = [
        { bookTitle: "The Great Gatsby", author: "F. Scott Fitzgerald", currentStock: 5 },
        { bookTitle: "To Kill a Mockingbird", author: "Harper Lee", currentStock: 3 },
        { bookTitle: "1984", author: "George Orwell", currentStock: 7 },
    ];
    return (
        <>
            <div className="w-md p-4 bg-neutral-200 rounded-md shadow">
                <h2 className="text-xl font-bold mb-4 text-center">Low Stock Books</h2>
                <div className="flex justify-center">
                    <Table columns={columns} data={data} size="sm" width="fit" />
                </div>
            </div>
        </>
    )
}