import React, { useEffect, useRef } from "react";
import "../../assets/css/sidebar.css";

const BookViewerSidebar = ({ pages, onPageClick, currentPage }) => {
  const sidebarRef = useRef(null);

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
  }, [currentPage]);

  return (
    <div className="sidebar" ref={sidebarRef}>
      {pages.map((page, index) => (
        <div
          key={index}
          className={`sidebar-thumbnail ${index + 1 === currentPage ? "active" : ""}`}
          onClick={() => onPageClick(index + 1)}
        >
          <img src={page} alt={`Page ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default BookViewerSidebar;
