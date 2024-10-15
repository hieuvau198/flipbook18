import React, { useRef, useState, useEffect } from 'react';
import Toolbar from './Toolbar.jsx';
import previousIcon from '../../assets/icons/previous.svg';
import nextIcon from '../../assets/icons/next.svg';
import { loadPdfDocument } from '../../utils/pdfUtils.js';
import '../../assets/css/flipbook.css';
import $ from 'jquery';

const BookViewer = ({ initialFile }) => {
    const containerRef = useRef(null);
    const flipbookRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(initialFile);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const pdf = await loadPdfDocument(file);
            setPdfDocument(pdf);
            setUploadedFile(file);
        }
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

    const renderPdfToFlipbook = async (pdf) => {
        const flipbook = $(flipbookRef.current);

        // Clear any existing content
        flipbook.empty();

        // Render pages into flipbook
        const pages = [];
        for (let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i + 1);
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render page on canvas
            await page.render({ canvasContext: context, viewport }).promise;

            // Add the canvas to the pages array (to be appended after rendering)
            pages.push(canvas);
        }

        // After all pages are rendered, append them to the flipbook
        pages.forEach((canvas, index) => {
            flipbook.append(`<div class="flipbook-page"></div>`);
            flipbook.children().last().append(canvas);
        });

        // Initialize Turn.js after all pages are in place
        flipbook.turn({
            width: 922,
            height: 600,
            autoCenter: true,
            display: 'double',
            elevation: 50,
            gradients: true,
            when: {
                turning: function(event, page, view) {
                    // Luôn cho phép lật trang bằng chuột khi zoom
                    if (scale > 1) {
                        event.preventDefault(); // Allow custom handling during zoom
                    }
                }
            },
            mouseEvents: {
                down: 'mousedown',
                move: 'mousemove',
                up: 'mouseup',
                over: 'mouseover',
                out: 'mouseout'
            },
            touchEvents: {
                down: 'touchstart',
                move: 'touchmove',
                up: 'touchend',
                over: 'touchstart',
                out: 'touchend'
            }
        });
    };

    const handleZoomIn = () => {
        setScale((prevScale) => {
            const newScale = Math.min(prevScale + 0.1, 2); // Giới hạn zoom tối đa là 2
            return newScale;
        });
    };

    const handleZoomOut = () => {
        setScale((prevScale) => {
            const newScale = Math.max(prevScale - 0.1, 0.5); // Giới hạn zoom tối thiểu là 0.5
            return newScale;
        });
    };

    useEffect(() => {
        if (pdfDocument && flipbookRef.current) {
            renderPdfToFlipbook(pdfDocument);
        }
    }, [pdfDocument, uploadedFile]);

    return (
        <div ref={containerRef} className="flipbook-container">
            {!uploadedFile ? (
                <div className="flipbook-upload-container">
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />
                </div>
            ) : (
                <div className="flipbook-pdf-viewer">
                    <div className="flipbook-magazine-viewport">
                        <div
                            ref={flipbookRef}
                            className="flipbook-magazine"
                            style={{
                                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                transition: 'transform 0.3s ease',
                                transformOrigin: 'center center',
                            }}
                        >
                        </div>
                    </div>
                    {/* Nút Previous */}
                    <button
                        className="flipbook-nav-button previous"
                        onClick={() => $(flipbookRef.current).turn('previous')}
                    >
                        <img src={previousIcon} alt="Previous" style={styles.icon} />
                    </button>
                    {/* Nút Next */}
                    <button
                        className="flipbook-nav-button next"
                        onClick={() => $(flipbookRef.current).turn('next')}
                    >
                        <img src={nextIcon} alt="Next" style={styles.icon} />
                    </button>
                    <Toolbar
                        handleZoomOut={handleZoomOut}
                        handleZoomIn={handleZoomIn}
                        toggleFullscreen={toggleFullscreen}
                        isFullscreen={isFullscreen}
                    />
                </div>
            )}
        </div>
    );
};

const styles = {
    icon: {
        width: '24px', // Kích thước biểu tượng
        height: '24px',
    },
};

export default BookViewer;
