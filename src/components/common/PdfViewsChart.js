// PdfViewsChart.js
import React, { useState, useEffect } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { fetchSavedPdfs } from '../../utils/firebaseUtils'; // Import your function to fetch data

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const PdfViewsChart = () => {
  const [pdfData, setPdfData] = useState([]);
  
  useEffect(() => {
    const getPdfData = async () => {
      try {
        const data = await fetchSavedPdfs();
        setPdfData(data);
      } catch (error) {
        console.error("Error fetching PDF data for chart: ", error);
      }
    };
    
    getPdfData();
  }, []);

  // Prepare dataPoints for the chart
  const dataPoints = pdfData.map(pdf => ({
    label: pdf.name,  // Use the PDF name as the label
    y: pdf.views      // Use the views as the data point value
  }));

  const options = {
    theme: "light2",
    animationEnabled: true,
    title: {
      text: ""
    },
    axisY: {
      title: "",
      includeZero: true
    },
    data: [{
      type: "column",  // Use a column chart to show views
      dataPoints: dataPoints
    }]
  };

  return (
    <div>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default PdfViewsChart;
