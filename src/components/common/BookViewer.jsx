import React, { useRef, useState, useEffect } from 'react';
import Toolbar from './Toolbar.jsx';
import Sidebar from './Sidebar.jsx';
import previousIcon from '../../assets/icons/previous.svg';
import nextIcon from '../../assets/icons/next.svg';
import { loadPdfDocument } from '../../utils/pdfUtils.js';
import '../../assets/css/flipbook.css';
import $ from 'jquery';

const BookViewer = ({ pdfUrl }) => {
    const containerRef = useRef(null);
    const flipbookRef = useRef(null);
    const resultRef = useRef(null);  // Added resultRef
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [isMagnifyEnabled, setIsMagnifyEnabled] = useState(false);
    const [pageImages, setPageImages] = useState([]);
    const [textPages, setTextPages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentResultIndex, setCurrentResultIndex] = useState(0);
    const [magnifyPosition, setMagnifyPosition] = useState({ x: 0, y: 0 });
    const size = 4; // Magnification size
    const toggleMagnify = () => {
        setIsMagnifyEnabled((prev) => !prev);
    };
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const extractTextFromPdf = async (pdf) => {
        const pagesText = [];
        for (let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i + 1);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            pagesText.push(pageText);
        }
        setTextPages(pagesText);
    };

    const renderPdfToFlipbook = async (pdf) => {
        const flipbook = $(flipbookRef.current);
        flipbook.empty();

        const pages = [];
        const pageImages = [];
        const scaleFactor = 1.2;  // Adjust this value for how much bigger you want the PDF (e.g., 1.2 for 20% bigger)
        for (let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i + 1);
            const viewport = page.getViewport({ scale: scaleFactor });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;
            pages.push(canvas);
            pageImages.push(canvas.toDataURL()); // Convert canvas to image URL for sidebar
        }

        setPageImages(pageImages); // Store page images for Sidebar

        pages.forEach((canvas, index) => {
            const pageContainer = document.createElement('div');
            pageContainer.className = 'flipbook-page image';
            pageContainer.appendChild(canvas);
            flipbook.append(pageContainer);
        });

        flipbook.turn({
            width: 922 * scaleFactor,
            height: 600 * scaleFactor,
            autoCenter: true,
            display: 'double',
            elevation: 50,
            gradients: true,
        });
    };

    const handleSearch = () => {
        const results = [];
        textPages.forEach((text, index) => {
            if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push(index + 1);
            }
        });
        setSearchResults(results);
        setCurrentResultIndex(0);
        if (results.length > 0) {
            $(flipbookRef.current).turn('page', results[0]);
        }
    };

    const handlePageClick = (page) => {
        $(flipbookRef.current).turn('page', page);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && searchResults.length > 0) {
            // Navigate to the next search result on each Enter press
            const nextIndex = (currentResultIndex + 1) % searchResults.length; // Loop back to start
            $(flipbookRef.current).turn('page', searchResults[nextIndex]); // Navigate to next page
            setCurrentResultIndex(nextIndex); // Update current result index
        }
    };

    const handleMouseMove = (e) => {
        if (!isMagnifyEnabled || !resultRef.current) return;
    
        const imgElement = e.target.tagName === 'CANVAS' ? e.target : null;
        if (!imgElement) return;
    
        const result = resultRef.current;
        result.classList.remove('hide');
    
        const rect = imgElement.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
    
        // Cập nhật hình ảnh trong vùng kính lúp cố định
        result.style.cssText = `
            background-image: url(${imgElement.toDataURL()});
            background-size: ${imgElement.width * size}px ${imgElement.height * size}px;
            background-position: ${x}% ${y}%;
        `;
    };
    
    const handleMouseLeave = () => {
        if (resultRef.current) {
            resultRef.current.classList.add('hide');
            resultRef.current.style = '';
        }
    };

    useEffect(() => {
        const fetchPdf = async () => {
            if (pdfUrl) {
                const pdf = await loadPdfDocument(pdfUrl);
                setPdfDocument(pdf);
                extractTextFromPdf(pdf);
            }
        };

        fetchPdf();
    }, [pdfUrl]);

    useEffect(() => {
        if (pdfDocument && flipbookRef.current) {
            renderPdfToFlipbook(pdfDocument);
        }
    }, [pdfDocument]);

    return (
        <div className="flipbook-pdf-viewer" ref={containerRef} onKeyDown={handleKeyPress} tabIndex="0">
            <Sidebar pages={pageImages} onPageClick={handlePageClick} />
            <div className={`flipbook-magazine-viewport ${isMagnifyEnabled ? 'zoomer' : ''}`}>
                <div
                    ref={flipbookRef}
                    className="flipbook-magazine"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                ></div>
                <div ref={resultRef} className="result hide"></div> {/* Added this */}
            </div>

            <button
                className="flipbook-nav-button previous"
                onClick={() => $(flipbookRef.current).turn('previous')}
            >
                <img src={previousIcon} alt="Previous" style={styles.icon} />
            </button>
            <button
                className="flipbook-nav-button next"
                onClick={() => $(flipbookRef.current).turn('next')}
            >
                <img src={nextIcon} alt="Next" style={styles.icon} />
            </button>

            <Toolbar
                toggleFullscreen={toggleFullscreen}
                isFullscreen={isFullscreen}
                onToggleMagnify={toggleMagnify}
                isMagnifyEnabled={isMagnifyEnabled}
                searchTerm={searchTerm}
                onSearchChange={(newTerm) => {
                    setSearchTerm(newTerm);
                    handleSearch();
                }}
            />
        </div>
    );
};

const styles = {
    icon: {
        width: '24px',
        height: '24px',
    },
};

export default BookViewer;
