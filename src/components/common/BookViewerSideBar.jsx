import React, { useEffect, useRef } from "react";
import "../../assets/css/sidebar.css";

const BookViewerSidebar = ({ pages, onPageClick, currentPage }) => {
  const sidebarRef = useRef(null);

  // Scroll to the current page when the currentPage changes
  useEffect(() => {
    if (sidebarRef.current) {
      const currentPageElement = sidebarRef.current.querySelector(
        `.sidebar-thumbnail:nth-child(${currentPage})`
      );
      if (currentPageElement) {
        currentPageElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentPage, pages]); // Also watch for changes in pages to update thumbnails as new pages are loaded

  return (
    <div className="sidebar" ref={sidebarRef}>
      {pages.map((page, index) => (
        <div
          key={index}
          className={`sidebar-thumbnail ${index + 1 === currentPage ? "active" : ""}`}
          onClick={() => onPageClick(index + 1)} // Allow clicking to change page
        >
          <img src={page} alt={`Page ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default BookViewerSidebar;
