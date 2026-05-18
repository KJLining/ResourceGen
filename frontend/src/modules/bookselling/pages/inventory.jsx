import InventoryList from "../components/tables/inventorylist"
import Button from "../../../components/ui/button"
export default function Inventory() {
    return (
        <>
            <h1 className="text-2xl font-bold text-center mb-5">Inventory</h1>
            <div className="flex flex-row">
                <Button variant="primary" className="mr-2">Add Book</Button>
            </div>
            <InventoryList />
        </>
    )
}