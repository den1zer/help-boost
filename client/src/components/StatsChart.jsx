import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatsChart = ({ contributions }) => {

  const approved = contributions.filter(c => c.status === 'approved');

  const labels = [];
  const dataPoints = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const label = date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
    labels.push(label);

    let pointsToday = 0;
    for (const item of approved) {
      const itemDate = new Date(item.createdAt);
      if (itemDate.setHours(0,0,0,0) === date.setHours(0,0,0,0)) {
        pointsToday += item.pointsAwarded;
      }
    }
    dataPoints.push(pointsToday);
  }
  const data = {
    labels: labels, 
    datasets: [
      {
        label: 'Зароблені бали',
        data: dataPoints, 
        fill: false,
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        tension: 0.1, 
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
  };

  return <Line data={data} options={options} />;
};

export default StatsChart;