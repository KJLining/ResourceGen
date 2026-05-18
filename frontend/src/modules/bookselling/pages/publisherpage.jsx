import { useState } from "react";
import PublisherList from "../components/tables/publisherlist";
import Button from "../../../components/ui/button";
import SearchBar from "../../../components/ui/SearchBar";
import { Plus } from "lucide-react";

export default function PublisherPage() {
    const [search, setSearch] = useState("");

    return (
        <>
            <h1 className="text-2xl font-bold text-center mb-5">
                Publishers List
            </h1>

            <div className="flex justify-between items-center mb-4">
                {/* 🔍 Search */}
                <SearchBar
                    placeholder="Search publishers..."
                    onSearch={(value) => setSearch(value)}
                />

                {/* ➕ Button */}
                <Button variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Publisher
                </Button>
            </div>

            {/* 🔽 Pass search to table */}
            <PublisherList search={search} />
        </>
    );
}