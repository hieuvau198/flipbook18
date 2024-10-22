import React, { useRef, useState, useEffect } from "react";
import Toolbar from "./Toolbar.jsx";
import BookViewerSidebar from "./BookViewerSideBar.jsx";
import { usePdf } from "../../contexts/PdfContext.jsx";
import previousIcon from "../../assets/icons/previous.svg";
import nextIcon from "../../assets/icons/next.svg";
import { loadPdfDocument } from "../../utils/pdfUtils.js";
import "../../assets/css/flipbook.css";
import $ from "jquery";

const BookViewer = ({ pdfUrl }) => {
  const containerRef = useRef(null);
  const flipbookRef = useRef(null);
  const resultRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [isMagnifyEnabled, setIsMagnifyEnabled] = useState(false);
  const [pageImages, setPageImages] = useState([]);
  const [textPages, setTextPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const { setIsRenderingFlipbook } = usePdf();

  const [scale, setScale] = useState(1); // Thêm state cho zoom
  const startPosition = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const initialState = useRef({
    scale: 1,
    position: { x: 0, y: 0 },
    isFullscreen: false,
  });

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
    // setIsRenderingFlipbook(true);
    const flipbook = $(flipbookRef.current);
    flipbook.empty();
    const pages = [];
    const scaleFactor = 1.3;
    const initialLoadPages = 10;

    const deviceHeight = window.innerHeight;
    const deviceWidth = window.innerWidth;

    console.log("Device Height x Width: ", deviceHeight, " x ", deviceWidth);

    const renderPage = async (pageIndex) => {
      const page = await pdf.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale: scaleFactor });

      const scale = window.devicePixelRatio || 1;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.height = viewport.height * scale;
      canvas.width = viewport.width * scale;
      context.scale(scale, scale);

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
      width: 922 * scaleFactor,
      height: 600 * scaleFactor,
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

    // Điều khiển Alt + 0 để reset view
    if (e.altKey && e.key === "0") {
      resetView(); // Gọi hàm reset view
    }

    // Điều khiển Alt + + để zoom in
    if (e.altKey && (e.key === "+" || e.key === "=")) {
      e.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
      handleZoomIn(); // Gọi hàm zoom in
    }

    // Điều khiển Alt + - để zoom out
    if (e.altKey && (e.key === "-" || e.key === "_")) {
      e.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
      handleZoomOut(); // Gọi hàm zoom out
    }

    if (e.key === "F" || e.key === "f") {
      toggleFullscreen();
    }
  };

  // Hàm reset trạng thái
  const resetView = () => {
    setScale(initialState.current.scale);
    setPosition(initialState.current.position);
    if (isFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  // Zoom In và Zoom Out
  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2)); // Giới hạn zoom tối đa là 2
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // Giới hạn zoom tối thiểu là 0.5
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

  useEffect(() => {
    setIsRenderingFlipbook(true); // Set flipbook rendering to true when the component mounts

    // Cleanup function runs when the component unmounts
    return () => {
      setIsRenderingFlipbook(false); // Set flipbook rendering to false when the component unmounts (i.e., closed)
    };
  }, []);

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
        className={`flipbook-magazine-viewport ${
          isMagnifyEnabled ? "zoomer" : ""
        }`}
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`, // Zoom và Pan
          transition: "transform 0.3s ease",
        }}
      >
        <div ref={flipbookRef} className="flipbook-magazine"></div>
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
        handleZoomIn={handleZoomIn} // Nút Zoom In
        handleZoomOut={handleZoomOut} // Nút Zoom Out
        handleResetView={resetView}
        
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
