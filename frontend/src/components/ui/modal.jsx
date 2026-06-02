import { X } from "lucide-react"

export default function Modal({
    title,
    onClose,
    children
}) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <div
                className="
                    bg-white
                    rounded-xl
                    shadow-xl
                    w-full
                    max-w-5xl
                    max-h-[90vh]
                    overflow-hidden
                    relative
                "
            >

                <div className="flex justify-between items-center border-b p-4">

                    <h2 className="text-lg font-bold">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>

                </div>

                <div
                    className="
                        overflow-y-auto
                        max-h-[calc(90vh-70px)]
                        p-6
                    "
                >
                    {children}
                </div>

            </div>

        </div>
    )
}