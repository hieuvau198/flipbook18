import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SavedPdfList from "../../components/common/SavedPdfList.jsx";
import UploadComponent from "../../components/common/UploadComponent.jsx";
import { fetchSavedPdfs, fetchPdfByCategoryName, fetchCategories } from "../../utils/firebaseUtils.js";
import Demo from "../Demo/Demo.jsx";
import Demo2 from "../Demo2/Demo2.jsx";
import Demo3 from "../Demo3/Demo 3 .jsx";
import Demo4 from "../Demo4/Demo4.jsx";

function User() {
  const [allPdfFiles, setAllPdfFiles] = useState([]);
  const [categoryPdfFiles, setCategoryPdfFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Economic");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handlePdfSelect = (pdf) => {
    navigate(`/book?b=${encodeURIComponent(pdf.id)}`);
  };

  // Fetch categories and all PDFs on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const pdfFiles = await fetchSavedPdfs();
        setAllPdfFiles(pdfFiles);
        const categoryList = await fetchCategories();
        setCategories(categoryList);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch PDFs based on selected category
  useEffect(() => {
    const fetchPdfsByCategory = async () => {
      if (!selectedCategory) return;

      try {
        const pdfFilesByCategory = await fetchPdfByCategoryName(selectedCategory);
        setCategoryPdfFiles(pdfFilesByCategory);
      } catch (error) {
        console.error("Error fetching PDFs by category: ", error);
      }
    };

    fetchPdfsByCategory();
  }, [selectedCategory]);

  // Handle category selection from the dropdown
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <>
      {/* Apply demo 1 */}
      <div className="row">
        <div className="col-lg-12">
          <Demo></Demo>
        </div>
        <div className="col-lg-12">{/* <Demo2></Demo2> */}</div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <Demo2></Demo2>
        </div>
      </div>

      {/* Upload Component */}
      <div>
        <UploadComponent />
      </div>
      {/* Apply Demo 3 */}
      <div className="row">
        <div className="col-lg-12">
          <Demo3 /> {/* Add Demo3 here */}
        </div>
      </div>

      {/* Saved PDF List */}
      <div>
        <div className="mt-10">
          {isLoading ? (
            <p>Loading PDFs...</p>
          ) : (
            <SavedPdfList onSelectPdf={handlePdfSelect} pdfFiles={allPdfFiles} />
          )}
        </div>
      </div>

      {/* Apply Category */}
      <div className="row mt-6">
        <div className="col-lg-12">
          <h2 className="text-center">Category (In Development) </h2>
          <div className="d-flex justify-content-end">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="form-select w-25 mb-10 mt-10 mr-20"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {isLoading ? (
            <p>Loading PDFs...</p>
          ) : (
            <SavedPdfList
              onSelectPdf={handlePdfSelect}
              pdfFiles={categoryPdfFiles}
            />
          )}
        </div>
      </div>

      
    </>
  );
}

export default User;
