export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  isLoading = false,
  className = "",
}) {
  const baseStyle =
    "px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "bg-transparent text-green-700 border border-green-700 hover:bg-green-700 hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}