import React, { useState, useEffect } from "react";
import SavedPdfList from "../../components/common/SavedPdfList";
import { fetchSavedPdfs, fetchPdfBySearchNameAndAuthor } from "../../utils/firebaseUtils";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams

const BookList = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams(); // Get search params from the URL

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
  }, [searchParams]); // Re-run the effect whenever the search params change

  const handleSelectPdf = (pdf) => {
    // Handle the event when a PDF is selected
    console.log("Selected PDF: ", pdf);
    // You can navigate to the Flipbook page or perform other actions
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
