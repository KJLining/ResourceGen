export default function Table({
  columns,
  data,
  renderActions,
  size = "md",   // sm | md | lg
  width = "full", // full | auto | fit
}) {
  const sizeStyles = {
    sm: {
      th: "px-2 py-1 text-sm leading-tight",
      td: "px-2 py-1 text-sm leading-tight",
    },
    md: {
      th: "px-3 py-1.5 text-sm leading-tight",
      td: "px-3 py-1.5 text-sm leading-tight",
    },
    lg: {
      th: "px-5 py-3",
      td: "px-5 py-3",
    },
  };

  const widthStyles = {
    full: "min-w-full",
    auto: "w-auto",
    fit: "w-fit",
  };

  return (
    <div className="overflow-x-auto">
      <table
        className={`${widthStyles[width]} border border-gray-200 rounded-lg overflow-hidden`}
      >
        <thead className="bg-green-600 text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={`${sizeStyles[size].th} text-left`}
              >
                {col.header}
              </th>
            ))}

            {renderActions && (
              <th className={sizeStyles[size].th}>Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t odd:bg-white even:bg-gray-50 hover:bg-green-50"
            >
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  className={sizeStyles[size].td}
                >
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}

              {renderActions && (
                <td className={sizeStyles[size].td}>
                  {renderActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}