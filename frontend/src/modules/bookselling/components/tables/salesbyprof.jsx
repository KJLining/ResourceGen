import Table from "../../../../components/ui/table"
export default function SalesbyProf() {
            const columns = [
            { header: "Professor Name", accessor: "professorName" },
            { header: "Total Sales", accessor: "totalSales" },
            { header: "Books Sold", accessor: "booksSold" },
        ];

        const data = [
            { professorName: "Dr. Smith", totalSales: "$500", booksSold: 20 },
            { professorName: "Dr. Johnson", totalSales: "$300", booksSold: 12 },
            { professorName: "Dr. Lee", totalSales: "$400", booksSold: 15 },
        ];
    return (
        <>
            <div className="w-md p-2 bg-neutral-200 rounded-md shadow">
                <h2 className="text-xl font-bold mb-4 text-center">Sales by Professor</h2>
                <div className="flex justify-center">
                    <Table columns={columns} data={data} size="md" width="fit" />
                </div>
            </div>
        </>
    )
}