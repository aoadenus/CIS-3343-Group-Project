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

      <style jsx>{`
        /* ========================================
           CONTAINER
           ======================================== */
        
        .data-table-container {
          background: var(--db-color-white);
          border: 1px solid #E5E7EB;
          border-radius: var(--db-radius-lg);
          overflow: hidden;
          box-shadow: var(--db-shadow-card);
        }

        /* ========================================
           TOOLBAR
           ======================================== */
        
        .data-table-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--db-space-4) var(--db-space-6);
          border-bottom: 1px solid #E5E7EB;
          background: var(--db-color-gray-50);
          gap: var(--db-space-4);
          flex-wrap: wrap;
        }

        .table-info {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-sm);
          color: var(--db-color-gray-600);
          font-weight: var(--db-weight-regular);
        }

        .table-info strong {
          font-weight: var(--db-weight-semibold);
          color: var(--db-color-charcoal);
        }

        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: var(--db-space-4);
        }

        .page-size-selector {
          display: flex;
          align-items: center;
          gap: var(--db-space-2);
        }

        .page-size-selector label {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-sm);
          color: var(--db-color-gray-600);
          font-weight: var(--db-weight-medium);
        }

        .page-size-select {
          padding: var(--db-space-2) var(--db-space-3);
          border: 1px solid var(--db-border-light);
          border-radius: var(--db-radius-sm);
          font-family: var(--db-font-sans);
          font-size: var(--db-text-sm);
          color: var(--db-color-charcoal);
          background: var(--db-color-white);
          cursor: pointer;
          transition: all var(--db-transition-base);
          outline: none;
        }

        .page-size-select:hover {
          border-color: var(--db-color-raspberry);
        }

        .page-size-select:focus {
          border-color: var(--db-color-raspberry);
          box-shadow: 0 0 0 3px rgba(196, 69, 105, 0.1);
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: var(--db-space-2);
          padding: var(--db-space-2) var(--db-space-4);
          background: var(--db-color-raspberry);
          color: var(--db-color-white);
          border: none;
          border-radius: var(--db-radius-sm);
          font-family: var(--db-font-sans);
          font-size: var(--db-text-sm);
          font-weight: var(--db-weight-medium);
          cursor: pointer;
          transition: all var(--db-transition-base);
          outline: none;
        }

        .export-btn:hover:not(:disabled) {
          background: var(--db-color-raspberry-hover);
          box-shadow: var(--db-shadow-raspberry);
          transform: translateY(-1px);
        }

        .export-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .export-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .export-btn:focus-visible {
          outline: 2px solid var(--db-color-raspberry);
          outline-offset: 2px;
        }

        /* ========================================
           TABLE SCROLL CONTAINER
           ======================================== */
        
        .table-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* ========================================
           TABLE
           ======================================== */
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--db-font-sans);
        }

        /* Table Header */
        .data-table thead {
          position: sticky;
          top: 0;
          z-index: 10;
          background: #F9FAFB;
        }

        .data-table th {
          padding: var(--db-space-4) var(--db-space-6);
          font-size: var(--db-text-sm);
          font-weight: var(--db-weight-semibold);
          color: var(--db-color-charcoal);
          text-align: left;
          border-bottom: 2px solid #E5E7EB;
          white-space: nowrap;
          user-select: none;
          transition: background var(--db-transition-base);
        }

        .data-table th.sortable:hover {
          background: var(--db-color-raspberry-light);
        }

        .data-table th:focus-visible {
          outline: 2px solid var(--db-color-raspberry);
          outline-offset: -2px;
        }

        .th-content {
          display: flex;
          align-items: center;
          gap: var(--db-space-2);
          justify-content: space-between;
        }

        .sort-icon {
          color: var(--db-color-gray-400);
          flex-shrink: 0;
          transition: color var(--db-transition-base);
        }

        .sort-icon.active {
          color: var(--db-color-raspberry);
        }

        /* Table Body */
        .data-table tbody tr {
          border-bottom: 1px solid #E5E7EB;
          transition: background var(--db-transition-base);
        }

        .data-table tbody tr:nth-child(even) {
          background: rgba(196, 69, 105, 0.05);
        }

        .data-table tbody tr:hover:not(.skeleton-row):not(.empty-state-row) {
          background: rgba(196, 69, 105, 0.1);
        }

        .data-table tbody tr.clickable {
          cursor: pointer;
        }

        .data-table tbody tr:focus-visible {
          outline: 2px solid var(--db-color-raspberry);
          outline-offset: -2px;
        }

        .data-table td {
          padding: var(--db-space-4) var(--db-space-6);
          font-size: var(--db-text-sm);
          font-weight: var(--db-weight-regular);
          color: var(--db-color-chocolate);
          height: 56px;
          vertical-align: middle;
        }

        /* ========================================
           LOADING STATE
           ======================================== */
        
        .skeleton-row {
          background: transparent !important;
        }

        .skeleton-cell {
          height: 20px;
          background: linear-gradient(
            90deg,
            var(--db-color-gray-100) 0%,
            var(--db-color-gray-200) 50%,
            var(--db-color-gray-100) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          border-radius: var(--db-radius-xs);
          max-width: 200px;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* ========================================
           EMPTY STATE
           ======================================== */
        
        .empty-state-row {
          background: transparent !important;
        }

        .empty-state-cell {
          padding: var(--db-space-16) var(--db-space-6) !important;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--db-space-3);
        }

        .empty-state-icon {
          font-size: 48px;
          opacity: 0.5;
        }

        .empty-state-message {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-base);
          font-weight: var(--db-weight-medium);
          color: var(--db-color-gray-500);
        }

        /* ========================================
           PAGINATION
           ======================================== */
        
        .table-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--db-space-4) var(--db-space-6);
          border-top: 1px solid #E5E7EB;
          background: var(--db-color-gray-50);
          gap: var(--db-space-4);
        }

        .pagination-info {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-tiny);
          color: var(--db-color-gray-600);
          font-weight: var(--db-weight-regular);
        }

        .pagination-info strong {
          font-weight: var(--db-weight-semibold);
          color: var(--db-color-charcoal);
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: var(--db-space-2);
          padding: var(--db-space-2) var(--db-space-4);
          background: var(--db-color-white);
          border: 1px solid var(--db-border-light);
          border-radius: var(--db-radius-sm);
          font-family: var(--db-font-sans);
          font-size: var(--db-text-tiny);
          font-weight: var(--db-weight-medium);
          color: var(--db-color-charcoal);
          cursor: pointer;
          transition: all var(--db-transition-base);
          outline: none;
        }

        .pagination-btn:hover:not(:disabled) {
          background: var(--db-color-raspberry-light);
          border-color: var(--db-color-raspberry);
          color: var(--db-color-raspberry);
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .pagination-btn:focus-visible {
          outline: 2px solid var(--db-color-raspberry);
          outline-offset: 2px;
        }

        /* ========================================
           RESPONSIVE DESIGN
           ======================================== */
        
        @media (max-width: 639px) {
          .data-table-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .toolbar-actions {
            flex-direction: column;
            width: 100%;
          }

          .page-size-selector {
            width: 100%;
            justify-content: space-between;
          }

          .export-btn {
            width: 100%;
            justify-content: center;
          }

          .table-pagination {
            flex-wrap: wrap;
            justify-content: center;
          }

          .pagination-info {
            width: 100%;
            text-align: center;
            order: -1;
            margin-bottom: var(--db-space-2);
          }

          .data-table th,
          .data-table td {
            padding: var(--db-space-3) var(--db-space-4);
          }
        }
      `}</style>
    </div>
  );
}
