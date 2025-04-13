import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ chartData }) => {
  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Stock Prices (Pie Chart)</h3>
      <Pie
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Stock Price Distribution (Last 3 Days)',
              font: {
                size: 20,
              },
            },
            tooltip: {
              backgroundColor: '#333',
              titleFont: {
                size: 16,
              },
              callbacks: {
                label: (tooltipItem) => {
                  return `Price: $${tooltipItem.raw}`;
                },
              },
            },
          },
          cutout: '50%', // Donut style, can be adjusted
        }}
      />
    </div>
  );
};

export default PieChart;
