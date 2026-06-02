import { useState } from "react"
import axios from "axios"
import Button from "../../../../components/ui/button"

export default function ClaimModal({ request, onClose, refreshData }) {

    const [claimedBy, setClaimedBy] = useState("")
    const [releaseNotes, setReleaseNotes] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleClaim = async () => {
        if (!claimedBy.trim()) {
            setError("Please enter the name of the person claiming.")
            return
        }

        try {
            setLoading(true)
            setError("")

            await axios.patch(
                `http://localhost:5000/api/printing-claiming/${request.id}/claim`,
                {
                    claimed_by: claimedBy.trim(),
                    release_notes: releaseNotes.trim() || null,
                }
            )

            await refreshData()
            onClose()

        } catch (err) {
            setError(
                err?.response?.data?.error || "Failed to mark as claimed. Please try again."
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">

                {/* Header */}
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-gray-800">
                        Mark as Claimed
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Confirm that this document has been picked up.
                    </p>
                </div>

                {/* Request info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Control No</span>
                        <span className="font-semibold text-gray-800">
                            {request.control_no}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Course</span>
                        <span className="font-semibold text-gray-800">
                            {request.course}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Type</span>
                        <span className="font-semibold text-gray-800">
                            {request.document_type}
                        </span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-gray-500 shrink-0">Members</span>
                        <span className="font-semibold text-gray-800 text-right">
                            {request.members}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Amount</span>
                        <span className="font-semibold text-gray-800">
                            ₱{Number(request.total_amount).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Claimed by */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Claimed By <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="Full name of person claiming"
                        value={claimedBy}
                        onChange={e => {
                            setClaimedBy(e.target.value)
                            if (error) setError("")
                        }}
                    />
                </div>

                {/* Release notes */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Release Notes{" "}
                        <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                        placeholder="Any additional notes..."
                        rows={3}
                        value={releaseNotes}
                        onChange={e => setReleaseNotes(e.target.value)}
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleClaim}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Confirm Claim"}
                    </Button>
                </div>

            </div>
        </div>
    )
}