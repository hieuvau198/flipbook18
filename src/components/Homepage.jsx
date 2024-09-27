import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext.jsx";

function Homepage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth(); // Sử dụng authContext để kiểm tra trạng thái đăng nhập
  const { currentUser } = useAuth();


  // Kiểm tra currentAccount khi component được render
  useEffect(() => {
    console.log("Current account:", currentUser);
  }, [currentUser]);
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType !== "application/pdf") {
        setError("Please select a valid PDF file.");
        setFile(null);
      } else {
        setError(null);
        setFile(URL.createObjectURL(selectedFile));
      }
    }
  };

  const handleUpload = () => {
    if (file) {
      navigate("/flipbook", { state: { pdfFile: file } });
    } else {
      setError("No file selected or invalid file type.");
    }
  };

  const handleLogin = () => {
    navigate("/login"); // Điều hướng đến trang đăng nhập
  };

  return (
    <div className="homepage flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Nút Login ở góc trên bên phải */}
      <div className="absolute top-4 right-4">
        {!userLoggedIn && (
          <button
            onClick={handleLogin}
            className="px-4 py-2 font-semibold text-white bg-green-500 hover:bg-green-600 rounded"
          >
            Login
          </button>
        )}
      </div>

      {/* Nội dung trang */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Upload your PDF file
        </h1>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full mb-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleUpload}
          disabled={!file}
          className={`w-full px-4 py-2 font-semibold text-white rounded 
                      ${
                        file
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-blue-300 cursor-not-allowed"
                      }`}
        >
          Upload and View
        </button>
      </div>
    </div>
  );
}

export default Homepage;
