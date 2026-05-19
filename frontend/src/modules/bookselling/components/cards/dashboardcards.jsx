import { Calendar1, CalendarDays, LibraryBig, BookHeart } from "lucide-react"

export default function DashboardCards({ todaySales, monthlySales, onHand, topSelling }) {
    return (
        <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-neutral-200 p-4 rounded-md shadow items-center flex flex-row hover:shadow-lg transition-shadow">
                <div className="p-2 bg-green-200 rounded">
                    <Calendar1 size={40} color="green" />
                </div>
                <div className="w-full ml-5">
                    <h2 className="text-neutral-500">Today's Sales</h2>
                    <p className="text-2xl font-bold">₱ {Number(todaySales?.total || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                    <p className="text-neutral-500">{todaySales?.books || 0} books</p>
                </div>
            </div>
            <div className="bg-neutral-200 p-4 rounded-md shadow items-center flex flex-row hover:shadow-lg transition-shadow">
                <div className="p-2 bg-orange-100 rounded">
                    <CalendarDays size={40} color="orange" />
                </div>
                <div className="w-full ml-5">
                    <h2 className="text-neutral-500">Monthly Sales</h2>
                    <p className="text-2xl font-bold">₱ {Number(monthlySales?.total || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                    <p className="text-neutral-500">{monthlySales?.books || 0} books</p>
                </div>
            </div>
            <div className="bg-neutral-200 p-4 rounded-md shadow items-center flex flex-row hover:shadow-lg transition-shadow">
                <div className="p-2 bg-cyan-100 rounded">
                    <LibraryBig size={40} color="cyan" />
                </div>
                <div className="w-full ml-5">
                    <h2 className="text-neutral-500">On Hand</h2>
                    <p className="text-2xl font-bold">{onHand || 0} Books</p>
                </div>
            </div>
            <div className="bg-neutral-200 p-4 rounded-md shadow items-center flex flex-row hover:shadow-lg transition-shadow">
                <div className="p-2 bg-red-100 rounded">
                    <BookHeart size={40} color="red" />
                </div>
                <div className="w-full ml-5">
                    <h2 className="text-neutral-500">Top Selling</h2>
                    <p className="text-2xl font-bold">{topSelling || 'N/A'}</p>
                </div>
            </div>
        </div>
    )
}