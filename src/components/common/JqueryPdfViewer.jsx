import React, { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import $ from "jquery";
import turnJs from "../../assets/js/turn.js";
import '../../styles/App.css';

function JqueryPdfViewer({ pdfFile }) {
  const flipbookRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [loadedPages, setLoadedPages] = useState([]);
  const [containerHeight, setContainerHeight] = useState(600);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    console.log("Document loaded successfully. Number of pages:", numPages);
  };

  const loadPages = async () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <div key={i} className="page">
          <Page pageNumber={i} width={450} />
        </div>
      );
    }
    setLoadedPages(pages);
    console.log("Pages loaded:", pages.length);
  };

  useEffect(() => {
    if (numPages > 0) {
      loadPages();
    }
  }, [numPages]);

  useEffect(() => {
    console.log("Checking if jQuery and Turn.js are available.");
    console.log("jQuery:", !!$);
    console.log("Turn.js:", typeof $.fn.turn);

    if (loadedPages.length > 0) {
      console.log("Initializing Turn.js with loaded pages.");
      if ($.fn.turn) {
        $(flipbookRef.current).turn({
          width: 900,
          height: containerHeight,
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
      } else {
        console.error("Turn.js is not a function.");
      }

      return () => {
        console.log("Cleaning up Turn.js.");
        $(flipbookRef.current).turn("destroy");
      };
    }
  }, [loadedPages, numPages]);

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

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="jquery-pdf-viewer">
      {pdfFile ? (
        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          <div className="flipbook-container" ref={flipbookRef}>
            {loadedPages.map((page) => page)}
          </div>
        </Document>
      ) : (
        <p>No PDF file uploaded.</p>
      )}
    </div>
  );
}

export default JqueryPdfViewer;
