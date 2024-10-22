import React, { useState, useRef } from 'react';
import '../../assets/css/sidebar.css';

const Sidebar = ({ pages, onPageClick }) => {
    const sidebarRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    
    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const handleMouseMove = (e) => {
        if (isResizing && sidebarRef.current) {
            // Điều chỉnh độ rộng dựa vào vị trí chuột
            const newWidth = e.clientX;
            sidebarRef.current.style.width = `${newWidth}px`;
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    // Lắng nghe các sự kiện chuột trên toàn bộ màn hình để xử lý kéo sidebar
    React.useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div className="sidebar" ref={sidebarRef}>
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
            <div
                className="sidebar-resizer"
                onMouseDown={handleMouseDown}
            ></div>
        </div>
    );
};

export default Sidebar;
