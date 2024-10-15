import { getDocument } from "pdfjs-dist";

// Function to read file data as an ArrayBuffer
export const readFileData = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
};

// Function to load PDF document
export const loadPdfDocument = async (pdfSource) => {
    let pdfData;

    // Check if the pdfSource is a URL or Blob
    if (typeof pdfSource === 'string') {
        // If it's a URL, fetch the PDF data from the URL
        const response = await fetch(pdfSource);
        if (!response.ok) {
            throw new Error(`Failed to fetch PDF from URL: ${response.statusText}`);
        }
        pdfData = await response.arrayBuffer();
    } else if (pdfSource instanceof Blob) {
        // If it's a Blob (e.g., from file input), read it as an array buffer
        pdfData = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(pdfSource);
        });
    } else {
        throw new Error('Invalid PDF source provided');
    }

    // Use PDF.js to load the document
    const pdf = await getDocument({ data: pdfData }).promise;
    return pdf;
};
