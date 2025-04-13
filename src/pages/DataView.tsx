// import React, { useEffect, useState } from 'react';
// import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonToast } from '@ionic/react';
// import { Bar, Pie } from 'react-chartjs-2';
// import Chart from 'chart.js/auto'; // Import chart.js components
// import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// // Register the necessary chart components
// Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// interface StockData {
//   date: string;
//   close: number;
// }

// const StockView: React.FC = () => {
//   const [stocks, setStocks] = useState<any[]>([]); // List of all available stocks (based on search)
//   const [searchQuery, setSearchQuery] = useState<string>(''); // Search input for stocks
//   const [selectedStock, setSelectedStock] = useState<StockData[]>([]); // Selected stock data for chart
//   const [loading, setLoading] = useState<boolean>(false); // Loading state
//   const [error, setError] = useState<string | null>(null); // Error state
//   const [currency, setCurrency] = useState<string>('usd'); // Preferred currency for stock prices
//   const [showToast, setShowToast] = useState(false); // Toast message for currency change

//   const apiKey = 'KIW24JFPGWH9VUAZ'; // Your Alpha Vantage API key

//   useEffect(() => {
//     if (searchQuery.length > 0) {
//       fetchStocks(searchQuery);
//     }
//   }, [searchQuery, currency]); // Re-fetch when currency changes

//   // Fetch stock data based on search query (e.g., stock symbols)
//   const fetchStocks = async (query: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${query}&apikey=${apiKey}`);
//       const data = await response.json();
//       if (data['Time Series (Daily)']) {
//         // Only keep the last 3 days of stock data
//         const stockData = Object.keys(data['Time Series (Daily)'])
//           .slice(0, 3) // Limit to 3 days
//           .map((date) => ({
//             date,
//             close: parseFloat(data['Time Series (Daily)'][date]['4. close']),
//           }));
//         setStocks(stockData);
//       } else {
//         setError('No data found for the given stock symbol.');
//       }
//     } catch (error) {
//       setError('Failed to fetch stock data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Chart data for the selected stock
//   const chartData = {
//     labels: selectedStock ? selectedStock.map((stock) => stock.date) : [],
//     datasets: [
//       {
//         label: `Stock Price (${currency.toUpperCase()})`,
//         data: selectedStock ? selectedStock.map((stock) => stock.close) : [],
//         fill: false,
//         borderColor: 'rgba(75,192,192,1)',
//         tension: 0.1,
//       },
//     ],
//   };

//   const barData = {
//     labels: selectedStock ? selectedStock.map((stock) => stock.date) : [],
//     datasets: [
//       {
//         label: `Stock Price (${currency.toUpperCase()})`,
//         data: selectedStock ? selectedStock.map((stock) => stock.close) : [],
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const pieData = {
//     labels: selectedStock ? selectedStock.map((stock) => stock.date) : [],
//     datasets: [
//       {
//         data: selectedStock ? selectedStock.map((stock) => stock.close) : [],
//         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
//       },
//     ],
//   };

//   const handleCurrencyChange = (value: string) => {
//     setCurrency(value);
//     setShowToast(true);
//   };

//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Stock Prices</IonTitle>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent className="ion-padding">
//         {/* Currency selection */}
//         <IonSelect value={currency} onIonChange={(e) => handleCurrencyChange(e.detail.value)}>
//           <IonSelectOption value="usd">USD - US Dollar</IonSelectOption>
//           <IonSelectOption value="eur">EUR - Euro</IonSelectOption>
//           <IonSelectOption value="inr">INR - Indian Rupee</IonSelectOption>
//         </IonSelect>

//         {/* Search Bar for Stocks */}
//         <IonSearchbar
//           value={searchQuery}
//           debounce={500}
//           onIonInput={(e) => setSearchQuery(e.detail.value!)}
//           placeholder="Search for a stock symbol (e.g., AAPL)"
//         />

//         {/* Error or Loading state */}
//         {loading && <p>Loading...</p>}
//         {error && <p style={{ color: 'red' }}>{error}</p>}

//         {/* List of searched stocks */}
//         <IonList>
//           {stocks.map((stock) => (
//             <IonItem key={stock.date} button onClick={() => setSelectedStock([stock])}>
//               <IonLabel>{stock.date} - ${stock.close}</IonLabel>
//             </IonItem>
//           ))}
//         </IonList>

//         {/* If a stock is selected, show its charts */}
//         {selectedStock.length > 0 && (
//           <>
//             <h2>Stock Data for {searchQuery.toUpperCase()}</h2>
//             <p>Price History (Last 3 days)</p>

//             {/* Render Bar chart */}
//             <Bar data={barData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />

//             {/* Render Pie chart */}
//             <Pie data={pieData} />

//           </>
//         )}

//         {/* Currency Change Toast */}
//         <IonToast
//           isOpen={showToast}
//           message={`Currency updated to ${currency.toUpperCase()}`}
//           duration={1500}
//           onDidDismiss={() => setShowToast(false)}
//         />
//       </IonContent>
//     </IonPage>
//   );
// };

// export default StockView;
import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonToast } from '@ionic/react';
import { Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; // Import chart.js components
import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary chart components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StockData {
  date: string;
  close: number;
}

const StockView: React.FC = () => {
  const [stocks, setStocks] = useState<any[]>([]); // List of all available stocks (based on search)
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search input for stocks
  const [selectedStock, setSelectedStock] = useState<StockData[]>([]); // Selected stock data for chart
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [currency, setCurrency] = useState<string>('usd'); // Preferred currency for stock prices
  const [showToast, setShowToast] = useState(false); // Toast message for currency change

  const apiKey = 'cvtnf99r01qjg1356gn0cvtnf99r01qjg1356gng'; // Finnhub API key

  useEffect(() => {
    if (searchQuery.length > 0) {
      fetchStocks(searchQuery);
    }
  }, [searchQuery, currency]); // Re-fetch when currency changes

  // Fetch stock data based on search query (e.g., stock symbols)
  const fetchStocks = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${query}&token=${apiKey}`);
      const data = await response.json();

      if (data) {
        const stockData = [
          {
            date: 'Today',
            close: data.c, // Current close price
          },
          {
            date: 'Yesterday',
            close: data.pc, // Previous close price
          },
          // You can add more logic for fetching historical data from Finnhub if available.
        ];
        setStocks(stockData);
      } else {
        setError('No data found for the given stock symbol.');
      }
    } catch (error) {
      setError('Failed to fetch stock data.');
    } finally {
      setLoading(false);
    }
  };

  // Chart data for the selected stock
  const chartData = {
    labels: selectedStock ? selectedStock.map((stock) => stock.date) : [],
    datasets: [
      {
        label: `Stock Price (${currency.toUpperCase()})`,
        data: selectedStock ? selectedStock.map((stock) => stock.close) : [],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const barData = {
    labels: selectedStock ? selectedStock.map((stock) => stock.date) : [],
    datasets: [
      {
        label: `Stock Price (${currency.toUpperCase()})`,
        data: selectedStock ? selectedStock.map((stock) => stock.close) : [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: selectedStock ? selectedStock.map((stock) => stock.date) : [],
    datasets: [
      {
        data: selectedStock ? selectedStock.map((stock) => stock.close) : [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Stock Prices</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Currency selection */}
        <IonSelect value={currency} onIonChange={(e) => handleCurrencyChange(e.detail.value)}>
          <IonSelectOption value="usd">USD - US Dollar</IonSelectOption>
          <IonSelectOption value="eur">EUR - Euro</IonSelectOption>
          <IonSelectOption value="inr">INR - Indian Rupee</IonSelectOption>
        </IonSelect>

        {/* Search Bar for Stocks */}
        <IonSearchbar
          value={searchQuery}
          debounce={500}
          onIonInput={(e) => setSearchQuery(e.detail.value!)}
          placeholder="Search for a stock symbol (e.g., AAPL)"
        />

        {/* Error or Loading state */}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* List of searched stocks */}
        <IonList>
          {stocks.map((stock) => (
            <IonItem key={stock.date} button onClick={() => setSelectedStock([stock])}>
              <IonLabel>{stock.date} - ${stock.close}</IonLabel>
            </IonItem>
          ))}
        </IonList>

        {/* If a stock is selected, show its charts */}
        {selectedStock.length > 0 && (
          <>
            <h2>Stock Data for {searchQuery.toUpperCase()}</h2>
            <p>Price History (Last 3 days)</p>

            {/* Render Bar chart */}
            <Bar data={barData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />

            {/* Render Pie chart */}
            <Pie data={pieData} />
          </>
        )}

        {/* Currency Change Toast */}
        <IonToast
          isOpen={showToast}
          message={`Currency updated to ${currency.toUpperCase()}`}
          duration={1500}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default StockView;
