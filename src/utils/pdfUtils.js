import { getDocument } from "pdfjs-dist";
import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
// Function to read file data as an ArrayBuffer
export const readFileData = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
};

// Function to convert PDF to images
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
        await page.render({ canvasContext: context, viewport: viewport }).promise;

        const imgDataUrl = canvas.toDataURL();
        const imgElement = new Image();
        imgElement.src = imgDataUrl;

        // Vẽ ảnh theo kích thước A4
        await drawImageToA4Size(imgElement); // Vẽ ảnh theo kích thước A4
        images.push(canvas.toDataURL()); // Đẩy kết quả đã xử lý vào mảng images
    }

    canvas.remove();
    return images;
};

// Hàm vẽ hình ảnh vào canvas có kích thước A4
export const drawImageToA4Size = (imageElement) => {
    return new Promise((resolve) => {
        // Tạo một canvas Fabric mới
        const canvas = new fabric.Canvas();
        const a4Width = 210 * 3.78;  // Chuyển đổi mm sang px
        const a4Height = 297 * 3.78; // Chuyển đổi mm sang px

        // Thiết lập kích thước canvas
        canvas.setWidth(a4Width);
        canvas.setHeight(a4Height);

        // Tính toán tỉ lệ để không bị cắt nội dung
        const imgRatio = imageElement.width / imageElement.height;
        const a4Ratio = a4Width / a4Height;

        let targetWidth, targetHeight;
        if (imgRatio > a4Ratio) {
            targetWidth = a4Width;
            targetHeight = a4Width / imgRatio;
        } else {
            targetHeight = a4Height;
            targetWidth = a4Height * imgRatio;
        }

        // Tạo đối tượng hình ảnh Fabric
        const imgInstance = new fabric.Image(imageElement, {
            left: (a4Width - targetWidth) / 2, // Canh giữa
            top: (a4Height - targetHeight) / 2, // Canh giữa
            scaleX: targetWidth / imageElement.width, // Tính tỉ lệ theo chiều rộng
            scaleY: targetHeight / imageElement.height // Tính tỉ lệ theo chiều cao
        });

        // Thêm hình ảnh vào canvas
        canvas.add(imgInstance);
        canvas.renderAll(); // Cập nhật canvas

        // Trả về hình ảnh đã được vẽ trên canvas A4
        resolve(canvas.toDataURL()); // Trả về kết quả là data URL
    });
};
