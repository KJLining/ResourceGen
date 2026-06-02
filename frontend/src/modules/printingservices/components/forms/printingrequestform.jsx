import Dropdown from "../../../../components/ui/dropdown"

export default function PrintingRequestForm({
    formData,
    setFormData,
}) {

    const courseOptions = [
        { label: "BSIT", value: "BSIT" },
        { label: "BSCS", value: "BSCS" },
        { label: "BSEd", value: "BSEd" },
        { label: "BEEd", value: "BEEd" },
        {label: "BECE", value: "BECE"},
        { label: "BSBA", value: "BSBA" },
        { label: "BENT", value: "BENT" },
        {label: "BSHM", value: "BSHM"},
        {label: "BSOA", value: "BSOA"},
        {label: "BAJOURN", value: "BAJOURN"},
        {label:"BSPSYCH", value: "BSPSYCH"},
    ]

    const documentOptions = [
        { label: "Thesis", value: "Thesis" },
        { label: "EDP", value: "EDP" },
        { label: "Narrative", value: "Narrative" },
        { label: "Portfolio", value: "Portfolio" },
    ]


    return (

        <div className="space-y-5">

            {/* Course + Type */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <Dropdown
                    label="Course"
                    options={courseOptions}
                    value={formData.course}
                    onChange={(value) =>
                        setFormData({
                            ...formData,
                            course: value,
                        })
                    }
                    width="w-full"
                />

                <Dropdown
                    label="Document Type"
                    options={documentOptions}
                    value={formData.document_type}
                    onChange={(value) =>
                        setFormData({
                            ...formData,
                            document_type: value,
                        })
                    }
                    width="w-full"
                />

            </div>

            {/* Title */}

            <div>

                <label className="block mb-1 text-sm font-medium">
                    Title
                </label>

                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            title: e.target.value,
                        })
                    }
                    className="w-full border rounded-xl px-4 py-2"
                />

            </div>

            {/* Members */}

            <div>

                <label className="block mb-1 text-sm font-medium">
                    Members
                </label>

                <textarea
                    rows={3}
                    value={formData.members}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            members: e.target.value,
                        })
                    }
                    className="w-full border rounded-xl px-4 py-2"
                />

            </div>

            {/* Quantities */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                    <label className="block mb-1 text-sm font-medium">
                        Hardbound Qty
                    </label>

                    <input
                        type="number"
                        min="0"
                        value={formData.hardbound_qty}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                hardbound_qty: e.target.value,
                            })
                        }
                        className="w-full border rounded-xl px-4 py-2"
                    />

                </div>

                <div>

                    <label className="block mb-1 text-sm font-medium">
                        Softbound Qty
                    </label>

                    <input
                        type="number"
                        min="0"
                        value={formData.softbound_qty}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                softbound_qty: e.target.value,
                            })
                        }
                        className="w-full border rounded-xl px-4 py-2"
                    />

                </div>

            </div>

            {/* Amount + Status */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                    <label className="block mb-1 text-sm font-medium">
                        Total Amount
                    </label>

                    <input
                        type="number"
                        min="0"
                        value={formData.total_amount}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                total_amount: e.target.value,
                            })
                        }
                        className="w-full border rounded-xl px-4 py-2"
                    />

                </div>


            </div>

            {/* Dates */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                    <label className="block mb-1 text-sm font-medium">
                        Date Received
                    </label>

                    <input
                        type="date"
                        value={formData.date_received || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                date_received: e.target.value,
                            })
                        }
                        className="w-full border rounded-xl px-4 py-2"
                    />

                </div>

                <div>

                    <label className="block mb-1 text-sm font-medium">
                        Due Date
                    </label>

                    <input
                        type="date"
                        value={formData.due_date || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                due_date: e.target.value,
                            })
                        }
                        className="w-full border rounded-xl px-4 py-2"
                    />

                </div>

            </div>

            {/* Remarks */}

            <div>

                <label className="block mb-1 text-sm font-medium">
                    Remarks
                </label>

                <textarea
                    rows={3}
                    value={formData.remarks}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            remarks: e.target.value,
                        })
                    }
                    className="w-full border rounded-xl px-4 py-2"
                />

            </div>

        </div>
    )
}