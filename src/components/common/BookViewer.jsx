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

    const renderPdfToFlipbook = async (pdf) => {
        const flipbook = $(flipbookRef.current);
        flipbook.empty();

        const pages = [];
        for (let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i + 1);
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;
            pages.push(canvas);
        }

        pages.forEach((canvas) => {
            const pageContainer = document.createElement('div');
            pageContainer.className = 'flipbook-page image';
            pageContainer.appendChild(canvas);
            flipbook.append(pageContainer);
        });

        flipbook.turn({
            width: 922,
            height: 600,
            autoCenter: true,
            display: 'double',
            elevation: 50,
            gradients: true,
        });
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

        const posX = e.clientX;
        const posY = e.clientY;

        result.style.cssText = `
            background-image: url(${imgElement.toDataURL()});
            background-size: ${imgElement.width * size}px ${imgElement.height * size}px;
            background-position: ${x}% ${y}% ;
            left: ${posX}px;
            top: ${posY}px;
            display: block;
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
        <div ref={containerRef} className="flipbook-container">
            <div className="flipbook-pdf-viewer">
                <div className={`flipbook-magazine-viewport ${isMagnifyEnabled ? 'zoomer' : ''}`}>
                    <div
                        ref={flipbookRef}
                        className="flipbook-magazine"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    ></div>
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
                <Toolbar
                    toggleFullscreen={toggleFullscreen}
                    isFullscreen={isFullscreen}
                    onToggleMagnify={toggleMagnify}
                    isMagnifyEnabled={isMagnifyEnabled}
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
