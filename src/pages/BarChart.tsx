import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ chartData }) => {
  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Stock Prices (Bar Chart)</h3>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Stock Prices for Last 3 Days',
              font: {
                size: 20,
              },
            },
            tooltip: {
              backgroundColor: '#333',
              titleFont: {
                size: 16,
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Days',
                font: {
                  size: 16,
                },
              },
            },
            y: {
              title: {
                display: true,
                text: 'Price (USD)',
                font: {
                  size: 16,
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
