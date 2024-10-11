import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchTotalDailyViews } from '../../utils/firebaseUtils';

const DailyViewChart = () => {
  const [totalDailyViews, setTotalDailyViews] = useState([]);

  useEffect(() => {
    const getTotalDailyViews = async () => {
      try {
        const viewsData = await fetchTotalDailyViews();
        setTotalDailyViews(viewsData);
      } catch (error) {
        console.error("Error fetching total daily views: ", error);
      }
    };

    getTotalDailyViews();
  }, []);

  return (
    <div>
      {totalDailyViews.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={totalDailyViews}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div>No data available for the selected period.</div>
      )}
    </div>
  );
};

export default DailyViewChart;
