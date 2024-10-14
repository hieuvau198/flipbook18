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
export const loadPdfDocument = async (file) => {
    const data = await readFileData(file);
    const pdf = await getDocument(data).promise;
    return pdf;
};
