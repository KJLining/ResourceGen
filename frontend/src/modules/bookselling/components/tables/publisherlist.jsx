import Table from "../../../../components/ui/table"
import Button from "../../../../components/ui/button"
import { Eye, PencilLine, Trash } from "lucide-react"
export default function PublisherList({ search = " "}) {
    const columns = [
        { header: "Publisher ID", accessor: "publisherId" },
        { header: "Publisher Name", accessor: "publisherName" },
        {header: "Contact Person", accessor: "contactPerson"},
        {header: "Contact Number", accessor: "contactNumber"},
        {header: "Number of Books", accessor: "numberOfBooks"},
    ]

    const data = [
        { publisherId: "P001", publisherName: "ABC Publishing", contactPerson: "John Doe", contactNumber: "123-456-7890", numberOfBooks: 50 },
        { publisherId: "P002", publisherName: "XYZ Books", contactPerson: "Jane Smith", contactNumber: "987-654-3210", numberOfBooks: 30 },
        { publisherId: "P003", publisherName: "Book World", contactPerson: "Michael Johnson", contactNumber: "555-555-5555", numberOfBooks: 20 },
        { publisherId: "P004", publisherName: "Readers' Haven", contactPerson: "Emily Davis", contactNumber: "111-222-3333", numberOfBooks: 40 },
        { publisherId: "P005", publisherName: "Literary House", contactPerson: "David Wilson", contactNumber: "444-444-4444", numberOfBooks: 25 },
        { publisherId: "P006", publisherName: "Page Turners Inc.", contactPerson: "Sarah Brown", contactNumber: "222-333-4444", numberOfBooks: 35 },
    ]

    const filteredData = data.filter((item) => {
    const query = search.toLowerCase();

    return (
        item.publisherId.toLowerCase().includes(query) ||
        item.publisherName.toLowerCase().includes(query) ||
        item.contactPerson.toLowerCase().includes(query) ||
        item.contactNumber.toLowerCase().includes(query)
    );
});

    
    return (
        <>
            <Table columns={columns} data={filteredData} size="lg" width="full" renderActions={(row)=> (
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
            )}/>
        </>
    )
}