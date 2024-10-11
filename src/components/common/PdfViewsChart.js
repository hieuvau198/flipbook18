import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { fetchSavedPdfs, fetchTopPdfs } from '../../utils/firebaseUtils';

const PdfViewsChart = () => {
  const [pdfData, setPdfData] = useState([]);

  useEffect(() => {
    const getPdfData = async () => {
      try {
        const data = await fetchTopPdfs(7);
        setPdfData(data);
      } catch (error) {
        console.error("Error fetching PDF data for chart: ", error);
      }
    };

    getPdfData();
  }, []);

  const truncateLabel = (label) => {
    return label.length > 10 ? `${label.substring(0, 10)}...` : label;
  };

  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart data={pdfData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickFormatter={truncateLabel}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="views" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PdfViewsChart;
