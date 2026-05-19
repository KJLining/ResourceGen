// components/ui/dropdown.jsx
import { useEffect, useRef, useState } from "react"
import { ChevronDown, Check } from "lucide-react"

export default function Dropdown({
  label = "Select",
  options = [],
  value,
  onChange,
  placeholder = "Choose option",
  width = "w-52",
}) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={`relative ${width}`} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm transition hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className={selectedOption ? "text-gray-800" : "text-gray-400"}>
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {options.length > 0 ? (
            options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-gray-100 ${
                  value === option.value
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {option.label}

                {value === option.value && <Check size={16} />}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-400">
              No options found
            </div>
          )}
        </div>
      )}
    </div>
  )
}