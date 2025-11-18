import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  format?: 'currency' | 'date' | 'number' | 'text';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  exportable?: boolean;
  exportFilename?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 10,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  exportable = false,
  exportFilename = 'data-export'
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // Format cell value based on format type
  const formatCellValue = (value: any, format?: Column<T>['format']): string => {
    if (value === null || value === undefined) return '-';

    switch (format) {
      case 'currency':
        const numValue = typeof value === 'number' ? value : parseFloat(value);
        return isNaN(numValue) ? '-' : `$${numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      
      case 'date':
        const date = value instanceof Date ? value : new Date(value);
        return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      
      case 'number':
        const num = typeof value === 'number' ? value : parseFloat(value);
        return isNaN(num) ? '-' : num.toLocaleString('en-US');
      
      case 'text':
      default:
        return String(value);
    }
  };

  // Get cell value from row using accessor
  const getCellValue = (row: T, accessor: keyof T | string): any => {
    if (typeof accessor === 'string' && accessor.includes('.')) {
      // Handle nested accessors like 'customer.name'
      return accessor.split('.').reduce((obj, key) => obj?.[key], row as any);
    }
    return row[accessor as keyof T];
  };

  // Render cell content
  const renderCell = (row: T, column: Column<T>): React.ReactNode => {
    if (column.render) {
      return column.render(row);
    }
    const value = getCellValue(row, column.accessor);
    return formatCellValue(value, column.format);
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = getCellValue(a, sortColumn);
      const bValue = getCellValue(b, sortColumn);

      // Handle null/undefined
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Compare values
      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage]);

  // Calculate pagination info
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startItem = sortedData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, sortedData.length);

  // Handle sort
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    if (sortColumn === column.accessor) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column.accessor);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  // Get sort icon
  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    if (sortColumn === column.accessor) {
      if (sortDirection === 'asc') {
        return <ArrowUp size={16} className="sort-icon active" />;
      } else if (sortDirection === 'desc') {
        return <ArrowDown size={16} className="sort-icon active" />;
      }
    }
    return <ArrowUpDown size={16} className="sort-icon" />;
  };

  // Get aria-sort value
  const getAriaSort = (column: Column<T>): 'ascending' | 'descending' | 'none' => {
    if (sortColumn === column.accessor) {
      return sortDirection === 'asc' ? 'ascending' : 'descending';
    }
    return 'none';
  };

  // Export to CSV
  const exportToCSV = () => {
    // Build CSV content
    const headers = columns.map(col => col.header).join(',');
    
    const rows = sortedData.map(row => {
      return columns.map(col => {
        // Always export the raw formatted value, not React nodes
        // Custom render functions are for UI display (badges, icons, etc.)
        // CSV export needs clean data, not UI components
        
        // Get the raw value using accessor
        const rawValue = getCellValue(row, col.accessor);
        
        // Apply formatting if specified (currency, date, number)
        let exportValue: string;
        if (col.format) {
          exportValue = String(formatCellValue(rawValue, col.format));
        } else {
          // For non-formatted columns, convert raw value to string
          exportValue = String(rawValue ?? '');
        }
        
        // Escape commas and quotes for CSV
        const escaped = exportValue.replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',');
    });
    
    const csv = [headers, ...rows].join('\n');
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportFilename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle row click
  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  // Handle keyboard navigation for pagination
  const handlePaginationKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  // Skeleton rows for loading state
  const SkeletonRows = () => (
    <>
      {Array.from({ length: itemsPerPage }).map((_, i) => (
        <tr key={i} className="skeleton-row">
          {columns.map((col, j) => (
            <td key={j} style={{ textAlign: col.align || 'left' }}>
              <div className="skeleton-cell" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );

  // Empty state
  const EmptyState = () => (
    <tr className="empty-state-row">
      <td colSpan={columns.length} className="empty-state-cell">
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-message">{emptyMessage}</div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="data-table-container">
      {/* Toolbar */}
      <div className="data-table-toolbar">
        <div className="table-info">
          Showing <strong>{startItem}</strong>-<strong>{endItem}</strong> of <strong>{sortedData.length}</strong>
        </div>
        
        <div className="toolbar-actions">
          {/* Page Size Selector */}
          <div className="page-size-selector">
            <label htmlFor="pageSize">Show:</label>
            <select
              id="pageSize"
              value={itemsPerPage}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="page-size-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Export Button */}
          {exportable && (
            <button
              className="export-btn"
              onClick={exportToCSV}
              disabled={loading || sortedData.length === 0}
              aria-label="Export data to CSV"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="data-table" role="table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(col)}
                  style={{
                    width: col.width,
                    textAlign: col.align || 'left',
                    cursor: col.sortable ? 'pointer' : 'default'
                  }}
                  className={col.sortable ? 'sortable' : ''}
                  aria-sort={col.sortable ? getAriaSort(col) : undefined}
                  tabIndex={col.sortable ? 0 : undefined}
                  onKeyDown={(e: React.KeyboardEvent<HTMLTableCellElement>) => {
                    if (col.sortable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleSort(col);
                    }
                  }}
                >
                  <div className="th-content">
                    <span>{col.header}</span>
                    {col.sortable && getSortIcon(col)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : sortedData.length === 0 ? (
              <EmptyState />
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => handleRowClick(row)}
                  className={onRowClick ? 'clickable' : ''}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) => {
                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleRowClick(row);
                    }
                  }}
                  role={onRowClick ? 'button' : undefined}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      style={{ textAlign: col.align || 'left' }}
                    >
                      {renderCell(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && sortedData.length > 0 && (
        <div className="table-pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => handlePaginationKeyDown(e, () => setCurrentPage(p => Math.max(1, p - 1)))}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <div className="pagination-info">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => handlePaginationKeyDown(e, () => setCurrentPage(p => Math.min(totalPages, p + 1)))}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

    </div>
  );
}
