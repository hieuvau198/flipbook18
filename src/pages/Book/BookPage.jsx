// src/pages/BookPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {fetchSavedPdfById} from "../../utils/firebaseUtils";
import "../../styles/App.css";

const BookPage = () => {
  const [searchParams] = useSearchParams();
  const b = searchParams.get("b") || "";

  const [searchValue, setSearchValue] = useState(b);
  const [pdfData, setPdfData] = useState(null);

  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/book?b=${encodeURIComponent(searchValue)}`);
    }
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
  }, [b])

  return (
    <>
      {/* <div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter book ID or name"
        />

        <button onClick={handleSearch}>Search</button>

        {b ? (
          <p>You are viewing content for book: {b}</p>
        ) : (
          <p>No book selected</p>
        )}
      </div> */}

    
      <div className="book-style-container">
      <div className="book-style-flex-row">
        {/* Left Side - Cover Image */}
        <div className="book-style-cover-container">
          <img
            src={pdfData && pdfData.coverPageUrl ? pdfData.coverPageUrl : "images/insta-item1.jpg"}
            alt="Manga Cover"
            className="book-style-cover-image"
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

            {/* Tags/Genres */}
            <div className="book-style-genres">
              <strong>Genres:</strong>
              <span className="book-style-genre">In Development</span>
              <span className="book-style-genre">In Development</span>
              <span className="book-style-genre">In Development</span>
            </div>
          </div>

          {/* Read/Bookmark/Share Buttons */}
          <div className="book-style-buttons-container">
            <button className="book-style-button">Read Now</button>
            <button className="book-style-button">Bookmark</button>
            <button className="book-style-button">Share</button>
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

      {/* Other Manga Suggestions */}
      <div className="book-style-other-manga">
        <h2>Other Books You Might Like</h2>
        <div className="book-style-manga-suggestions">
          <div className="book-style-manga-item">
            <img
              src="images/insta-item2.jpg"
              alt="Manga 1"
              className="book-style-manga-image"
            />
            <p className="book-style-manga-title">In Development</p>
          </div>
          <div className="book-style-manga-item">
            <img
              src="images/insta-item3.jpg"
              alt="Manga 2"
              className="book-style-manga-image"
            />
            <p className="book-style-manga-title">In Development</p>
          </div>
          <div className="book-style-manga-item">
            <img
              src="images/insta-item4.jpg"
              alt="Manga 3"
              className="book-style-manga-image"
            />
            <p className="book-style-manga-title">In Development</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BookPage;
