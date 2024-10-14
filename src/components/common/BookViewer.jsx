import React, { useRef, useState, useEffect } from 'react';
import Toolbar from './Toolbar.jsx';
import exitIcon from '../../assets/icons/exit.svg';
import { convertPdfToImages } from '../../utils/pdfUtils.js'; // Import utility function
import '../../assets/css/flipbook.css'; // Import CSS styles
import $ from 'jquery';
import 'jquery.panzoom';

const BookViewer = ({ initialFile }) => {
    const containerRef = useRef(null);
    const flipbookRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [pdfPages, setPdfPages] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(initialFile);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const images = await convertPdfToImages(file); // Convert PDF to images
            setPdfPages(images);
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

    const handleExit = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        setIsFullscreen(false);
        setUploadedFile(null);
        setPdfPages([]);
    };

    useEffect(() => {
        if (pdfPages.length > 0 && flipbookRef.current) {
            const flipbook = $(flipbookRef.current);

            // Destroy existing turn instance if it exists
            if (flipbook.data('turn')) {
                flipbook.turn('destroy').empty();
            }

            // Initialize the turn.js flipbook
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
                        $('.magazine-viewport').panzoom('disable'); // Disable zoom on turn
                    },
                    turned: (event, page) => {
                        console.log('Turned to page', page);
                        $('.magazine-viewport').panzoom('enable'); // Enable zoom after turn
                    },
                },
            });

            // Load pages into flipbook
            pdfPages.forEach((page, index) => {
                flipbook.turn('addPage', $(`<div class="flipbook-page"><img src="${page}" /></div>`), index + 1);
            });

            // Initialize panzoom with disabled pan
            $('.magazine-viewport').panzoom({
                minScale: 1,
                maxScale: 2,
                disablePan: true, // Disable pan functionality
            });

            // Enable zoom with mouse wheel
            $('.magazine-viewport').on('mousewheel', (event) => {
                event.preventDefault(); // Prevent default scrolling
                const zoomOut = event.originalEvent.deltaY > 0; // Determine zoom direction
                $('.magazine-viewport').panzoom('zoom', !zoomOut, {
                    animate: false,
                    focal: event,
                });
            });

            // Removed mouse click event to turn pages
        }
    }, [pdfPages, uploadedFile]);

    return (
        <div ref={containerRef} className="flipbook-container">
            {!uploadedFile ? (
                <div className="flipbook-upload-container">
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />
                </div>
            ) : (
                <div className="flipbook-pdf-viewer">
                    <button onClick={handleExit} className="flipbook-exit-button">
                        <img src={exitIcon} alt="Exit" className="flipbook-exit-icon" />
                    </button>
                    <div className="flipbook-magazine-viewport">
                        <div ref={flipbookRef} className="flipbook-magazine">
                            {pdfPages.map((page, index) => (
                                <div key={index} className="flipbook-page">
                                    <img src={page} alt={`Page ${index + 1}`} className="flipbook-image" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Toolbar
                        handlePreviousPage={() => $(flipbookRef.current).turn('previous')}
                        handleNextPage={() => $(flipbookRef.current).turn('next')}
                        handleZoomOut={() => $('.magazine-viewport').panzoom('zoom', true)}
                        handleZoomIn={() => $('.magazine-viewport').panzoom('zoom', false)}
                        toggleFullscreen={toggleFullscreen}
                        isFullscreen={isFullscreen}
                    />
                </div>
            )}
        </div>
    );
};

export default BookViewer;
