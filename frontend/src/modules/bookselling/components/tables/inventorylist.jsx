import Table from "../../../../components/ui/table"
import Button from "../../../../components/ui/button"
import { Eye, PencilLine, Trash } from "lucide-react"
export default function InventoryList() {
    const columns = [
        { header: "Book ID", accessor: "bookId" },
        { header: "Quantity", accessor: "quantity" },
        { header: "Title", accessor: "title" },
        {header: "Publisher", accessor: "publisher"},
        {header: "Price", accessor: "price"},
        {header: "Books Sold", accessor: "booksSold"},
        {header: "On Hand", accessor: "onHand"},
        {header: "Total Sales", accessor: "totalSales"},
    ]
    const data = [
        { bookId: "B001", quantity: 100, title: "Introduction to Algorithms", publisher: "MIT Press", price: 50.00, booksSold: 30, onHand: 70, totalSales: 1500.00 },
        { bookId: "B002", quantity: 50, title: "Clean Code", publisher: "Prentice Hall", price: 40.00, booksSold: 20, onHand: 30, totalSales: 800.00 },
        { bookId: "B003", quantity: 80, title: "The Pragmatic Programmer", publisher: "Addison-Wesley", price: 45.00, booksSold: 25, onHand: 55, totalSales: 1125.00 },
        { bookId: "B004", quantity: 60, title: "Design Patterns", publisher: "Addison-Wesley", price: 55.00, booksSold: 15, onHand: 45, totalSales: 825.00 },
        { bookId: "B005", quantity: 120, title: "JavaScript: The Good Parts", publisher: "O'Reilly Media", price: 35.00, booksSold: 40, onHand: 80, totalSales: 1400.00 },
        { bookId: "B006", quantity: 90, title: "Eloquent JavaScript", publisher: "No Starch Press", price: 30.00, booksSold: 35, onHand: 55, totalSales: 1050.00 },
    ]
    return (
        <>
            <Table columns={columns} data={data} renderActions={(row)=>(
                <div className="flex gap-2 justify-center">
                    <Button variant="primary" className="inline-flex">
                        <Eye className="w-4 h-4 mr-2" />
                        View 
                    </Button>
                    <Button variant="outline" className="inline-flex">
                        <PencilLine className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="danger" className="inline-flex">
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            )} />
        </>
    )
}