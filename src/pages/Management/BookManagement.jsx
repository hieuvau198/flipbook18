import React, { useState, useEffect } from "react";
import { fetchSavedPdfByCollection, deletePdfByIdAndCollection, updatePdfByIdAndCollection } from "../../utils/firebaseUtils"; // Adjust the path as needed
import "../../styles/App.css";

const BookManagement = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null); // State for the selected PDF to update
  const [newName, setNewName] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // Fetch the PDF files from the collection
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSavedPdfByCollection("pdfFiles"); // Fetching from 'pdfFiles' collection
        setPdfFiles(data);
      } catch (error) {
        console.error("Error fetching PDF files:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Function to handle update
  const handleUpdate = async (pdf) => {
    setSelectedPdf(pdf); // Set the selected PDF to state for updating
    setNewName(pdf.name || ""); // Pre-fill form with current values
    setNewAuthor(pdf.author || ""); 
    setNewStatus(pdf.status || "");
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (selectedPdf) {
      try {
        await updatePdfByIdAndCollection(
          selectedPdf.id,
          "pdfFiles", // Collection name
          newName,
          newAuthor,
          newStatus
        );
        setPdfFiles((prevFiles) =>
          prevFiles.map((pdf) =>
            pdf.id === selectedPdf.id
              ? { ...pdf, name: newName, author: newAuthor, status: newStatus }
              : pdf
          )
        );
        setSelectedPdf(null); // Clear selected PDF after update
      } catch (error) {
        console.error("Error updating PDF:", error);
      }
    }
  };

  const handleDelete = async (pdfId) => {
    const confirmed = window.confirm("Are you sure you want to delete this PDF?");
    if (!confirmed) return;

    try {
      await deletePdfByIdAndCollection(pdfId, "pdfFiles"); // Call the delete function
      setPdfFiles((prevFiles) => prevFiles.filter((pdf) => pdf.id !== pdfId)); // Update state after deletion
    } catch (error) {
      console.error("Error deleting PDF:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-vh-100"> {/* Ensures full page height */}
      <div className="management-container">
        <div className="row mt-4">
          <div className="col-lg-4"></div>
          <div className="col-lg-7">
            <table className="table border border-light">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Date</th>
                  <th scope="col">Author</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pdfFiles.map((pdf, index) => (
                  <tr key={pdf.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{pdf.name}</td>
                    <td>
                      {pdf.viewedAt
                        ? new Date(pdf.viewedAt).toLocaleDateString()
                        : "Unknown"}
                    </td>
                    <td>{pdf.author || "Unknown"}</td>
                    <td>
                      <button className="btn btn-secondary" onClick={() => handleDelete(pdf.id)}>
                        Delete
                      </button>
                      <button className="btn btn-primary" onClick={() => handleUpdate(pdf)}>
                        Update
                      </button>
                      <button className="btn btn-secondary">
                        Disable
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Update Form */}
            {selectedPdf && (
              <form onSubmit={handleUpdateSubmit}>
                <h3>Update PDF</h3>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Author</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <input
                    type="text"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="form-control"
                  />
                </div>
                <button type="submit" className="btn btn-success">
                  Save Changes
                </button>
              </form>
            )}
          </div>
          <div className="col-lg-1"></div>
        </div>
      </div>
    </div>
  );
};

export default BookManagement;
