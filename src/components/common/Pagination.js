import React from 'react';
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';
import '../../styles/common/Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5; // Maximum number of page buttons to show at once
  
  // Don't render if there's only one page
  if (totalPages <= 1) return null;

  // Calculate the range of page numbers to display
  const getPageRange = () => {
    const range = [];
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    // Generate the range
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    return range;
  };

  const pageRange = getPageRange();
  const showFirstPage = !pageRange.includes(1);
  const showLastPage = !pageRange.includes(totalPages);
  const showLeftEllipsis = currentPage > Math.ceil(maxVisiblePages / 2);
  const showRightEllipsis = currentPage <= totalPages - Math.ceil(maxVisiblePages / 2);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className={`pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>

      {/* First page */}
      {showFirstPage && (
        <>
          <button
            className={`pagination-page ${currentPage === 1 ? 'active' : ''}`}
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {showLeftEllipsis && (
            <span className="pagination-ellipsis">
              <FaEllipsisH />
            </span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pageRange.map((page) => (
        <button
          key={page}
          className={`pagination-page ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Last page */}
      {showLastPage && (
        <>
          {showRightEllipsis && (
            <span className="pagination-ellipsis">
              <FaEllipsisH />
            </span>
          )}
          <button
            className={`pagination-page ${currentPage === totalPages ? 'active' : ''}`}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className={`pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>
    </nav>
  );
};

export default Pagination;
