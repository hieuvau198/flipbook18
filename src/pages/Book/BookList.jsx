import React, { useState, useEffect } from "react";
import SavedPdfList from "../../components/common/SavedPdfList";
import { fetchSavedPdfs, fetchPdfBySearchNameAndAuthor } from "../../utils/firebaseUtils";
import { useSearchParams, useNavigate } from "react-router-dom"; 

const BookList = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchTerm = searchParams.get("s"); // Extract the 's' param
        let pdfs;

        if (searchTerm) {
          // If there's a search term, fetch PDFs based on the search
          pdfs = await fetchPdfBySearchNameAndAuthor(searchTerm);
        } else {
          // If no search term, fetch all saved PDFs
          pdfs = await fetchSavedPdfs();
          console.log("All saved PDFs: ", pdfs);
        }

        setPdfFiles(pdfs);
      } catch (error) {
        console.error("Failed to fetch PDF files", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]); 

  const handleSelectPdf = (pdf) => {
    navigate(`/book?b=${encodeURIComponent(pdf.id)}`);
  };

  return (
    <div className="mt-10">
      {loading ? (
        <p>Loading PDFs...</p>
      ) : (
        <SavedPdfList pdfFiles={pdfFiles} onSelectPdf={handleSelectPdf} />
      )}
    </div>
  );
};

export default BookList;
