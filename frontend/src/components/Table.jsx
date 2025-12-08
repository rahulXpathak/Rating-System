import React from 'react';

const Table = ({ columns, data, onSort, currentSort, currentOrder, onRowClick }) => {
    const handleSort = (columnKey) => {
        if (onSort) {
            const newOrder = currentSort === columnKey && currentOrder === 'asc' ? 'desc' : 'asc';
            onSort(columnKey, newOrder);
        }
    };

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                onClick={() => column.sortable && handleSort(column.key)}
                                style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                            >
                                {column.label}
                                {column.sortable && currentSort === column.key && (
                                    <span className="sort-indicator">
                                        {currentOrder === 'asc' ? ' ▲' : ' ▼'}
                                    </span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr
                                key={index}
                                onClick={() => onRowClick && onRowClick(row)}
                                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                            >
                                {columns.map((column) => (
                                    <td key={column.key}>
                                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
