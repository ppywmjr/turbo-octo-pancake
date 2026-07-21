export default function Table({
    columns,
    data,
}: {
    columns: string[]
    data: Record<string, string>[]
}) {
    return (
        <div className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse border border-[var(--color-surface)] rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-[var(--color-surface-row-even)]">
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className="px-4 py-3 text-left font-semibold text-[var(--color-text-primary)] border-b border-r border-[var(--color-surface)] last:border-r-0"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={rowIndex % 2 === 0 ? '' : 'bg-[var(--color-surface-row-even)]'}
                        >
                            {Object.values(row).map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className="px-4 py-3 text-[var(--color-text-muted)] border-b border-r border-[var(--color-surface)] last:border-r-0"
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}