import React, { useRef, useState, useEffect } from 'react';
import Toolbar from './Toolbar.jsx';
import previousIcon from '../../assets/icons/previous.svg';
import nextIcon from '../../assets/icons/next.svg';
import { loadPdfDocument } from '../../utils/pdfUtils.js';
import '../../assets/css/flipbook.css';
import $ from 'jquery';

const BookViewer = ({ pdfUrl }) => {
    const containerRef = useRef(null);
    const flipbookRef = useRef(null);
    const resultRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [isMagnifyEnabled, setIsMagnifyEnabled] = useState(false);
    const [textPages, setTextPages] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Track search term
    const [searchResults, setSearchResults] = useState([]);
    const [currentResultIndex, setCurrentResultIndex] = useState(0);

    const [scale, setScale] = useState(1); // Thêm state cho zoom
    const startPosition = useRef({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);

    // Lưu trạng thái ban đầu
    const initialState = useRef({
        scale: 1,
        position: { x: 0, y: 0 },
        isFullscreen: false,
    });
    // Hàm reset trạng thái
    const resetView = () => {
        setScale(initialState.current.scale);
        setPosition(initialState.current.position);
        if (isFullscreen) {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };
    // Zoom In và Zoom Out
    const handleZoomIn = () => {
        setScale(prevScale => Math.min(prevScale + 0.1, 2)); // Giới hạn zoom tối đa là 2
    };

    const handleZoomOut = () => {
        setScale(prevScale => Math.max(prevScale - 0.1, 0.5)); // Giới hạn zoom tối thiểu là 0.5
    };

    // Kéo để di chuyển (pan)
    const handleDown = (e) => {
        e.preventDefault();
        isDragging.current = true;
        startPosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const deltaX = e.clientX - startPosition.current.x;
        const deltaY = e.clientY - startPosition.current.y;
        setPosition(prev => ({
            x: prev.x + deltaX,
            y: prev.y + deltaY,
        }));
        startPosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleUp = () => {
        isDragging.current = false;
    };

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
        setTextPages(pagesText); // Save all extracted text
    };

    const renderPdfToFlipbook = async (pdf) => {
        const flipbook = $(flipbookRef.current);
        flipbook.empty();

        const pages = [];
        const scaleFactor = 1.6;  // Adjust this value for how much bigger you want the PDF (e.g., 1.2 for 20% bigger)

        console.log("Starting to render PDF with scale factor:", scaleFactor);

        for (let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i + 1);

            // Adjust scaleFactor to increase the size of the PDF
            const viewport = page.getViewport({ scale: scaleFactor });

            // Get device pixel ratio for high-quality rendering
            const scale = window.devicePixelRatio || 1;
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            // Set canvas dimensions with the scale factor applied
            canvas.height = viewport.height * scale;
            canvas.width = viewport.width * scale;

            // Scale the context for high resolution
            context.scale(scale, scale);

            // Render the page onto the canvas
            console.log(`Rendering page ${i + 1} with size ${canvas.width}x${canvas.height}`);
            await page.render({
                canvasContext: context,
                viewport,
            }).promise;

            pages.push(canvas);
        }

        // Append rendered pages to flipbook
        pages.forEach((canvas) => {
            const pageContainer = document.createElement('div');
            pageContainer.className = 'flipbook-page image';
            pageContainer.appendChild(canvas);
            flipbook.append(pageContainer);
        });

        // Centering flipbook with CSS if autoCenter doesn't fully work
        flipbook.turn({
            width: 922 * scaleFactor,  // Apply scale factor to width
            height: 600 * scaleFactor, // Apply scale factor to height
            autoCenter: true, // Ensure flipbook tries to auto-center the pages
            display: 'double',
            elevation: 50,
            gradients: true,
        });

        // Apply a flexbox style for better centering if necessary
        $(flipbookRef.current).css({
            display: 'flex',
            justifyContent: 'center', // Center horizontally
            alignItems: 'center',     // Center vertically
        });

        console.log("PDF rendering complete and flipbook centered.");
    };




    const handleSearch = () => {
        const results = [];
        textPages.forEach((text, index) => {
            if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push(index + 1); // Store page numbers where term is found
            }
        });
        setSearchResults(results);
        setCurrentResultIndex(0); // Start with the first result
        if (results.length > 0) {
            $(flipbookRef.current).turn('page', results[0]); // Navigate to first result
        }
    };

    const handleKeyPress = (e) => {
        const leftKeys = ['ArrowLeft', 'ArrowUp', 'A', 'W', 'a', 'w'];
        const rightKeys = ['ArrowRight', 'ArrowDown', 'S', 'D', 's', 'd'];

        if (leftKeys.includes(e.key)) {
            $(flipbookRef.current).turn('previous'); // Turn to the previous page
        } else if (rightKeys.includes(e.key)) {
            $(flipbookRef.current).turn('next'); // Turn to the next page
        }

        // Handle search navigation with Enter key if search results are available
        if (e.key === 'Enter' && searchResults.length > 0) {
            const nextIndex = (currentResultIndex + 1) % searchResults.length; // Loop back to start
            $(flipbookRef.current).turn('page', searchResults[nextIndex]); // Navigate to next result
            setCurrentResultIndex(nextIndex); // Update current result index
        }
        // Điều khiển Alt + 0 để reset view
        if (e.altKey && e.key === '0') {
            resetView(); // Gọi hàm reset view
        }

        // Điều khiển Alt + + để zoom in
        if (e.altKey && (e.key === '+' || e.key === '=')) {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
            handleZoomIn(); // Gọi hàm zoom in
        }

        // Điều khiển Alt + - để zoom out
        if (e.altKey && (e.key === '-' || e.key === '_')) {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
            handleZoomOut(); // Gọi hàm zoom out
        }
    };


    useEffect(() => {
        const fetchPdf = async () => {
            if (pdfUrl) {
                const pdf = await loadPdfDocument(pdfUrl);
                setPdfDocument(pdf);
                extractTextFromPdf(pdf); // Extract text from each page
            }
        };

        fetchPdf();
    }, [pdfUrl]);

    useEffect(() => {
        if (pdfDocument && flipbookRef.current) {
            renderPdfToFlipbook(pdfDocument);
        }
    }, [pdfDocument]);

    useEffect(() => {
        const flipbook = flipbookRef.current;
        if (flipbook) {
            $(flipbook).on('mousedown', handleDown);
            $(document).on('mousemove', handleMove);
            $(document).on('mouseup', handleUp);
        }

        return () => {
            $(flipbook).off('mousedown', handleDown);
            $(document).off('mousemove', handleMove);
            $(document).off('mouseup', handleUp);
        };
    }, []);

    return (
        <div ref={containerRef} className="" onKeyDown={handleKeyPress} tabIndex="0">
            <div className="flipbook-pdf-viewer">
                <div className={`flipbook-magazine-viewport ${isMagnifyEnabled ? 'zoomer' : ''}`}
                    style={{
                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`, // Zoom và Pan
                        transition: 'transform 0.3s ease',
                    }}
                >
                    <div ref={flipbookRef} className="flipbook-magazine"></div>
                    <div ref={resultRef} className="result hide"></div>
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

                {/* Pass searchTerm and handleSearchChange to Toolbar */}
                <Toolbar
                    toggleFullscreen={toggleFullscreen}
                    isFullscreen={isFullscreen}
                    onToggleMagnify={toggleMagnify}
                    isMagnifyEnabled={isMagnifyEnabled}
                    handleZoomIn={handleZoomIn}  // Nút Zoom In
                    handleZoomOut={handleZoomOut} // Nút Zoom Out
                    handleResetView={resetView}
                    searchTerm={searchTerm}
                    onSearchChange={(newTerm) => {
                        setSearchTerm(newTerm);
                        handleSearch();  // Perform search when term changes
                    }}

                    fullscreenTitle="Fullscreen"
                />



            </div>
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
