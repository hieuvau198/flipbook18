import React from 'react';
import '../../assets/css/sidebar.css';

const BookViewerSidebar = ({ pages, onPageClick }) => {
    return (
        <div className="sidebar">
            {pages.map((page, index) => (
                <div
                    key={index}
                    className="sidebar-thumbnail"
                    onClick={() => onPageClick(index + 1)}
                >
                    <img src={page} alt={`Page ${index + 1}`} className="thumbnail-image" />
                    <span className="page-number">{index + 1}</span>
                </div>
            ))}
        </div>
    );
};

export default BookViewerSidebar;
