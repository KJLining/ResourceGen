import Table from "../../../../components/ui/table";

export default function RecentSales({ data = [] }) {
    const columns = [
        { header: "Sem", accessor: "semester" },
        { header: "Date", accessor: "sale_date" },
        { header: "Control Number", accessor: "control_number" },
        { header: "Name", accessor: "student_name" },
        { header: "Course", accessor: "course" },
        { header: "Book Title", accessor: "book_title" },
        { header: "Prof", accessor: "professor_name" },
    ];

    return (
        <div className="w-full h-fit p-2 bg-neutral-200 rounded-md shadow">
            <h2 className="text-xl font-bold mb-4 text-center">Recent Sales</h2>
            <div className="flex justify-center">
                <Table columns={columns} data={data} size="md" width="fit" />
            </div>
        </div>
    )
}