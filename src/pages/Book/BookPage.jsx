// src/pages/BookPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {fetchSavedPdfById, fetchRandomPdfs, fetchCategoriesByPdfId, incrementPdfViews } from "../../utils/firebaseUtils";
import JqueryPdfViewer from "../../components/common/JqueryPdfViewer";
import BookViewer from "../../components/common/BookViewer";
import ShareButton from "../../components/common/ShareButton";
import BookList from "./BookList";
import "../../styles/App.css";
import { Container } from "postcss";


const BookPage = () => {
  const [searchParams] = useSearchParams();
  const b = searchParams.get("b") || "";

  const [searchValue, setSearchValue] = useState(b);
  const [pdfData, setPdfData] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const handleToggleFullScreen = async() => {
    setIsFullScreen(!isFullScreen);
    if(!isFullScreen && pdfData && pdfData.id){
      await incrementPdfViews(pdfData.id, "pdfFiles");
    }
  };

  const handleNavigateToAnotherBook = (selectedId) => {
    navigate(`/book?b=${encodeURIComponent(selectedId)}`);
  };

  useEffect(() => {
    const fetchPdf = async () => {
        if(b) {
            try{
                const fetchedPdf = await fetchSavedPdfById(b);
                if (fetchedPdf) {
                    setPdfData(fetchedPdf);
                }else {
                    setPdfData(null);
                }
            } catch (error)
            {
                setPdfData(null);
            }
        }
    }
    fetchPdf();
  }, [b]);

  useEffect(() => {
    // Fetch 7 random books when the component mounts
    const getRandomBooks = async () => {
      try {
        const randomBooks = await fetchRandomPdfs(7); // Fetch 3 random books
        setSuggestedBooks(randomBooks);
      } catch (error) {
        console.error("Error fetching random books: ", error);
      }
    };

    getRandomBooks();
  }, []);

  useEffect(() => {
    // Fetch categories for the PDF once pdfData is available
    const loadCategories = async () => {
      if (pdfData && pdfData.id) {
        try {
          const fetchedCategories = await fetchCategoriesByPdfId(pdfData.id);
          setCategories(fetchedCategories);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      }
    };

    loadCategories();
  }, [pdfData]);

  // Listen for "Esc" key press to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event) => {
        if (event.key === 'Escape' && isFullScreen) {
            handleToggleFullScreen();
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
}, [isFullScreen]);

  // If no "b" parameter or no valid PDF data, show BookList component
  if (!b || !pdfData) {
    return <BookList />;
  }

  
  return (
    <>
      <div className="book-style-container">
      <div className="book-style-flex-row">
        {/* Left Side - Cover Image */}
        <div className="book-style-cover-container">
          <img
            src={pdfData && pdfData.coverPageUrl ? pdfData.coverPageUrl : "images/insta-item1.jpg"}
            alt="Manga Cover"
            className="book-style-cover-image"
            // onLoad={(e) => {
            //   const { naturalWidth, naturalHeight } = e.target; // Get the natural dimensions of the image
            //   console.log(`Cover Page Width: ${naturalWidth}px, Height: ${naturalHeight}px`);
            // }}
          />
        </div>

        {/* Right Side - Details */}
        <div className="book-style-details-container">
          <div>
            <h1>{pdfData && pdfData.name ? pdfData.name : "Some Book Name"}</h1>
            <p><strong>Author:</strong> {pdfData && pdfData.author ? pdfData.author : "Some Author"}</p>
            <p><strong>Upload:</strong> {"In development"}</p>
            <p><strong>Status:</strong> {pdfData && pdfData.status ? pdfData.status : "Ongoing"}</p>
            <p><strong>Views:</strong> {pdfData && pdfData.views ? pdfData.views : "0 views"}</p>
            <p>
              <strong>Description:</strong> This is a static description of the book.
              This is a static description of the book.
            </p>

            {/* Tags/Categories */}
            <div className="book-style-genres">
                <strong>Category:</strong>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <span key={category.id} className="book-style-genre">
                      {category.name}
                    </span>
                  ))
                ) : (
                  <span className="book-style-genre">No categories available</span>
                )}
              </div>
          </div>

          {/* Read/Bookmark/Share Buttons */}
          <div className="book-style-buttons-container">
            <button 
                className="book-style-button"
                onClick={handleToggleFullScreen}
            >
                Read Now
            </button>
            <button className="book-style-button">Bookmark</button>
            <ShareButton></ShareButton>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="book-style-chapters">
        <h2>Chapters</h2>
        <ul className="book-style-chapter-list">
          <li className="book-style-chapter-item">
            <a href="#chapter1" className="book-style-chapter-link">
              In Development
            </a>
            <span className="book-style-chapter-date">In Development</span>
          </li>
          <li className="book-style-chapter-item">
            <a href="#chapter2" className="book-style-chapter-link">
            In Development
            </a>
            <span className="book-style-chapter-date">In Development</span>
          </li>
          <li className="book-style-chapter-item">
            <a href="#chapter3" className="book-style-chapter-link">
            In Development
            </a>
            <span className="book-style-chapter-date">In Development</span>
          </li>
        </ul>
      </div>

      {/* Other Books Suggestions */}
      <div className="book-style-other-manga">
        <h2>Other Books You Might Like</h2>
        <div className="book-style-manga-suggestions">
        {suggestedBooks.length > 0 ? (
            suggestedBooks.map((book) => (
              <div className="book-style-manga-item" key={book.id}>
                <img
                  src={book.coverPageUrl || 'images/default-cover.jpg'} // Default image if no coverPageUrl
                  alt={book.name}
                  className="book-style-manga-image"
                  onClick={() => handleNavigateToAnotherBook(book.id)}
                />
                <p className="book-style-manga-title">{book.name}</p>
              </div>
            ))
          ) : (
            <p>Loading book suggestions...</p>
          )}
        </div>
      </div>
    </div>

    {/* Display book fullscreen overlay */}
    <div>
      {isFullScreen && (
        <div className="read-pdf-overlay">
          {/* Centered and responsive PDF viewer */}
          <div className="read-pdf-container" style={container}>
            <BookViewer pdfUrl={pdfData.url} className="read-pdf-viewer" />
          </div>
        </div>
      )}
    </div>
    </>
  );
};

const container = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
};


  
export default BookPage;
