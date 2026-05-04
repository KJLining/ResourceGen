import Table from "../../../../components/ui/table"
import Button from "../../../../components/ui/button"
import { Eye, Trash, PencilLine } from "lucide-react"

export default function ProfList() {
    const columns = [
        {header: "Professor Name" , accessor: "professorName"},
        {header: "Department", accessor: "department"},
        {header: "Contact Number", accessor: "contactNumber"},
    ]
    const data = [
        {professorName: "Dr. Smith", department: "Computer Science", contactNumber: "123-456-7890"},
        {professorName: "Dr. Johnson", department: "Mathematics", contactNumber: "987-654-3210"},
        {professorName: "Dr. Lee", department: "Physics", contactNumber: "555-555-5555"},
        {professorName: "Dr. Brown", department: "Chemistry", contactNumber: "111-222-3333"},
        {professorName: "Dr. Davis", department: "Biology", contactNumber: "444-444-4444"},
        {professorName: "Dr. Wilson", department: "History", contactNumber: "222-333-4444"},
        {professorName: "Dr. Taylor", department: "Literature", contactNumber: "333-444-5555"}
    ]
    return(
        <>
            <div className="mt-10">
                <Table columns={columns} data={data} size="lg" width="full" renderActions={(row) =>
                    (
                        <div className="flex gap-2 justify-center">
                            <Button variant="primary" className="inline-flex">
                                <Eye className="mr-2" />
                                View
                            </Button>
                            <Button variant="outline" className="inline-flex">
                                <PencilLine className="mr-2" />
                                Edit
                            </Button>
                            <Button variant="danger" className="inline-flex">
                                <Trash className="mr-2" />
                                Delete
                            </Button>
                        </div>
                    )
                } />
            </div>
        </>
    )
}