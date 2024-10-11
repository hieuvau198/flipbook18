import React, { useRef, useState, useEffect } from 'react';
import Toolbar from './Toolbar.jsx';
import exitIcon from '../../assets/icons/exit.svg';
import turnJs from '../../assets/js/turn.js';
import 'jquery.panzoom';
import $ from 'jquery';
const PDFJS = require("pdfjs-dist/webpack");

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

    const readFileData = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (err) => reject(err);
            reader.readAsArrayBuffer(file); // Changed to ArrayBuffer for better PDF handling
        });
    };

    const convertPdfToImages = async (file) => {
        const images = [];
        const data = await readFileData(file);
        const pdf = await PDFJS.getDocument(data).promise;
        const canvas = document.createElement("canvas");
        for (let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i + 1);
            const viewport = page.getViewport({ scale: 1 });
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            images.push(canvas.toDataURL());
        }
        canvas.remove();
        return images;
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const images = await convertPdfToImages(file);
            setPdfPages(images);
            setUploadedFile(file); // This will trigger reinitialization of the flipbook
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
            }); // The viewport that will handle zoom

            // Destroy any existing flipbook before initializing a new one
            if (flipbook.data("turn")) {
                flipbook.turn("destroy").empty();
            }

            // Delay initialization until images load
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

                // Initialize zoom with panzoom
                viewport.panzoom({
                    minScale: 1,
                    maxScale: 2,
                    contain: 'invert',
                    onZoomIn: () => console.log("Zoomed In"),
                    onZoomOut: () => console.log("Zoomed Out"),
                });
            };

            // Ensure images are loaded before initializing
            const allImagesLoaded = flipbook.find("img").length === pdfPages.length;
            if (allImagesLoaded) {
                loadFlipbook();
            } else {
                flipbook.find("img").on('load', loadFlipbook);
            }
        }
    }, [pdfPages, uploadedFile]);

    return (
        <div ref={containerRef} style={styles.container}>
            {!uploadedFile ? (
                <div style={styles.uploadContainer}>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />
                </div>
            ) : (
                <div style={styles.pdfViewer}>
                    <div style={styles.overlay}>
                        <button onClick={handleExit} style={styles.exitButton}>
                            <img src={exitIcon} alt="Exit" style={styles.exitIcon} />
                        </button>
                    </div>
                    <div className="magazine-viewport" style={styles.magazineViewport}>
                        <div ref={flipbookRef} className="magazine" style={styles.magazine}>
                            {pdfPages.map((page, index) => (
                                <div key={index} className="page" style={styles.page}>
                                    <img src={page} alt={`Page ${index + 1}`} style={styles.image} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={styles.menu}>
                        <Toolbar
                            handlePreviousPage={() => $(flipbookRef.current).turn('previous')}
                            handleNextPage={() => $(flipbookRef.current).turn('next')}
                            handleZoomOut={() => $('.magazine-viewport').panzoom('zoom', true)} // Now zooms in
                            handleZoomIn={() => $('.magazine-viewport').panzoom('zoom', false)} // Now zooms out
                            toggleFullscreen={toggleFullscreen}
                            isFullscreen={isFullscreen}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        height: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    uploadContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        border: '2px dashed #ccc',
    },
    pdfViewer: {
        position: 'fixed', // This makes it overlay the entire screen
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000, // Set a high z-index to ensure it appears above the Header
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center',    // Center vertically
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Optional: make the background semi-transparent for better focus
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '95%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    exitButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        zIndex: 11,
    },
    exitIcon: {
        width: '24px',
        height: '24px',
    },
    magazineViewport: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: 'auto',
        maxHeight: '90%', // Ensure it does not exceed viewport height
        overflow: 'hidden', // Hide overflow if needed
    },
    magazine: {
        transform: 'translateX(0)',
        height: '100%', // Ensure the magazine has full height
    },
    page: {
        height: '100%', // Each page should take the full height
        display: 'flex',
        justifyContent: 'center', // Center the image
        alignItems: 'center', // Center the image
    },
    image: {
        maxHeight: '100%', // Ensure the image does not exceed the page height
        maxWidth: '100%', // Ensure the image does not exceed the page width
        objectFit: 'contain', // Maintain aspect ratio
    },
    menu: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        background: 'rgb(255, 255, 255)',
        width: '100%',
        height: '5%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
};


export default Demo;
