interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  rows: T[];
  emptyText?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  emptyText = 'No data',
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <div className="lr-empty">{emptyText}</div>;
  }

  return (
    <div className="lr-table-wrap">
      <table className="lr-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {col.render
                    ? col.render(row)
                    : String(row[col.key as keyof T] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
