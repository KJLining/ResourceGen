import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  debounce = 300, // optional debounce delay
  className = "",
}) {
  const [value, setValue] = useState("");

  let timeout = null;

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      onSearch && onSearch(val);
    }, debounce);
  };

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-green-500 
                   transition"
      />
    </div>
  );
}