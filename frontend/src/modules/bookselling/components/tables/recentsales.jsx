import Table from "../../../../components/ui/table";

export default function RecentSales() {
    const columns = [
        { header: "Sem", accessor: "sem" },
        { header: "Date", accessor: "date" },
        { header: "Control Number", accessor: "controlNumber" },
        { header: "Name", accessor: "name" },
        { header: "Course", accessor: "course" },
        { header: "Book Title", accessor: "bookTitle" },
        { header: "Prof", accessor: "prof" },
    ];
    const data = [
        { sem: "1st Sem", date: "2024-06-01", controlNumber: "12345", name: "John Doe", course: "BSCS", bookTitle: "Introduction to Programming", prof: "Dr. Smith" },
        { sem: "1st Sem", date: "2024-06-02", controlNumber: "12346", name: "Jane Doe", course: "BSIT", bookTitle: "Data Structures and Algorithms", prof: "Dr. Johnson" },
        { sem: "1st Sem", date: "2024-06-03", controlNumber: "12347", name: "Alice Smith", course: "BSCS", bookTitle: "Database Systems", prof: "Dr. Lee" },
        { sem: "1st Sem", date: "2024-06-03", controlNumber: "12347", name: "Alice Smith", course: "BSCS", bookTitle: "Database Systems", prof: "Dr. Lee" },
        { sem: "1st Sem", date: "2024-06-03", controlNumber: "12347", name: "Alice Smith", course: "BSCS", bookTitle: "Database Systems", prof: "Dr. Lee" },
    ];
    
    return (
        <>
            <div className="w-full h-fit p-2 bg-neutral-200 rounded-md shadow">
                <h2 className="text-xl font-bold mb-4 text-center">Recent Sales</h2>
                <div className="flex justify-center">
                    <Table columns={columns} data={data} size="md" width="fit" />
                </div>
            </div>
        </>
    )
}