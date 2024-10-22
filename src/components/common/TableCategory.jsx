import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  updateCategory,
  fetchSavedPdfById,
  fetchSavedPdfs,
} from "../../utils/firebaseUtils";
import "../../styles/App.css";

const TableCategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pdfIds, setPdfIds] = useState([]);
  const [availablePdfs, setAvailablePdfs] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const loadAvailablePdfs = async () => {
      try {
        const pdfList = await fetchSavedPdfs();
        setAvailablePdfs(pdfList);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
      }
    };

    loadCategories();
    loadAvailablePdfs();
  }, []);

  const handleUpdate = async (category) => {
    setSelectedCategory(category);
    setName(category.name);
    setDescription(category.description);

    // Fetch the full PDF details for the selected category
    const pdfPromises = category.pdfIds.map((id) => fetchSavedPdfById(id));
    const fetchedPdfs = await Promise.all(pdfPromises);
    setPdfIds(fetchedPdfs.filter((pdf) => pdf)); // Filter out any nulls

    // Filter available PDFs to exclude those already in the selected category
    const filteredAvailablePdfs = await fetchSavedPdfs();
    const existingPdfIds = category.pdfIds.map(id => id.toString()); // Convert to string if necessary
    const updatedAvailablePdfs = filteredAvailablePdfs.filter(pdf => !existingPdfIds.includes(pdf.id));
    setAvailablePdfs(updatedAvailablePdfs);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const pdfIdList = pdfIds.map((pdf) => pdf.id);
      await updateCategory(selectedCategory.id, name, description, pdfIdList);
      alert("Category updated successfully!");
      // Reset state and reload categories
      setSelectedCategory(null);
      setName("");
      setDescription("");
      setPdfIds([]);
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handlePdfSelection = (event) => {
    const selectedPdfId = event.target.value;
    const selectedPdf = availablePdfs.find((pdf) => pdf.id === selectedPdfId);
    if (selectedPdf) {
      setPdfIds((prevIds) => [...prevIds, selectedPdf]);
      setAvailablePdfs((prevPdfs) =>
        prevPdfs.filter((pdf) => pdf.id !== selectedPdfId)
      );
    }
  };

  const handleRemovePdfId = (index) => {
    const removedPdf = pdfIds[index];
    setAvailablePdfs((prevAvailable) => [...prevAvailable, removedPdf]); // Add back to available PDFs
    setPdfIds((prevIds) => prevIds.filter((_, i) => i !== index)); // Remove from selected PDFs
  };

  const handleDelete = async (categoryId) => {
    // Implement the delete logic if needed
  };

  return (
    <div className="category-container">
      <table className="table border border-light">
        <thead className="thead-dark">
          <tr>
          <th scope="col" className="col-1">#</th>
      <th scope="col" className="col-2">Name</th>
      <th scope="col" className="col-7">Description</th>
      <th scope="col" className="col-1"></th>
      <th scope="col" className="col-1"></th>
            
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id}>
              <th scope="row">{index + 1}</th>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleUpdate(category)}
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="category-remove-button"
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Form */}
      {selectedCategory && (
        <form onSubmit={handleUpdateSubmit}>
          <h3>Update Category</h3>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Associated PDFs</label>
            {pdfIds.map((pdf, index) => (
              <div key={index} className="category-pdfId-row">
                <input
                  type="text"
                  value={pdf.name}
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
            <select onChange={handlePdfSelection} className="category-select">
              <option value="">Select a PDF</option>
              {availablePdfs.map((pdf) => (
                <option key={pdf.id} value={pdf.id}>
                  {pdf.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="category-submit-button">
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default TableCategory;
