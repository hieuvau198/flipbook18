import React, { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import $ from "jquery";
import turnJs from "../../assets/js/turn.js";
import '../../styles/PdfViewer.css';
import Toolbar from "./Toolbar.jsx"; // Import the Toolbar component

function JqueryPdfViewer({ pdfFile }) {
  const flipbookContainerRef = useRef(null);
  const flipbookRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [loadedPages, setLoadedPages] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [containerHeight, setContainerHeight] = useState(600);
  const isMounted = useRef(true);

  const onDocumentLoadSuccess = ({ numPages }) => {
    if (isMounted.current) {
      setNumPages(numPages);
    }
  };

  const loadPages = async () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <div key={i} className="page">
          <Page pageNumber={i} width={450 * zoomLevel} />
        </div>
      );
    }
    if (isMounted.current) {
      setLoadedPages(pages);
    }
  };

  useEffect(() => {
    if (numPages > 0) {
      loadPages();
    }
  }, [numPages, zoomLevel]);

  useEffect(() => {
    if (loadedPages.length > 0) {
      if ($.fn.turn) {
        $(flipbookRef.current).turn({
          width: 900 * zoomLevel,
          height: containerHeight * zoomLevel,
          autoCenter: true,
          pages: numPages,
          when: {
            turning: function (event, page) {
              console.log("Turning to page:", page);
            },
            turned: function (event, page) {
              console.log("Turned to page:", page);
            },
          },
        });
      }

      return () => {
        $(flipbookRef.current).turn("destroy");
      };
    }
  }, [loadedPages, numPages, zoomLevel]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ($.fn.turn) {
        if (e.key === "ArrowRight") {
          $(flipbookRef.current).turn("next");
        } else if (e.key === "ArrowLeft") {
          $(flipbookRef.current).turn("previous");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Toolbar Actions
  const handleNextPage = () => {
    $(flipbookRef.current).turn("next");
  };

  const handlePreviousPage = () => {
    $(flipbookRef.current).turn("previous");
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.2, 2)); // Max zoom 2x
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.2, 0.6)); // Min zoom 0.6x
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (flipbookContainerRef.current.requestFullscreen) {
        flipbookContainerRef.current.requestFullscreen();
      } else if (flipbookContainerRef.current.mozRequestFullScreen) {
        flipbookContainerRef.current.mozRequestFullScreen();
      } else if (flipbookContainerRef.current.webkitRequestFullscreen) {
        flipbookContainerRef.current.webkitRequestFullscreen();
      } else if (flipbookContainerRef.current.msRequestFullscreen) {
        flipbookContainerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className="jquery-pdf-viewer">
      <div ref={flipbookContainerRef} className="flipbook-container">
        {/* Use the extracted Toolbar component */}
        <Toolbar
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          handleZoomOut={handleZoomOut}
          handleZoomIn={handleZoomIn}
          toggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
        />

        {/* Flipbook Viewer */}
        {pdfFile ? (
          <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
            <div className="flipbook-wrapper" ref={flipbookRef}>
              {loadedPages.map((page) => page)}
            </div>
          </Document>
        ) : (
          <p>No PDF file uploaded.</p>
        )}
      </div>
    </div>
  );
}

export default JqueryPdfViewer;
