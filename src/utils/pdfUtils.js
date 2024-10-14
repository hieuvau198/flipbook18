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

// Function to convert PDF to images without resizing to A4
export const convertPdfToImages = async (file) => {
    const images = [];
    const data = await readFileData(file);
    const pdf = await getDocument(data).promise;
    const canvas = document.createElement("canvas");

    for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: 1 });
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the page onto the canvas
        await page.render({ canvasContext: context, viewport: viewport }).promise;

        // Convert the rendered canvas to an image data URL
        images.push(canvas.toDataURL());
    }

    canvas.remove();
    return images;
};
