import React, { useState, useEffect } from "react";
import {
  saveCategoryToFirestore,
  fetchSavedPdfs,
} from "../../utils/firebaseUtils";
import "../../styles/App.css";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pdfIds, setPdfIds] = useState([]);
  const [availablePdfs, setAvailablePdfs] = useState([]);

  // Fetch PDFs from Firebase on component mount
  useEffect(() => {
    const loadPdfs = async () => {
      try {
        const pdfList = await fetchSavedPdfs();
        setAvailablePdfs(pdfList); // Store the available PDFs
      } catch (error) {
        console.error("Error fetching PDFs:", error);
      }
    };

    loadPdfs();
  }, []);

  const handlePdfSelection = (event) => {
    const selectedPdfId = event.target.value;
    if (selectedPdfId) {
      const selectedPdf = availablePdfs.find((pdf) => pdf.id === selectedPdfId);
      setPdfIds([...pdfIds, selectedPdf]);

      // Remove the selected PDF from the available list
      setAvailablePdfs(availablePdfs.filter((pdf) => pdf.id !== selectedPdfId));
    }
  };

  const handleRemovePdfId = (index) => {
    const removedPdf = pdfIds[index];

    // Re-add the removed PDF to the available list
    setAvailablePdfs(
      [...availablePdfs, removedPdf].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    );

    const updatedPdfIds = [...pdfIds];
    updatedPdfIds.splice(index, 1);
    setPdfIds(updatedPdfIds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save only the IDs of selected PDFs
      const selectedPdfIds = pdfIds.map((pdf) => pdf.id);
      await saveCategoryToFirestore(name, description, selectedPdfIds);
      alert("Category saved successfully!");
      setName("");
      setDescription("");
      setPdfIds([]);
      setAvailablePdfs(await fetchSavedPdfs()); // Reset available PDFs after submission
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <div className="category-container">
      <h2 className="category-header">Add New Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="category-form-group">
          <label className="category-label">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="category-input"
            required
          />
        </div>

        <div className="category-form-group">
          <label className="category-label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="category-textarea"
            required
          ></textarea>
        </div>

        {/* Conditionally render the Books section if there are selected PDFs */}
        {pdfIds.length > 0 && (
          <div className="category-form-group">
            <label className="category-label">Books</label>
            {pdfIds.map((pdf, index) => (
              <div key={index} className="category-pdfId-row">
                <input
                  type="text"
                  value={pdf.name} // Now displays the correct PDF name
                  className="category-input"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => handleRemovePdfId(index)}
                  className="category-remove-button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="category-form-group">
          <select onChange={handlePdfSelection} className="category-select">
            <option value="">Select a Book</option>
            {availablePdfs.map((pdf) => (
              <option key={pdf.id} value={pdf.id}>
                {pdf.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="category-submit-button">
          Save Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
