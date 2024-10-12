import React, { useRef, useState, useEffect } from 'react';
import Toolbar from './Toolbar.jsx';
import exitIcon from '../../assets/icons/exit.svg';
import { convertPdfToImages } from '../../utils/pdfUtils.js'; // Import utility function
import '../../assets/css/flipbook.css'; // Import CSS styles
import $ from 'jquery';
import 'jquery.panzoom';

const BookViewer = ({ initialUrl }) => {
    const containerRef = useRef(null);
    const flipbookRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [pdfPages, setPdfPages] = useState([]);

    // Fetch and convert PDF when initialUrl is provided
    useEffect(() => {
        const fetchAndConvertPdf = async () => {
            if (initialUrl) {
                try {
                    const response = await fetch(initialUrl);
                    const blob = await response.blob();
                    const images = await convertPdfToImages(blob);
                    setPdfPages(images);
                } catch (error) {
                    console.error("Error fetching or converting PDF:", error);
                }
            }
        };

        fetchAndConvertPdf();
    }, [initialUrl]);

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
                flipbook.turn('addPage', $(`<div class="page"><img src="${page}" /></div>`), index + 1);
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
        }
    }, [pdfPages]);

    return (
        <div ref={containerRef} className="container">
            <div className="pdf-viewer">
                
                <div className="magazine-viewport">
                    <div ref={flipbookRef} className="magazine">
                        {pdfPages.map((page, index) => (
                            <div key={index} className="page">
                                <img src={page} alt={`Page ${index + 1}`} className="image" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="menu">
                    <Toolbar
                        handlePreviousPage={() => $(flipbookRef.current).turn('previous')}
                        handleNextPage={() => $(flipbookRef.current).turn('next')}
                        handleZoomOut={() => $('.magazine-viewport').panzoom('zoom', true)}
                        handleZoomIn={() => $('.magazine-viewport').panzoom('zoom', false)}
                        toggleFullscreen={toggleFullscreen}
                        isFullscreen={isFullscreen}
                    />
                </div>
            </div>
        </div>
    );
};

export default BookViewer;
