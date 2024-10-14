import React, { useRef, useState, useEffect } from 'react';
import Toolbar from './Toolbar.jsx';
import previousIcon from '../../assets/icons/previous.svg'; // Import biểu tượng Previous
import nextIcon from '../../assets/icons/next.svg'; // Import biểu tượng Next
import { loadPdfDocument } from '../../utils/pdfUtils.js';
import '../../assets/css/flipbook.css';
import $ from 'jquery';
import 'jquery.panzoom';

const BookViewer = ({ initialFile }) => {
    const containerRef = useRef(null);
    const flipbookRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(initialFile);

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
    
        // Now initialize Turn.js after all pages are in place
        flipbook.turn({
            width: 922,
            height: 600,
            autoCenter: true,
            display: 'double',
            elevation: 50,
            gradients: true,
            when: {
                turning: (event, page) => {
                    console.log('Turning to page', page);
                    $('.magazine-viewport').panzoom('disable');
                },
                turned: (event, page) => {
                    console.log('Turned to page', page);
                    $('.magazine-viewport').panzoom('enable');
                },
            },
        });
    
        // Initialize panzoom with disabled pan
        $('.magazine-viewport').panzoom({
            minScale: 1,
            maxScale: 2,
            disablePan: true,
        });
    
        // Enable zoom with mouse wheel
        $('.magazine-viewport').on('mousewheel', (event) => {
            event.preventDefault();
            const zoomOut = event.originalEvent.deltaY > 0;
            $('.magazine-viewport').panzoom('zoom', !zoomOut, {
                animate: false,
                focal: event,
            });
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
                        <div ref={flipbookRef} className="flipbook-magazine"></div>
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
                        handleZoomOut={() => $('.magazine-viewport').panzoom('zoom', true)}
                        handleZoomIn={() => $('.magazine-viewport').panzoom('zoom', false)}
                        toggleFullscreen={toggleFullscreen}
                        isFullscreen={isFullscreen}
                        className="flipbook-tool-bar"
                    />
                </div>
            )}
        </div>
    );
};

const styles = {
    icon: {
        width: '24px',  // Kích thước biểu tượng
        height: '24px',
    }
};

export default BookViewer;
