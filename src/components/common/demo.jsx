import React, { useRef, useState, useEffect } from 'react';
import Toolbar from './Toolbar.jsx';
import exitIcon from '../../assets/icons/exit.svg';
import { convertPdfToImages } from '../../utils/pdfUtils.js'; // Importing from the utility file
import '../../assets/css/flipbook.css'; // Import the new CSS file
import 'jquery.panzoom';
import $ from 'jquery';

const Demo = ({ initialFile }) => {
    const containerRef = useRef(null);
    const flipbookRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [pdfPages, setPdfPages] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(initialFile);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const images = await convertPdfToImages(file); // Use the utility function
            setPdfPages(images);
            setUploadedFile(file);
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
            const viewport = $('.magazine-viewport').panzoom({
                minScale: 1,
                maxScale: 2,
            });

            if (flipbook.data("turn")) {
                flipbook.turn("destroy").empty();
            }

            const loadFlipbook = () => {
                flipbook.turn({
                    width: 922,
                    height: 600,
                    autoCenter: true,
                    pages: pdfPages.length,
                    when: {
                        turning: (event, page) => console.log("Turning to page", page),
                        turned: (event, page) => console.log("Turned to page", page),
                    }
                });

                viewport.panzoom({
                    minScale: 1,
                    maxScale: 2,
                    contain: 'invert',
                    onZoomIn: () => console.log("Zoomed In"),
                    onZoomOut: () => console.log("Zoomed Out"),
                });
            };

            const allImagesLoaded = flipbook.find("img").length === pdfPages.length;
            if (allImagesLoaded) {
                loadFlipbook();
            } else {
                flipbook.find("img").on('load', loadFlipbook);
            }
        }
    }, [pdfPages, uploadedFile]);

    return (
        <div ref={containerRef} className="container">
            {!uploadedFile ? (
                <div className="upload-container">
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />
                </div>
            ) : (
                <div className="pdf-viewer">
                    <div className="overlay">
                        <button onClick={handleExit} className="exit-button">
                            <img src={exitIcon} alt="Exit" className="exit-icon" />
                        </button>
                    </div>
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
            )}
        </div>
    );
};

export default Demo;
