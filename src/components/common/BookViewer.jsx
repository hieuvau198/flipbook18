import React, { useRef, useState, useEffect } from "react";
import Toolbar from "./Toolbar.jsx";
import BookViewerSidebar from "./BookViewerSideBar.jsx";
import previousIcon from "../../assets/icons/previous.svg";
import nextIcon from "../../assets/icons/next.svg";
import { loadPdfDocument } from "../../utils/pdfUtils.js";
import "../../assets/css/flipbook.css";
import $ from "jquery";

const BookViewer = ({ pdfUrl }) => {
  const containerRef = useRef(null);
  const flipbookRef = useRef(null);
  const resultRef = useRef(null);

  // State variables
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [isMagnifyEnabled, setIsMagnifyEnabled] = useState(false);
  const [pageImages, setPageImages] = useState([]);
  const [textPages, setTextPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [pdfHeight, setPdfHeight] = useState(null);  // New height state
  const [pdfWidth, setPdfWidth] = useState(null);    // New width state
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

  const extractTextFromPdf = async (pdf) => {
    const pagesText = [];
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      pagesText.push(pageText);
    }
    setTextPages(pagesText);
  };

  const renderPdfToFlipbook = async (pdf) => {
    const flipbook = $(flipbookRef.current);
    flipbook.empty();
    const pages = [];
    const scaleFactor = 1.55;
    const initialLoadPages = 10;
    let firstPageWidth, firstPageHeight, contextScale;

    const renderPage = async (pageIndex) => {
      const page = await pdf.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale: scaleFactor });

      const width = viewport.width;
      const height = viewport.height;

      if (pageIndex === 0) {
        // Store the width and height of the first page
        firstPageWidth = width;
        firstPageHeight = height;
        console.log(`Page ${pageIndex + 1} - Width: ${width}, Height: ${height}`);
        console.log(`Page ${pageIndex + 1} - firstPageWidth: ${width}, firstPageHeight: ${height}`);
      }

      // Set height and width of the PDF page
      setPdfHeight(height);
      setPdfWidth(width);

      const scale = window.devicePixelRatio || 1;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.height = viewport.height * scale;
      canvas.width = viewport.width * scale;
      context.scale(scale, scale);
      

      if (pageIndex === 0) {
        contextScale = scale;
        console.log(`Canvas ${pageIndex + 1} - w: ${canvas.width}, h: ${canvas.height}`);
      }

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      pages.push(canvas);
      const newPageImage = canvas.toDataURL();
      setPageImages((prevImages) => [...prevImages, newPageImage]);

      const pageContainer = document.createElement("div");
      pageContainer.className = "flipbook-page image";
      pageContainer.appendChild(canvas);
      flipbook.append(pageContainer);

      if (flipbook.turn("is")) {
        flipbook.turn("addPage", pageContainer, pageIndex + 1);
      }

      $(flipbookRef.current).css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      });
    };

    for (let i = 0; i < Math.min(initialLoadPages, pdf.numPages); i++) {
      await renderPage(i);
    }

    flipbook.turn({
      width: firstPageWidth * contextScale,  // Use the first page's width
      height: firstPageHeight * contextScale,  // Use the first page's height
      autoCenter: true,
      display: "double",
      elevation: 50,
      gradients: true,
      when: {
        turned: (event, page) => {
          setCurrentPage(page);
        },
      },
    });

    const loadRemainingPages = async () => {
      for (let i = initialLoadPages; i < pdf.numPages; i++) {
        await renderPage(i);
      }
    };

    loadRemainingPages();
  };

  const handleSearch = () => {
    const results = [];
    textPages.forEach((text, index) => {
      if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push(index + 1);
      }
    });
    setSearchResults(results);
    setCurrentResultIndex(0);
    if (results.length > 0) {
      $(flipbookRef.current).turn("page", results[0]);
    }
  };

  const handlePageClick = (page) => {
    $(flipbookRef.current).turn("page", page);
  };

  const handleKeyPress = (e) => {
    const leftKeys = ["ArrowLeft", "ArrowUp", "A", "W", "a", "w"];
    const rightKeys = ["ArrowRight", "ArrowDown", "S", "D", "s", "d"];

    if (leftKeys.includes(e.key)) {
      $(flipbookRef.current).turn("previous");
    } else if (rightKeys.includes(e.key)) {
      $(flipbookRef.current).turn("next");
    }

    if (e.key === "Enter" && searchResults.length > 0) {
      const nextIndex = (currentResultIndex + 1) % searchResults.length;
      $(flipbookRef.current).turn("page", searchResults[nextIndex]);
      setCurrentResultIndex(nextIndex);
    }
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

    // Cập nhật hình ảnh trong vùng kính lúp cố định
    result.style.cssText = `
        background-image: url(${imgElement.toDataURL()});
        background-size: ${imgElement.width * size}px ${imgElement.height * size}px;
        background-position: ${x}% ${y}%;
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
        extractTextFromPdf(pdf);
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
    <div
      className="flipbook-pdf-viewer"
      ref={containerRef}
      onKeyDown={handleKeyPress}
      tabIndex="0"
    >
      <BookViewerSidebar
        pages={pageImages}
        onPageClick={handlePageClick}
        currentPage={currentPage} // Pass current page to the sidebar
      />
      <div
        className={`flipbook-magazine-viewport ${isMagnifyEnabled ? "zoomer" : ""
          }`}
      >
        <div ref={flipbookRef} className="flipbook-magazine"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}>
        </div>
        <div ref={resultRef} className="result hide"></div> {/* Added this */}
      </div>

      <button
        className="flipbook-nav-button previous"
        onClick={() => $(flipbookRef.current).turn("previous")}
      >
        <img src={previousIcon} alt="Previous" style={styles.icon} />
      </button>
      <button
        className="flipbook-nav-button next"
        onClick={() => $(flipbookRef.current).turn("next")}
      >
        <img src={nextIcon} alt="Next" style={styles.icon} />
      </button>

      <Toolbar
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onToggleMagnify={toggleMagnify}
        isMagnifyEnabled={isMagnifyEnabled}
        searchTerm={searchTerm}
        onSearchChange={(newTerm) => {
          setSearchTerm(newTerm);
          handleSearch();
        }}
      />
    </div>
  );
};

const styles = {
  icon: {
    width: "24px",
    height: "24px",
  },
};

export default BookViewer;
