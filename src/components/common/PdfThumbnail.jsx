// src/components/PdfThumbnail.jsx
import React, { useEffect, useRef } from 'react';
import { getDocument } from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/web/pdf_viewer.css'; // Optional, for viewer styles
const PdfThumbnail = ({ pdfUrl }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderPdf = async () => {
      const pdf = await getDocument(pdfUrl).promise;
      const page = await pdf.getPage(1); // Get the first page

      const scale = 0.5; // Adjust scale as needed
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
    };

    renderPdf();
  }, [pdfUrl]);

  return <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />;
};

export default PdfThumbnail;