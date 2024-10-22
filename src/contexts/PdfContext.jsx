import React, { createContext, useContext, useState } from "react";

const PdfContext = createContext();

export const PdfProvider = ({ children }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isRenderingFlipbook, setIsRenderingFlipbook] = useState(false); 
  
  return (
    <PdfContext.Provider value={{ pdfFile, setPdfFile, isRenderingFlipbook, setIsRenderingFlipbook }}>
      {children}
    </PdfContext.Provider>
  );
};

export const usePdf = () => {
  return useContext(PdfContext);
};
