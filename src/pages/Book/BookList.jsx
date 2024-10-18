import React, { useState, useEffect } from "react";
import SavedPdfList from "../../components/common/SavedPdfList";
import {
  fetchSavedPdfs,
  fetchPdfBySearchNameAndAuthor,
  fetchPdfByCategoryName,
  fetchPdfByAuthor,
  fetchCategories,
  fetchAuthorName,
} from "../../utils/firebaseUtils";
import { useSearchParams, useNavigate } from "react-router-dom";

const BookList = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("Recently"); // New order state
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sortedPdfs = (pdfs) => {
    switch (selectedOrder) {
      case "Recently":
        return pdfs.sort((a, b) => b.viewedAt - a.viewedAt); // Most recent first
      case "Oldest":
        return pdfs.sort((a, b) => a.viewedAt - b.viewedAt); // Oldest first
      case "Most Views":
        return pdfs.sort((a, b) => b.views - a.views); // Most views first
      case "Alphabet":
        return pdfs.sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical order
      default:
        return pdfs;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategories, fetchedAuthors] = await Promise.all([
          fetchCategories(),
          fetchAuthorName(),
        ]);
        setCategories(fetchedCategories.map((cat) => cat.name));
        setAuthors(fetchedAuthors);

        const searchTerm = searchParams.get("s");
        let pdfs = searchTerm
          ? await fetchPdfBySearchNameAndAuthor(searchTerm)
          : await fetchSavedPdfs();

        const categoryFilter = selectedCategories.length
          ? selectedCategories
          : searchParams.getAll("c");
        const authorFilter = selectedAuthors.length
          ? selectedAuthors
          : searchParams.getAll("a");

        if (categoryFilter.length) {
          const categoryPdfs = await Promise.all(
            categoryFilter.map((cat) => fetchPdfByCategoryName(cat))
          );
          pdfs = pdfs.filter((pdf) =>
            categoryPdfs.flat().some((categoryPdf) => categoryPdf.id === pdf.id)
          );
        }
        if (authorFilter.length) {
          const authorPdfs = await Promise.all(
            authorFilter.map((auth) => fetchPdfByAuthor(auth))
          );
          pdfs = pdfs.filter((pdf) =>
            authorPdfs.flat().some((authorPdf) => authorPdf.id === pdf.id)
          );
        }

        pdfs = sortedPdfs(pdfs); // Sort PDFs based on selected order
        setPdfFiles(pdfs);
      } catch (error) {
        console.error("Failed to fetch PDF files or filters", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, selectedCategories, selectedAuthors, selectedOrder]); // Add selectedOrder to dependencies

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
    updateUrl("c", updatedCategories);
  };

  const handleAuthorChange = (author) => {
    const updatedAuthors = selectedAuthors.includes(author)
      ? selectedAuthors.filter((auth) => auth !== author)
      : [...selectedAuthors, author];
    setSelectedAuthors(updatedAuthors);
    updateUrl("a", updatedAuthors);
  };

  const updateUrl = (param, values) => {
    const params = new URLSearchParams(searchParams);
    params.delete(param);
    values.forEach((value) => params.append(param, value));
    navigate(`/book?${params.toString()}`);
  };

  return (
    <div className="flex">
      <div className="w-1/6 p-4 mt-10">
        {/* Order By Selection */}
        <div>
          <h3>Order</h3>
          <div>
            {["Recently", "Oldest", "Most Views", "Alphabet"].map((option) => (
              <label
                key={option}
                style={{ display: "block", marginBottom: "5px" }}
              >
                <input
                  type="radio"
                  value={option}
                  checked={selectedOrder === option}
                  onChange={() => setSelectedOrder(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
        <h2>Category</h2>
        <div>
          {categories.map((cat, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  value={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                {cat}
              </label>
            </div>
          ))}
        </div>

        <div>
          <h3>Author</h3>
          {authors.map((author, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  value={author}
                  checked={selectedAuthors.includes(author)}
                  onChange={() => handleAuthorChange(author)}
                />
                {author}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="w-5/6 mt-10">
        {loading ? (
          <p>Loading PDFs...</p>
        ) : (
          <SavedPdfList
            pdfFiles={pdfFiles}
            onSelectPdf={(pdf) => navigate(`/book?b=${pdf.id}`)}
          />
        )}
      </div>
    </div>
  );
};

export default BookList;
